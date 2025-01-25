import React, { useEffect, useState } from 'react';
import './MainContent.css';
import BikeWindow from './BikeWindow';
import { useNavigate } from 'react-router-dom';

const MainContent = () => {
    const [bikes, setBikes] = useState([]); // Zustand für die Bikes
    const [searchQuery, setSearchQuery] = useState(''); // Zustand für die Suchleiste
    const navigate = useNavigate(); 

    // Funktion zum Abrufen der Daten
    const fetchData = async (query = '') => {
        try {
            const response = await fetch(`http://85.215.204.43:8080/getBikes/${query}`); // API-Aufruf mit dem Suchbegriff
            const data = await response.json();
            setBikes(data); // Speichere die Daten im Zustand
        } catch (error) {
            console.error('Fehler beim Abrufen der Daten:', error);
        }
    };

    // useEffect zum Abrufen der Daten bei der Initialisierung und beim Ändern des Suchbegriffs
    useEffect(() => {
        // Debounce-Mechanismus: API-Aufruf nur nach einer kurzen Verzögerung
        const timeoutId = setTimeout(() => {
            fetchData(searchQuery); // Abrufen der Daten mit dem aktuellen Suchbegriff
        }, 300); // 300ms Verzögerung

        return () => clearTimeout(timeoutId); // Timeout bei neuen Eingaben abbrechen
    }, [searchQuery]); // Wird jedes Mal ausgeführt, wenn sich searchQuery ändert

    const handleClick = () => {
        navigate(`/create`); 
    };

    return (
        <div id="MainContent-div">
            <div id='searchbar-div'>
                {/* Eingabe für die Suchleiste */}
                <input
                    type='text'
                    id='Searchbar'
                    placeholder='Suche nach Bikes...'
                    value={searchQuery} // Wert aus dem Zustand
                    onChange={(e) => setSearchQuery(e.target.value)} // Aktualisiere searchQuery bei Eingaben
                />
                <select name="dropdown" id="dropdown">
                    <option value="Alter">Alter</option>
                    <option value="wert">wert</option>
                    <option value="wert">Standzeit 1</option>
                    <option value="wert">Standzeit 2</option>
                </select>
            </div>

            <div id='Create-button-div' onClick={handleClick}>
                <p id='creatbutton'>+</p>
            </div>

            <div id='content-div'>
                {/* Rendere für jedes Bike ein BikeWindow */}
                {bikes.map((bike, index) => (
                    <BikeWindow key={index} bike={bike} />
                ))}
            </div>
        </div>
    );
};

export default MainContent;
