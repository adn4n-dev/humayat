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
    }, 5000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 bg-dark-900 flex items-center justify-center transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center">
        <img
          src="https://i.hizliresim.com/jk59iyk.png"
          alt="Lord"
          className="w-64 h-64 mx-auto mb-6 rounded-lg"
        />
        <h1 className="text-3xl font-bold text-primary-300 mb-2">LORDUM TARAFINDAN KUTSANDIN</h1>
      </div>
    </div>
  );
};

export default SplashScreen;