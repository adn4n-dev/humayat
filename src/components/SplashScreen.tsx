import React, { useEffect } from 'react';
import splashImage from '../assets/splash.jpg';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full border-4 border-primary-600">
          <img
            src={splashImage}
            alt="Splash"
            className="w-full h-full object-cover filter grayscale"
          />
        </div>
        <h1 className="text-2xl font-bold text-primary-300 mb-2">Humayat</h1>
        <p className="text-primary-400">Yükleniyor...</p>
      </div>
    </div>
  );
};

export default SplashScreen;