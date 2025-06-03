import LoginPage from "../src/components/auth/LoginPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import RegistrationPage from "../src/components/auth/RegistrationPage";
import UserManagementPage from "../src/components/userspage/UserManagementPage";
import UpdateUser from "../src/components/userspage/UpdateUser";
import MonitoringDashboard from "./MonitoringDashboard";
import { AuthProvider, AuthContext } from "./components/auth/AuthContext";
import { useContext } from "react";
import React from "react";

const ProtectedRoute = ({ children, requiredRole }) => {
	const { isAuthenticated, isAdmin } = useContext(AuthContext);

	if (!isAuthenticated) {
		return <Navigate to="/login" />;
	}

	// If the user is authenticated but not an admin, redirect based on the required role
	if (
		requiredRole &&
		((requiredRole === "ADMIN" && !isAdmin) ||
			(requiredRole === "USER" && isAdmin))
	) {
		return <Navigate to="/monitoring" />;
	}

	return React.cloneElement(children, { userRole: isAdmin ? "ADMIN" : "USER" });
};

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<div className="App">
					<Navbar />
					<div className="content">
						<Routes>
							{/* Public Routes */}
							<Route path="/" element={<LoginPage />} />
							<Route path="/login" element={<LoginPage />} />

							{/* Admin-only Routes */}
							<Route
								path="/register"
								element={
									<ProtectedRoute requiredRole="ADMIN">
										<RegistrationPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/admin/user-management"
								element={
									<ProtectedRoute requiredRole="ADMIN">
										<UserManagementPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/update-user/:userId"
								element={
									<ProtectedRoute requiredRole="ADMIN">
										<UpdateUser />
									</ProtectedRoute>
								}
							/>
                            {/* Allow both roles to access monitoring dash */}
							<Route
								path="/monitoring"
								element={
									<ProtectedRoute>
										<MonitoringDashboard />
									</ProtectedRoute>
								}
							/>

							{/* 404 Redirect */}
							<Route path="*" element={<Navigate to="/login" />} />
						</Routes>
					</div>
					<Footer />
				</div>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
