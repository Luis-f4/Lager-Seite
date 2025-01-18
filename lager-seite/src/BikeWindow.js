import './BikeWindow.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importiere useNavigate

const BikeWindow = ({ bike }) => {
    const navigate = useNavigate(); // Hole die navigate Funktion von React Router
    const [todoStats, setTodoStats] = useState({ completed: 0, total: 0 }); 

    const handleClick = () => {
        navigate(`/bike/${bike.FahrradID}`); // Navigiere zur BikeDetails-Seite
    };

    ////
    //Anzahl gesammter und abgeschlossener Todos abfragen

    useEffect(() => {
        const fetchTodoStats = async () => {
            try {
                const response = await fetch(`http://85.215.204.43:8080/todoStats/${bike.FahrradID}`);
                if (!response.ok) {
                    throw new Error('Fehler beim Abrufen der Todo-Statistiken');
                }
                const data = await response.json();
                setTodoStats({ completed: data.abgeschlosseneTodos, total: data.anzahlTodos });
            } catch (error) {
                console.error('Fehler beim Abrufen der Todo-Statistiken:', error);
            }
        };
    
        fetchTodoStats();
    }, [bike.FahrradID]); // Effekt wird erneut ausgeführt, wenn sich die FahrradID ändert

    
    ////
    return (
        <div id="bike-window" onClick={handleClick} style={{ cursor: 'pointer' }}> {/* Füge den onClick-Event hinzu */}
            <div id='img-div'>
                <img 
                    src='https://th.bing.com/th/id/OIP._jaPsCTGHSYM8QNQGk-DAwHaG4?w=234&h=218&c=7&r=0&o=5&pid=1.7' 
                    alt='Bike'
                    style={{ width: '100%', height: '80%', objectFit: 'cover', margin: "10%" }} 
                />
            </div>
            <div id='text-div'>
                <h3>{bike.Name}</h3>
                <ul id='liste-BikeWindow'>
                    <li>Modell: {bike.Modell}</li>
                    <li>Status: {bike.Status}</li>
                    <li>{todoStats.completed}/{todoStats.total} Todos</li> 
                </ul>
            </div>
        </div>
    );
};

export default BikeWindow;
