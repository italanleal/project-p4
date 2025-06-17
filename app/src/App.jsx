import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import UserProfile from './pages/UserProfile.jsx';
import Callback from './components/Callback.jsx'; // importe seu Callback
import { currentToken, getToken, getUserData, refreshToken } from './auth/auth';
import { useEffect, useState } from 'react';
import Home from "@/pages/Home.jsx";

function isTokenExpired() {
  const expires = currentToken.expires;
  if (!expires) return true;
  const now = new Date();
  const expiryDate = new Date(expires);
  return now >= expiryDate;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const exchangeTokens = async () => {
      if (!currentToken.access_token) return;

      if (isTokenExpired()) {
        const token = await refreshToken();
        if (token.access_token) {
          currentToken.save(token);
        } else {
          setUser(null);
          return;
        }
      }

      const userData = await getUserData();
      if (userData) setUser(userData);
    };

    exchangeTokens();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    // navegação simples para login
    window.location.href = '/login';
  };

  const handleRefresh = async () => {
    const token = await refreshToken();
    if (token.access_token) {
      currentToken.save(token);
      const userData = await getUserData();
      setUser(userData);
    }
  };

  return (
      <Router>
        <Routes>
          <Route
              path="/login"
              element={!currentToken.access_token || !user ? <Home /> : <Navigate to="/" />}
          />
          <Route
              path="/callback"
              element={<Callback setUser={setUser} />}
          />
          <Route
              path="/"
              element={currentToken.access_token && user ? (
                  <Dashboard user={user} onLogout={handleLogout} onRefresh={handleRefresh} />
              ) : (
                  <Navigate to="/login" />
              )}
          />
          <Route
              path="/profile"
              element={currentToken.access_token && user ? (
                  <UserProfile user={user} onLogout={handleLogout} onRefresh={handleRefresh} />
              ) : (
                  <Navigate to="/login" />
              )}
          />
        </Routes>
      </Router>
  );
}

export default App;
