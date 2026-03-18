import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Service, Bank, Prospect, Card, AppSettings } from '../store';

export const generatePDFReport = (
  services: Service[],
  banks: Bank[],
  prospects: Prospect[],
  cards: Card[],
  settings: AppSettings
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Helper for currency
  const formatMoney = (amount: number) => {
    return `${amount.toLocaleString('fr-FR')} ${settings?.currency || 'XAF'}`;
  };

  // Header
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('Rapport Global des Cartes de Pointage', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  const dateStr = format(new Date(), "d MMMM yyyy 'à' HH:mm", { locale: fr });
  doc.text(`Généré le : ${dateStr}`, pageWidth / 2, 28, { align: 'center' });

  // Global Stats
  const activeCards = cards.filter(c => c.status === 'active');
  const totalSaved = activeCards.reduce((sum, c) => sum + (c.filledSlots * c.installmentAmount), 0);
  
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(`Total épargné (Cartes actives) : ${formatMoney(totalSaved)}`, 14, 40);

  let currentY = 50;
  let hasAnyData = false;

  // Group data
  services.forEach(service => {
    const serviceBanks = banks.filter(b => b.serviceId === service.id);
    let hasServiceTitle = false;

    serviceBanks.forEach(bank => {
      const bankProspects = prospects.filter(p => p.bankId === bank.id);
      const bankCards = cards.filter(c => bankProspects.some(p => p.id === c.prospectId));

      if (bankCards.length > 0) {
        hasAnyData = true;

        if (!hasServiceTitle) {
          // Print Service Title
          if (currentY > pageHeight - 40) { doc.addPage(); currentY = 20; }
          doc.setFontSize(16);
          doc.setTextColor(37, 99, 235); // blue-600
          doc.text(`Service : ${service.name}`, 14, currentY);
          currentY += 10;
          hasServiceTitle = true;
        }

        // Print Bank Title
        if (currentY > pageHeight - 40) { doc.addPage(); currentY = 20; }
        doc.setFontSize(14);
        doc.setTextColor(71, 85, 105); // slate-600
        doc.text(`Point de collecte : ${bank.name}`, 14, currentY);
        currentY += 5;

        // Prepare Table Data
        const tableBody = bankCards.map(card => {
          const prospect = bankProspects.find(p => p.id === card.prospectId);
          const saved = card.filledSlots * card.installmentAmount;
          
          let statusText = 'En cours';
          if (card.status === 'completed') statusText = 'Terminée';
          if (card.status === 'withdrawn') statusText = 'Retirée';
          
          return [
            prospect?.name || 'Inconnu',
            prospect?.phone || '-',
            card.objective,
            formatMoney(card.installmentAmount),
            `${card.filledSlots} / ${card.totalSlots}`,
            formatMoney(saved),
            statusText
          ];
        });

        autoTable(doc, {
          startY: currentY,
          head: [['Client', 'Téléphone', 'Objectif', 'Mise', 'Progression', 'Épargné', 'Statut']],
          body: tableBody,
          theme: 'striped',
          headStyles: { fillColor: [59, 130, 246] }, // blue-500
          styles: { fontSize: 9, cellPadding: 3 },
          margin: { left: 14, right: 14 },
          didDrawPage: (data) => {
            // Footer with signature and page number
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184); // slate-400
            
            // Signature bottom left
            doc.text("Propulsé par ebinasoft", 14, pageHeight - 10);
            
            // Page number bottom center
            const str = `Page ${(doc as any).internal.getNumberOfPages()}`;
            doc.text(str, pageWidth / 2, pageHeight - 10, { align: 'center' });
          }
        });

        currentY = (doc as any).lastAutoTable.finalY + 15;
      }
    });
  });

  if (!hasAnyData) {
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text("Aucune carte trouvée pour générer le rapport.", 14, currentY);
  }

  doc.save(`bamiko_rapport_${new Date().toISOString().split('T')[0]}.pdf`);
};
