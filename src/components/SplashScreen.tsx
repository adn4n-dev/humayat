import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onFinish, 1000);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative w-64 h-64 mb-8">
        <img
          src="https://hizliresim.com/gqdtxtq"
          alt="Humayat"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">LORDUM TARAFINDAN KUTSANDIN</h1>
        <img
          src="https://i.ibb.co/ZX4THDs/image.png"
          alt="Lord"
          className="w-48 h-48 object-contain mx-auto"
        />
      </div>
    </div>
  );
};

export default SplashScreen;