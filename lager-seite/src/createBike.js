import React, { useState } from 'react';
import logo from './HORPLOGO.png';
import { useNavigate } from "react-router-dom";
import './createBike.css';

const CreateBike = () => {
    const [image, setImage] = useState(null); // Zustand für das Bild
    const [todos, setTodos] = useState([]); // Zustand für die Liste der Todos
    const [formData, setFormData] = useState({
        name: '',
        modell: '',
        groesse: '',
        schaltung: '',
        kaufdatum: '',
        einkaufspreis: '',
        verkaufspreis: '',
        notiz: ''
    }); // Zustand für die Eingabefelder
    const navigate = useNavigate();

    const handleImageChange = (event) => {
        setImage(event.target.files[0]); // Bild im Zustand speichern
    };

    const handleFileSelect = () => {
        document.getElementById("BikeImage").click();
    };

    const handleAddTodo = () => {
        setTodos([...todos, { name: '', preis: '' }]); // Leeres Todo-Objekt zur Liste hinzufügen
    };

    const handleTodoChange = (index, field, value) => {
        const updatedTodos = [...todos];
        updatedTodos[index][field] = value;
        setTodos(updatedTodos);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        const data = new FormData();

        // Füge die Felddaten hinzu
        data.append('name', formData.name);
        data.append('modell', formData.modell);
        data.append('groesse', formData.groesse);
        data.append('schaltung', formData.schaltung);
        data.append('kaufdatum', formData.kaufdatum);
        data.append('einkaufspreis', formData.einkaufspreis);
        data.append('verkaufspreis', formData.verkaufspreis);
        data.append('notiz', formData.notiz);

        // Füge die Todos als JSON hinzu
        data.append('todos', JSON.stringify(todos));

        // Füge das Bild hinzu, falls vorhanden
        if (image) {
            data.append('image', image);
        }

        // Sende die Daten an die API
        try {
            const response = await fetch('http://localhost:8080/createBike', {
                method: 'POST',
                body: data
            });

            if (response.ok) {
                alert('Fahrrad erfolgreich erstellt');
                navigate('/'); // Zurück zur Startseite
            } else {
                alert('Fehler beim Erstellen des Fahrrads');
            }
        } catch (error) {
            console.error('Fehler beim Senden der Daten:', error);
            alert('Fehler beim Senden der Daten');
        }
    };

    return (
        <div id='Main-Div-Create'>
            <img 
                src={logo} 
                alt="Logo" 
                id='logo-IMG'
                className="logo-BikeDetails" 
                onClick={() => navigate("/")} 
            /> 
            
            <div id='Main-Div-Create-Details'>
                <div id='div-Bike-details'>
                    <h1>Fahrrad</h1>

                    <div id='inputrDiv-BikeDetails'>

                        <div className='input-CreateBike-DIV'>
                            <label htmlFor="Name">Name:</label>
                            <input type="text" id="Name" name="name" onChange={handleInputChange} />
                        </div>

                        <div className='input-CreateBike-DIV'>
                            <label htmlFor="Modell">Modell:</label>
                            <input type="text" id="Modell" name="modell" onChange={handleInputChange} />
                        </div>

                        <div className='input-CreateBike-DIV'>
                            <label htmlFor="Größe">Größe:</label>
                            <input type="text" id="Größe" name="groesse" onChange={handleInputChange} />
                        </div>

                        <div className='input-CreateBike-DIV'>
                            <label htmlFor="Schaltung">Schaltung:</label>
                            <input type="text" id="Schaltung" name="schaltung" onChange={handleInputChange} />
                        </div>

                        <div className='input-CreateBike-DIV'>
                            <label htmlFor="Kaufdatum">Kaufdatum:</label>
                            <input type="date" id="Kaufdatum" name="kaufdatum" onChange={handleInputChange} />
                        </div>

                        <div className='input-CreateBike-DIV'>
                            <label htmlFor="Einkaufspreis">Einkaufspreis:</label>
                            <input type="text" id="Einkaufspreis" name="einkaufspreis" onChange={handleInputChange} />
                        </div>

                        <div className='input-CreateBike-DIV'>
                            <label htmlFor="Verkaufspreis">Verkaufspreis:</label>
                            <input type="text" id="Verkaufspreis" name="verkaufspreis" onChange={handleInputChange} />
                        </div>

                        <div className='input-CreateBike-DIV'>
                            <label htmlFor="Notiz">Notiz:</label>
                            <input type="text" id="Notiz" name="notiz" onChange={handleInputChange} />
                        </div>

                        <div className='input-CreateBike-DIV'>
                            <label htmlFor="BikeImage">Bild hochladen:</label>
                            <input 
                                type="file" 
                                id="BikeImage" 
                                name="BikeImage" 
                                accept="image/*" 
                                onChange={handleImageChange} 
                                style={{ display: 'none' }} // Verstecke das Eingabefeld
                            />
                            <button type="button" onClick={handleFileSelect}>
                                {image ? image.name : 'Datei auswählen'} 
                            </button>
                        </div>
                    </div>
                </div>

                <div id='div-todos'>
                    <h2>Todos</h2>
                    <div id='hauptdiv-test'>
                        <div id='titel-todo-create'>
                            <p>Name</p>
                            <p>Preis</p>
                        </div>

                        <div id='todos-erstellt-div'>
                            {todos.map((todo, index) => (
                                <div key={index} className='todo-inputs'>
                                    <input 
                                        type="text" 
                                        value={todo.name} 
                                        onChange={(e) => handleTodoChange(index, 'name', e.target.value)} 
                                        placeholder="Name" 
                                        id='nameAuftrag'
                                    />
                                    <input 
                                        type="text" 
                                        value={todo.preis} 
                                        onChange={(e) => handleTodoChange(index, 'preis', e.target.value)} 
                                        placeholder="€" 
                                        id='preisAuftrag'
                                    />
                                </div>
                            ))}
                        </div>

                        <div id='neues-todo-create'>
                            <p id='neuesTodo-Button' onClick={handleAddTodo}>+</p> 
                        </div>
                    </div>

                    <div id='erstellen-knopf-div'>
                        <p id='fahrradErstellen' onClick={handleSubmit}>Erstellen</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateBike;
