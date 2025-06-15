import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add global styles for animations and transitions
const style = document.createElement('style');
style.textContent = `
  /* Base transitions */
  * {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }

  /* Animations */
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  /* Animation classes */
  .animate-slideDown {
    animation: slideDown 0.3s ease-out forwards;
  }

  .animate-slideUp {
    animation: slideUp 0.3s ease-out forwards;
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }

  .animate-scaleIn {
    animation: scaleIn 0.2s ease-out forwards;
  }

  /* Scrollbar styles */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #1f2024;
  }

  ::-webkit-scrollbar-thumb {
    background: #2f3238;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #373b42;
  }
`;
document.head.appendChild(style);

// Kalp yağmuru animasyonu
function HeartRain() {
  // 20 kalp oluştur, sadece kırmızı kalp
  return (
    <>
      {Array.from({ length: 20 }).map((_, i) => (
        <span
          key={i}
          className="heart-emoji"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            top: `${Math.random() * 80 + 10}%`,
            zIndex: 1,
            userSelect: 'none',
            fontFamily: 'Playfair Display, serif',
            color: '#ff0000',
            filter: 'drop-shadow(0 0 8px #ff0000)'
          }}
        >
          ❤
        </span>
      ))}
    </>
  );
}

const rootElement = document.getElementById('root');
createRoot(rootElement!).render(
  <StrictMode>
    <>
      <HeartRain />
      <App />
    </>
  </StrictMode>
);