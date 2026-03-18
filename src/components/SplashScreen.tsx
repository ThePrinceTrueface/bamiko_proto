import React from 'react';
import { motion } from 'motion/react';

export default function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-blue-600"
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
        >
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 141.1759490966797 207.58829926194198" width="141" height="207">
            <defs>
              <style>
                {`@font-face { font-family: Nunito; src: url(data:font/woff2;base64,d09GMgABAAAAAAT0AA8AAAAACbwAAAScAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGhwbgXYcZAZgP1NUQVREAFwRCAqGQIU8CxYAATYCJAMoBCAFhCQHIBsfCFGUT84MZF8c2ER2LYbBI4/QUKrPchbGfVwYBHQpcxaCvxYU6PH809rv3Dezi5gmjdA0aSJFUiJ1coTMv/85vRRI51XRV2VUTEMI4DVA3m08fN7er6IkCyywwDofxEnYuDQeSHc5Jz4feE97SbEuGZQm7QDzviwWJyD/fwEu1la9RUKHKNoIlZQpRdwS08W8QWmQoFkye00f0tdP35nv3j5URrddFBNJjFBovLpgHlBKNDGYFsGsCz3+NWp7Bfro1WWgc6mpAi0A70bCWamrECGH19UnX77NKh8C+PIqaGQZJ19CzO9cu0ODJs8a8qFMappuj6n1BTuRt5iwqBN/Lo5S2gjBPIQZI7yYf2Kye1voAjaTDrKlbYjYud24h+EkN//ITBDCNGFUcknTm9v8GahSOQDvYJTsSMQpixKQ+fPyj8OfZ9j+/i+mL7k6Rr2Qv/5xfCd21n3kPO6u5k0KX4FuFCpiXUATFScAQSB9/kChYZ1fsC7gBVg0rYyefRFIFFglH2VLzTNfGzy3nIeUqqW7zoJ1YJ6MIAlgHgL+Dvm9FYmnTDMzd4vzixcy99Xx19Pj1hGCUetperxcjhFZBkE1VFY+VEmMUlAUoeMyxykUU68raRpUkR3AyNVay+XjBJcey8b7zFg1b958dr9yCgv5rClHrSMIesERWWZk4Y1aXydbS6BIkOGQrFqBjhV4h+zZq42rR/QyiMyZc9ZQ41ZJsyiMdLZB+rNMvym1fTU5byO9gJy8dNsSpSU8IAfas8YrT8RpQmSdcsGOAqO5uVyh+3JvY6vsPVP9QuOzQzU0Y0UZebFFfRUtV2JOJ8UHBAfH+yedjtudkBDg5wdu34TdeCxyS7F2CLfzKhyWNjj7OSbmqLsZW5e6WM0wsm33/+J7Eqmd9izjmHClbGeWjlVouo1tRpiIzWb0qtlo1Y6dIQbo7EwvO5nrYcQ93GS2Vlyg/4aTvtI3PCflLjRw8vQj0822sV3P7mLHkccPvRvW1XUzvHv5rOOjW3fVw7T1Jn+4fprc54zuTjDnPzFVbOZSqwx//6B4v/Ma4oLgIO8oO/OMMCHbzYi7WTJkv4dvWFLkK7ZarJzgDHY6pjbQtzXRz6QgMDTLzItAC6pwqWe0Q4itWbJ/TmJ+mH2IjXn8DpIKkLezn5PskUjXSCTrIJzBBwipXuADEDb5bQN5BASA9xnKqrdSxZoBX0V+3gsAuM2ulAPAPbeVnv9VBHQHvhYAIRIAEPBopakFURkAgrWcii/cajUyi4GHtwiQEPvXwvJHbCtEfLnAAf6fRwAoBQTq8OcQ5LfRxoGH6FQBLMOPlEJwcYZC0rCPwhOhq5LfThGQKiALsW5UgsK8UwjBbsKAnX1LJ2L4hBRfVDuMXwKLYsX0RSb48YAh4PBMexaVwIRmXCbdl21bdXkGxnsMnXEtUhFNFR01jZh5aO9gb1bKmeE8mWORfdHH1SeclYyfQDceve3jGmrqWogrHoPMuOhIh0SMn77xIxYTD09oJ3JzLDXdGAaqqjiCVo7G4FvFj1yp4cB4xJEx2HsZYzJUqVby5/lZ7CZb2gc=); }`}
              </style>
            </defs>
            <rect x="0" y="0" width="141.1759490966797" height="207.58829926194198" fill="transparent"></rect>
            <g strokeLinecap="round" transform="translate(75.68707912973241 11.414167834928548) rotate(24.491901028231535 10.076763737756892 30.71013710554496)">
              <path d="M5.04 0 C8.6 0, 12.16 0, 15.12 0 C18.47 0, 20.15 1.68, 20.15 5.04 C20.15 20.44, 20.15 35.83, 20.15 56.38 C20.15 59.74, 18.47 61.42, 15.12 61.42 C11.33 61.42, 7.55 61.42, 5.04 61.42 C1.68 61.42, 0 59.74, 0 56.38 C0 44.48, 0 32.58, 0 5.04 C0 1.68, 1.68 0, 5.04 0" stroke="none" strokeWidth="0" fill="#ffffff"></path>
              <path d="M5.04 0 C8.74 0, 12.45 0, 15.12 0 M5.04 0 C8.4 0, 11.75 0, 15.12 0 M15.12 0 C18.47 0, 20.15 1.68, 20.15 5.04 M15.12 0 C18.47 0, 20.15 1.68, 20.15 5.04 M20.15 5.04 C20.15 17.76, 20.15 30.48, 20.15 56.38 M20.15 5.04 C20.15 21.31, 20.15 37.58, 20.15 56.38 M20.15 56.38 C20.15 59.74, 18.47 61.42, 15.12 61.42 M20.15 56.38 C20.15 59.74, 18.47 61.42, 15.12 61.42 M15.12 61.42 C12.72 61.42, 10.32 61.42, 5.04 61.42 M15.12 61.42 C12.82 61.42, 10.53 61.42, 5.04 61.42 M5.04 61.42 C1.68 61.42, 0 59.74, 0 56.38 M5.04 61.42 C1.68 61.42, 0 59.74, 0 56.38 M0 56.38 C0 37.86, 0 19.34, 0 5.04 M0 56.38 C0 37.04, 0 17.7, 0 5.04 M0 5.04 C0 1.68, 1.68 0, 5.04 0 M0 5.04 C0 1.68, 1.68 0, 5.04 0" stroke="transparent" strokeWidth="2" fill="none"></path>
            </g>
            <g strokeLinecap="round" transform="translate(41.28212865367652 46.39493338171292) rotate(62.87869659584129 10.076763737756892 30.71013710554496)">
              <path d="M5.04 0 C7.47 0, 9.89 0, 15.12 0 C18.47 0, 20.15 1.68, 20.15 5.04 C20.15 15.86, 20.15 26.67, 20.15 56.38 C20.15 59.74, 18.47 61.42, 15.12 61.42 C12.63 61.42, 10.15 61.42, 5.04 61.42 C1.68 61.42, 0 59.74, 0 56.38 C0 40.87, 0 25.35, 0 5.04 C0 1.68, 1.68 0, 5.04 0" stroke="none" strokeWidth="0" fill="#ffffff"></path>
              <path d="M5.04 0 C7.33 0, 9.63 0, 15.12 0 M5.04 0 C8.48 0, 11.91 0, 15.12 0 M15.12 0 C18.47 0, 20.15 1.68, 20.15 5.04 M15.12 0 C18.47 0, 20.15 1.68, 20.15 5.04 M20.15 5.04 C20.15 24.38, 20.15 43.72, 20.15 56.38 M20.15 5.04 C20.15 20.03, 20.15 35.03, 20.15 56.38 M20.15 56.38 C20.15 59.74, 18.47 61.42, 15.12 61.42 M20.15 56.38 C20.15 59.74, 18.47 61.42, 15.12 61.42 M15.12 61.42 C12.4 61.42, 9.69 61.42, 5.04 61.42 M15.12 61.42 C12.41 61.42, 9.71 61.42, 5.04 61.42 M5.04 61.42 C1.68 61.42, 0 59.74, 0 56.38 M5.04 61.42 C1.68 61.42, 0 59.74, 0 56.38 M0 56.38 C0 35.9, 0 15.42, 0 5.04 M0 56.38 C0 45.48, 0 34.58, 0 5.04 M0 5.04 C0 1.68, 1.68 0, 5.04 0 M0 5.04 C0 1.68, 1.68 0, 5.04 0" stroke="transparent" strokeWidth="2" fill="none"></path>
            </g>
            <g strokeLinecap="round" transform="translate(32.98079471733354 73.89010300902123) rotate(328.2405199151874 10.076763737756892 30.71013710554496)">
              <path d="M5.04 0 C7.06 0, 9.08 0, 15.12 0 C18.47 0, 20.15 1.68, 20.15 5.04 C20.15 18.09, 20.15 31.15, 20.15 56.38 C20.15 59.74, 18.47 61.42, 15.12 61.42 C12.61 61.42, 10.11 61.42, 5.04 61.42 C1.68 61.42, 0 59.74, 0 56.38 C0 45.32, 0 34.26, 0 5.04 C0 1.68, 1.68 0, 5.04 0" stroke="none" strokeWidth="0" fill="#ffffff"></path>
              <path d="M5.04 0 C7.96 0, 10.87 0, 15.12 0 M5.04 0 C7.94 0, 10.85 0, 15.12 0 M15.12 0 C18.47 0, 20.15 1.68, 20.15 5.04 M15.12 0 C18.47 0, 20.15 1.68, 20.15 5.04 M20.15 5.04 C20.15 17.71, 20.15 30.39, 20.15 56.38 M20.15 5.04 C20.15 19.88, 20.15 34.73, 20.15 56.38 M20.15 56.38 C20.15 59.74, 18.47 61.42, 15.12 61.42 M20.15 56.38 C20.15 59.74, 18.47 61.42, 15.12 61.42 M15.12 61.42 C13.08 61.42, 11.05 61.42, 5.04 61.42 M15.12 61.42 C12.62 61.42, 10.12 61.42, 5.04 61.42 M5.04 61.42 C1.68 61.42, 0 59.74, 0 56.38 M5.04 61.42 C1.68 61.42, 0 59.74, 0 56.38 M0 56.38 C0 36.17, 0 15.97, 0 5.04 M0 56.38 C0 36.02, 0 15.66, 0 5.04 M0 5.04 C0 1.68, 1.68 0, 5.04 0 M0 5.04 C0 1.68, 1.68 0, 5.04 0" stroke="transparent" strokeWidth="2" fill="none"></path>
            </g>
            <g strokeLinecap="round" transform="translate(72.70656155429901 89.10052341327741) rotate(327.9278189006407 10.076763737756892 22.266307462819213)">
              <path d="M5.04 0 C8.52 0, 12 0, 15.12 0 C18.47 0, 20.15 1.68, 20.15 5.04 C20.15 13.1, 20.15 21.16, 20.15 39.49 C20.15 42.85, 18.47 44.53, 15.12 44.53 C12.88 44.53, 10.65 44.53, 5.04 44.53 C1.68 44.53, 0 42.85, 0 39.49 C0 28.78, 0 18.07, 0 5.04 C0 1.68, 1.68 0, 5.04 0" stroke="none" strokeWidth="0" fill="#ffffff"></path>
              <path d="M5.04 0 C7.15 0, 9.27 0, 15.12 0 M5.04 0 C7.4 0, 9.76 0, 15.12 0 M15.12 0 C18.47 0, 20.15 1.68, 20.15 5.04 M15.12 0 C18.47 0, 20.15 1.68, 20.15 5.04 M20.15 5.04 C20.15 17.89, 20.15 30.74, 20.15 39.49 M20.15 5.04 C20.15 12.48, 20.15 19.93, 20.15 39.49 M20.15 39.49 C20.15 42.85, 18.47 44.53, 15.12 44.53 M20.15 39.49 C20.15 42.85, 18.47 44.53, 15.12 44.53 M15.12 44.53 C11.2 44.53, 7.28 44.53, 5.04 44.53 M15.12 44.53 C12.8 44.53, 10.48 44.53, 5.04 44.53 M5.04 44.53 C1.68 44.53, 0 42.85, 0 39.49 M5.04 44.53 C1.68 44.53, 0 42.85, 0 39.49 M0 39.49 C0 29.01, 0 18.52, 0 5.04 M0 39.49 C0 30.68, 0 21.86, 0 5.04 M0 5.04 C0 1.68, 1.68 0, 5.04 0 M0 5.04 C0 1.68, 1.68 0, 5.04 0" stroke="transparent" strokeWidth="2" fill="none"></path>
            </g>
            <g transform="translate(10 152.58829926194198) rotate(0 60.587974548339844 22.5)">
              <text x="0" y="34.344" fontFamily="Nunito, sans-serif, Segoe UI Emoji" fontSize="36px" fill="#ffffff" textAnchor="start" style={{ whiteSpace: 'pre' }} direction="ltr" dominantBaseline="alphabetic">Bamiko</text>
            </g>
          </svg>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="pb-10"
      >
        <p className="text-white/80 text-sm font-medium tracking-wider">
          Propulsé par <span className="font-bold text-white">ebinasoft</span>
        </p>
      </motion.div>
    </motion.div>
  );
}
