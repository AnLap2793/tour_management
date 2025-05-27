import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { userService } from './services/userService';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

// User Pages
import Home from './pages/user/Home';
import Tours from './pages/user/Tours';
import TourDetail from './pages/user/TourDetail';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Profile from './pages/user/Profile';
import Checkout from './pages/user/Checkout';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminTours from './pages/admin/Tours';
import AdminBookings from './pages/admin/Bookings';
import AdminCategories from './pages/admin/Categories';
import AdminLocations from './pages/admin/Locations';
import AdminDepartureLocations from './pages/admin/DepartureLocations';
import AdminReviews from './pages/admin/Reviews';
import AdminProfile from './pages/admin/Profile';
import AdminChangePassword from './pages/admin/ChangePassword';

// Styles
import './App.css';

// Protected Route Components
const ProtectedRoute = ({ children }) => {
  if (!userService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  if (!userService.isAuthenticated() || !userService.isAdmin()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="tours" element={<Tours />} />
        <Route path="tours/:id" element={<TourDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        {/* Protected User Routes */}
        <Route path="checkout/:id" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="profile/*" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Route>

      {/* Admin Auth Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="tours" element={<AdminTours />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="locations" element={<AdminLocations />} />
        <Route path="departure-locations" element={<AdminDepartureLocations />} />
        <Route path="reviews" element={<AdminReviews />} />

      <Route path="profile" element={<AdminProfile />} />
      <Route path="change-password" element={<AdminChangePassword />} />

      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;