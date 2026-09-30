import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ReportCrime from './pages/ReportCrime.jsx';
import MyReports from './pages/MyReports.jsx';
import ReportDetails from './pages/ReportDetails.jsx';
import SafePlaces from './pages/SafePlaces.jsx';
import EmergencyContacts from './pages/EmergencyContacts.jsx';
import SOS from './pages/SOS.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import NotFound from './pages/NotFound.jsx';

function GuestOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<ReportCrime />} />
        <Route path="/reports" element={<MyReports />} />
        <Route path="/reports/:id" element={<ReportDetails />} />
        <Route path="/safe-places" element={<SafePlaces />} />
        <Route path="/contacts" element={<EmergencyContacts />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
