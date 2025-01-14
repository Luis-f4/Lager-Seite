import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './Header';
import MainContent from './MainContent';
import BikeDetails from './BikeDetails';
import CreateBike from './createBike';
import PasswordPage from './PasswordPage'; // Importiere die Passwortseite
import './App.css';

function App() {
  const location = useLocation();
  const [accessGranted, setAccessGranted] = useState(false);

  // Beim ersten Laden prüfen, ob der Benutzer bereits Zugang hat (localStorage)
  useEffect(() => {
    const storedAccess = localStorage.getItem('access_granted');
    if (storedAccess === 'true') {
      setAccessGranted(true);
    }
  }, []);

  const handleAccessGranted = () => {
    localStorage.setItem('access_granted', 'true'); // Speichere den Zugang im localStorage
    setAccessGranted(true); // Setze den Zustand auf "Zugriff gewährt"
  };

  // Zeige die Passwortseite an, wenn der Zugriff nicht gewährt wurde
  if (!accessGranted) {
    return <PasswordPage onAccessGranted={handleAccessGranted} />;
  }

  return (
    <div className="App">
      {/* Header nur anzeigen, wenn wir nicht auf der /bike/:id oder /create Route sind */}
      {!location.pathname.startsWith('/bike/') && location.pathname !== '/create' && <Header />}

      {/* Routes werden nur angezeigt, wenn der Zugriff gewährt wurde */}
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/bike/:id" element={<BikeDetails />} />
        <Route path="/create" element={<CreateBike />} />
      </Routes>
    </div>
  );
}

export default App;
