import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PhotoProvider } from './context/PhotoContext';
import { UserProvider } from './context/UserContext';
import HomePage from './pages/HomePage';
import PhotoDetailPage from './pages/PhotoDetailPage';
import UploadPage from './pages/UploadPage';
import NotFoundPage from './pages/NotFoundPage';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ImageShare from './components/ImageShare';
import ImageDetail from './components/ImageDetail';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <Router>
        <UserProvider>
          <PhotoProvider>
            <div className="min-h-screen bg-dark-900 text-primary-300 flex flex-col">
              <Navbar />
              <main className="container mx-auto px-4 py-8 flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/photo/:id" element={<PhotoDetailPage />} />
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="/share" element={<ImageShare />} />
                  <Route path="/image/:id" element={<ImageDetail />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
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
    </ToastProvider>
  );
}

export default App;