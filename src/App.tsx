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
import { Toaster } from 'react-hot-toast';
import Navbar from './components/common/Navbar';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      <UserProvider>
        <PhotoProvider>
          <div className="min-h-screen bg-dark-900 text-primary-300">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/photo/:id" element={<PhotoDetailPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#1f2024',
                  color: '#fff',
                  border: '1px solid #2f3238',
                },
              }}
            />
          </div>
        </PhotoProvider>
      </UserProvider>
    </Router>
  );
}

export default App;