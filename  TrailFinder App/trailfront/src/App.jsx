import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import AuthPage from './pages/AuthPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import TrailPage from './pages/TrailPage.jsx';
import './App.css'
import SpecifyProjectionPage from './pages/SpecifyProjectionPage.jsx';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const LoginRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Navigate to="/profile" replace /> : <AuthPage />;
};

function AppContent() {
    const [status, setStatus] = useState('');
    const { isLoading } = useAuth();

    useEffect(() => {
        async function checkConnection() {
            try {
                const response = await fetch('http://localhost:65535/check-db-connection', {
                    mode: "cors"
                });
                const text = await response.text();
                setStatus(text);
            } catch (err) {
                setStatus('connection timed out');
            }
        }

        checkConnection();
    }, []);

    useEffect(() => {
        async function initializeDB() {
            if (status) {
                await fetch("http://localhost:65535/initialize", {
                    method: 'POST'
                });
            }
        }

        // initializeDB(); // Use this code to initialize the DB on tunnel connection success
    }, [status]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Router>
                <Navbar status={status} />
                <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<LoginRoute />} />
                    <Route element={<PrivateRoute />}>
                        <Route path="/home" element={<HomePage />} />
                    </Route>
                    <Route element={<PrivateRoute />}>
                        <Route path="/profile" element={<ProfilePage />} />
                    </Route>
                    <Route element={<PrivateRoute />}>
                        <Route path="/trail" element={<TrailPage />} />
                    </Route>
                    <Route element={<PrivateRoute />}>
                        <Route path="/projectionpage" element={<SpecifyProjectionPage />} />
                    </Route>
                </Routes>
            </Router>
        </>
    )
}


function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App
