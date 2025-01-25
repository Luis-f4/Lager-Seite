import React, { useEffect, useState } from 'react';
import './MainCOntent.css';
import BikeWindow from './BikeWindow';
import { useNavigate } from 'react-router-dom';

const MainContent = () => {
    const [bikes, setBikes] = useState([]); // Zustand für die Bikes
    const navigate = useNavigate(); 
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                //const response = await fetch('http://localhost:8080/allBikes'); echte adresse
                if(searchTerm != "" && searchTerm != " "){
                    const response = await fetch(`http://85.215.204.43:8080/getBikes/${searchTerm}`);
                }else{
                    const response = await fetch('http://85.215.204.43:8080/allBikes'); // adresse damit es im localen netzwerk funktioniert
                }
                const data = await response.json();
                setBikes(data); // Speichere die Daten im Zustand
            } catch (error) {
                console.error('Fehler beim Abrufen der Daten:', error);
            }
        };

        fetchData();
    }, []); 

    const handleClick = () => {
        navigate(`/create`); 
    };
    

    return (
        <div id="MainContent-div">
            <div id='searchbar-div'>
                <input 
                type='text' 
                id='Searchbar'     
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} />
                
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
                {/* Hier werden für jeden Bike-Datensatz ein BikeWindow gerendert */}
                {bikes.map((bike, index) => (
                    <BikeWindow key={index} bike={bike} />
                ))}
            </div>
        </div>
    );
};

export default MainContent;
