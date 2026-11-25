import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Services from './pages/Services';
import Contact from './pages/Contact';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminProjectForm from './pages/admin/AdminProjectForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminServices from './pages/admin/AdminServices';
import AdminProfile from './pages/admin/AdminProfile';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminSettings from './pages/admin/AdminSettings';

const App = () => {
  return (
    <SiteProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Portfolio Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin Login (Public) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route
                  path="/admin"
                  element={<Navigate to="/admin/dashboard" replace />}
                />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/projects" element={<AdminProjects />} />
                <Route
                  path="/admin/projects/new"
                  element={<AdminProjectForm />}
                />
                <Route
                  path="/admin/projects/edit/:id"
                  element={<AdminProjectForm />}
                />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/services" element={<AdminServices />} />
                <Route path="/admin/profile" element={<AdminProfile />} />
                <Route path="/admin/enquiries" element={<AdminEnquiries />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </SiteProvider>
  );
};

export default App;
