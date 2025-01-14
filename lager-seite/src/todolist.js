import TodolistRow from "./todolistRow.js";
import { useParams } from "react-router-dom";
import './todolist.css';
import { useEffect, useState } from "react";

const Todolist = ({ bike }) => {  
    const [auftraege, setAuftraege] = useState(null);
    const [gesamtSumme, setGesamtSumme] = useState(0); // Für die Gesamtsumme
    const [anteile, setAnteile] = useState({
        Mischa: 0,
        Luis: 0,
        Rafik: 0
    }); // Für die Anteile

    const { id } = useParams(); 

    useEffect(() => {
        const fetchBikeDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/todolist/${bike.FahrradID}`); 
                const data = await response.json();
                setAuftraege(data);

                // Berechne die Gesamtsumme und die Anteile
                let summe = 0;
                let mischaAnteil = 0;
                let luisAnteil = 0;
                let rafikAnteil = 0;

                data.forEach(auftrag => {
                    summe += auftrag.geld;
                    // Verteile den Auftrag auf den entsprechenden Bearbeiter
                    if (auftrag.Bearbeiter === 2) {
                        mischaAnteil += auftrag.geld;
                    } else if (auftrag.Bearbeiter === 3) {
                        rafikAnteil += auftrag.geld;
                    } else if (auftrag.Bearbeiter === 1) {
                        luisAnteil += auftrag.geld;
                    }
                });

                setGesamtSumme(summe);
                setAnteile({
                    Mischa: mischaAnteil,
                    Luis: luisAnteil,
                    Rafik: rafikAnteil
                });

            } catch (error) {
                console.error('Fehler beim Abrufen der Todoliste:', error);
            }
        };

        fetchBikeDetails();
    }, [id]);

    return ( 
        <div id="todo-main-div">
            <div id="todo-header-div">
                <h2>TODO:</h2>
            </div>

            <div id="todoBody-div">
                {auftraege && auftraege.map((auftrag, index) => (
                    <TodolistRow key={index} auftrag={auftrag} />
                ))}
            </div>

            <div id="todo-footer-div">
                <div id="Note-div">
                    <p>Bemerkung:</p>
                    <input id="notiz-input" value={""}/> 
                </div>

                <div id="div-gesammt">
                    <p>Gesammt:</p>
                    <p className="geld">{gesamtSumme}€</p> {/* Zeigt die berechnete Gesamtsumme an */}
                </div>

                <div id="div-Anteile">
                    <p>Anteile:</p>
                    <p>Mischa: <span className="geld">{anteile.Mischa}€</span></p>
                    <p>Luis: <span className="geld">{anteile.Luis}€</span></p>
                    <p>Rafik: <span className="geld">{anteile.Rafik}€</span></p>
                </div>
            </div>
        </div>
    );
}

export default Todolist;
