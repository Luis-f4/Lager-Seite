import React, { useState } from 'react';
import './todolistRow.css';

const TodolistRow = ({ auftrag }) => {
    const [selectedBearbeiter, setSelectedBearbeiter] = useState(auftrag.Bearbeiter);
    const [isChecked, setIsChecked] = useState(auftrag.status === 'Erledigt'); // Für Checkbox Status

    console.log("YDYDYD afutrag: ", auftrag);
    // Mapping von Bearbeiter-IDs zu Namen
    const bearbeiterMapping = {
        1: "Luis",
        2: "Mischa",
        3: "Rafik",
        4: "Frei"
    };

    // Umkehrmapping von Namen zu Bearbeiter-IDs
    const reverseMapping = {
        "Luis": 1,
        "Mischa": 2,
        "Rafik": 3,
        "Frei": 4
    };

    // Funktion, die bei Änderung des Dropdowns aufgerufen wird
    const handleDropdownChange = async (event) => {
        const selectedName = event.target.value;
        const newBearbeiterId = reverseMapping[selectedName];

        console.log("Ausgewählter Bearbeiter Name:", selectedName); // Zum Debuggen
        console.log("Neue Bearbeiter-ID:", newBearbeiterId); // Zum Debuggen
        
        setSelectedBearbeiter(newBearbeiterId); // Aktualisiere die ausgewählte Bearbeiter-ID

        // Ändere den Status basierend auf der Auswahl im Dropdown
        let newStatus = auftrag.status;

        if (newBearbeiterId === 4) { // Wenn "Frei" ausgewählt wird
            newStatus = 'Frei';
        } else if (auftrag.status !== 'Erledigt') { // Wenn nicht "Frei" und nicht "Erledigt", dann "In Bearbeitung"
            newStatus = 'In Bearbeitung';
        }

        // Sende die aktualisierten Daten an den Server
        await sendUpdateToServer({ ...auftrag, Bearbeiter: newBearbeiterId, status: newStatus });
    };

    // Funktion, die bei Änderung der Checkbox aufgerufen wird
    const handleCheckboxChange = async (event) => {
        const checked = event.target.checked;

        // Checkbox darf nur geklickt werden, wenn der Bearbeiter nicht "Frei" ist
        if (selectedBearbeiter !== 4) { // 4 = Frei
            setIsChecked(checked); // Update Checkbox-Status im UI
    
            // Sende die Aktualisierung an den Server
            await sendUpdateToServer({
                AuftragID: auftrag.AuftragID, // Stelle sicher, dass AuftragID korrekt übergeben wird
                Bearbeiter: selectedBearbeiter,
                status: checked ? 'Erledigt' : 'In Bearbeitung', // Wenn abgecheckt, dann "Erledigt", sonst "In Bearbeitung"
                geld: auftrag.geld,
                Beschreibung: auftrag.Beschreibung
            });

            // Anhand des Status der Checkbox, Anzahl erledigter Todos erhöhen oder verringern
            if (checked) {
                await incrementTodos(auftrag.AuftragID);  // Anzahl erledigter Todos erhöhen
            } else {
                await reduceTodos(auftrag.AuftragID);  // Anzahl erledigter Todos senken
            }
        }
    };

    // API-Aufruf zum Erhöhen der Anzahl erledigter Todos
    const incrementTodos = async (AuftragID) => {
        try {
            const response = await fetch(`http://85.215.204.43:8080/increment/${AuftragID}`, {
                method: 'PATCH', // PATCH-Methode
            });

            if (response.ok) {
                console.log("Anzahl erledigter Todos erfolgreich erhöht.");
            } else {
                console.error("Fehler beim Erhöhen der Anzahl erledigter Todos:", response.statusText);
            }
        } catch (error) {
            console.error("Fehler bei der Anfrage zum Erhöhen der Todos:", error);
        }
    };

    // API-Aufruf zum Senken der Anzahl erledigter Todos
    const reduceTodos = async (AuftragID) => {
        try {
            const response = await fetch(`http://85.215.204.43:8080/reduce/${AuftragID}`, {
                method: 'PATCH', // PATCH-Methode
            });

            if (response.ok) {
                console.log("Anzahl erledigter Todos erfolgreich verringert.");
            } else {
                console.error("Fehler beim Verringern der Anzahl erledigter Todos:", response.statusText);
            }
        } catch (error) {
            console.error("Fehler bei der Anfrage zum Verringern der Todos:", error);
        }
    };

    // Funktion, um die Aktualisierung an den Server zu senden
    const sendUpdateToServer = async (updatedAuftrag) => {
        try {
            const response = await fetch('http://85.215.204.43:8080/updateTodo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedAuftrag)
            });

            console.log("updatedAuftrag: ", updatedAuftrag);

            if (response.ok) {
                console.log("Update erfolgreich:", updatedAuftrag);
            } else {
                console.error("Fehler beim Update:", response.statusText);
            }
        } catch (error) {
            console.error("Fehler beim Senden des Updates:", error);
        }
    };

    return (
        <div id="row-main-div">
            {/* Checkbox ist deaktiviert, wenn der Bearbeiter "Frei" ist */}
            <input 
                type="checkbox" 
                checked={isChecked} 
                onChange={handleCheckboxChange} 
                disabled={selectedBearbeiter === 4} // Deaktivieren, wenn Bearbeiter "Frei" ist
            />

            <p id="description-todo-row">{auftrag.Beschreibung}</p>

            <select 
                name="dropdown" 
                id="dropdown" 
                value={bearbeiterMapping[selectedBearbeiter]} 
                onChange={handleDropdownChange}
            >
                <option value="Frei">Frei</option>
                <option value="Mischa">Mischa</option>
                <option value="Rafik">Rafik</option>
                <option value="Luis">Luis</option>
            </select>

            <p className="geld">{auftrag.geld}€</p>
        </div>
    );
};

export default TodolistRow;
