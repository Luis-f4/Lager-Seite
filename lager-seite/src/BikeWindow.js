import './BikeWindow.css';
import { useNavigate } from 'react-router-dom'; // Importiere useNavigate

const BikeWindow = ({ bike }) => {
    const navigate = useNavigate(); // Hole die navigate Funktion von React Router

    const handleClick = () => {
        navigate(`/bike/${bike.FahrradID}`); // Navigiere zur BikeDetails-Seite
    };

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
                    <li>3/5 Todos</li>
                </ul>
            </div>
        </div>
    );
};

export default BikeWindow;
