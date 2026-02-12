import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignupPage from './pages/signup'
import Login from './pages/login'
import HomePage from './pages/home'
import UserDashboard from './pages/user-dashboard'
import AdminDashboard from './pages/admin-dashboard'
import UnauthorizedPage from './pages/unauthorized'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Protected Routes */}
        {/* User Dashboard */}
        <Route
          path="/dashboard/my-profile"
          element={
            <ProtectedRoute requiredRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
