import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from './HORPLOGO.png';
import './BikeDetails.css';  
import Todolist from "./todolist.js";


const BikeDetails = () => {
    const { id } = useParams(); 
    const [bike, setBike] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBikeDetails = async () => { 
            try {
                const response = await fetch(`http://85.215.204.43:8080/bike/${id}`); // Hol die Details für das spezifische Bike
                const data = await response.json();
                
                // Überprüfe, ob das Ergebnis ein Array ist, und nimm das erste Element
                if (Array.isArray(data) && data.length > 0) {
                    setBike(data[0]);
                } else {
                    console.error('Keine Daten gefunden');
                }
            } catch (error) {
                console.error('Fehler beim Abrufen der Bike-Details:', error);
            }
        };

        fetchBikeDetails();
    }, [id]);

    if (!bike) {
        return <p>Lade Bike-Details...</p>;
    }

    return (
        <div id="main-div-BikeDetails">
            <img src={logo} alt="Logo" id='logo-IMG' className="logo-BikeDetails" onClick={() => navigate("/")}/> 

            <div id="header-BikeDetails">
                <div id="imgBike-div">
                    <img src="https://www.laufradxl.de/images/laufrad-puky-pukylino-retro-grun-3035-1.jpg" id='imgBike'/>
                </div>

                <div id='BikeDetails-div'>
                    <h2 id="Ueberschrift-BikeDetails">{bike.Name}</h2>
                    <ul>
                        <p>Gekauft: 2024-05-09</p>
                        <p>Einkaufspreis: {bike.Einkaufspreis}€</p>
                        <p>Modell: {bike.Modell}</p>
                        <p>Größe: {bike.Groeße} Zoll</p>
                        <p>Schaltung: {bike.Schaltung}</p>
                        <p>Status: {bike.Status}</p>
                    </ul>
                </div> 
            </div>

            <div id="todolist-div">
                <Todolist bike={bike}/> {/* Komponente großgeschrieben */}
            </div>
        </div>
    );
};

export default BikeDetails;


