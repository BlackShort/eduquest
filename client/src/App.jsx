import { Home } from './pages/home';
import { Route, Routes } from 'react-router'
import { AuthPage } from './pages/login';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/code" element={<Home />} />
        <Route path="/content" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;