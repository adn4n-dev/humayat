import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PhotoProvider } from './context/PhotoContext';
import { UserProvider } from './context/UserContext';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import PhotoDetailPage from './pages/PhotoDetailPage';
import UploadPage from './pages/UploadPage';
import NotFoundPage from './pages/NotFoundPage';
import SplashScreen from './components/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <UserProvider>
        <PhotoProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/photo/:id" element={<PhotoDetailPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </PhotoProvider>
      </UserProvider>
    </Router>
  );
}

export default App;