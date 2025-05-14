import LoginPage from '../src/components/auth/LoginPage'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProfilePage from '../src/components/userspage/ProfilePage';
import UserService from './components/service/UserService';
import RegistrationPage from '../src/components/auth/RegistrationPage';
import UserManagementPage from '../src/components/userspage/UserManagementPage';
import UpdateUser from '../src/components/userspage/UpdateUser';
import { AuthProvider } from './components/auth/AuthContext';
import MonitoringDashboard from './MonitoringDashboard';



function App() {
  return (
      <BrowserRouter>
        <AuthProvider>
          <div className="App">
            <Navbar />
            <div className="content">
              <Routes>
                <Route exact path="/" element={<LoginPage />} />
                <Route exact path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/*Check if user is authenticated and admin, before rendering admin-only routes*/}
                {UserService.adminOnly() && (
                    <>
                      <Route path="/register" element={<RegistrationPage />}  />
                      <Route path="/admin/user-management" element={<UserManagementPage />} />
                      <Route path="update-user/:userId" element={<UpdateUser />} />
                      <Route path="/monitoring" element={<MonitoringDashboard />} />
                    </>
                )}
                <Route path='*' element={<Navigate to="/login" />} />%
              </Routes>
            </div>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>

  );
}

export default App;
