import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { TripDetails } from './pages/TripDetails';
import { SharedTrip } from './pages/SharedTrip';
import { Settings } from './pages/Settings';
import { AdminDashboard } from './pages/AdminDashboard';
import { CreateTrip } from './pages/CreateTrip';
import { Explore } from './pages/Explore';
import { Community } from './pages/Community';
import { TripCalendar } from './pages/TripCalendar';
import { TripBudget } from './pages/TripBudget';
import { ProtectedRoute } from './components/ProtectedRoute';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public marketing landing page */}
        <Route path="/" element={<Landing />} />

        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />

        {/* Secure User Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/trips" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/trips/new" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
        <Route 
          path="/trips/:id" 
          element={
            <ProtectedRoute>
              <TripDetails />
            </ProtectedRoute>
          } 
        />
        <Route path="/trips/:id/calendar" element={<ProtectedRoute><TripCalendar /></ProtectedRoute>} />
        <Route path="/trips/:id/budget" element={<ProtectedRoute><TripBudget /></ProtectedRoute>} />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route path="/profile" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Public Shared view */}
        <Route path="/shared/:shareKey" element={<SharedTrip />} />

        {/* Fallback routing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
