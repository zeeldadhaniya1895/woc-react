import Home from "./pages/Home.jsx";
import "./index.css";
import Login from "./pages/loginForm.jsx";
import Signup from "./pages/signUpForm.jsx";
import Ide from "./pages/ide.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import authService from "./appwrite/auth.service.js";
import { useEffect, useState } from "react";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const user = authService.getStoredSession(); // Check localStorage for session
        setIsLoggedIn(!!user);
    }, []);

    const handleLogout = async () => {
        await authService.logout();
        setIsLoggedIn(false);
    };

    const ProtectedRoute = ({ children }) => {
        if (!isLoggedIn) {
            return <Navigate to="/" />;
        }
        return children;
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={isLoggedIn ? <Navigate to="/ide" /> : <Home />}
                />
                <Route
                    path="/login"
                    element={isLoggedIn ? <Navigate to="/ide" /> : <Login />}
                />
                <Route
                    path="/signup"
                    element={isLoggedIn ? <Navigate to="/ide" /> : <Signup />}
                />
                <Route
                    path="/ide"
                    element={
                        <ProtectedRoute>
                            <Ide onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
