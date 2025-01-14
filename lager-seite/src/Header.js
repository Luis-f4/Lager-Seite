import './Header.css';
import logo from './HORPLOGO.png';  
import { useEffect, useState } from "react";

const Header = () => {
    const [allIncome, setAllIncome] = useState("0");
    const [ranking, setRanking] = useState([]);  // Initialisiere als leeres Array
    
    useEffect(() => {
        const fetchAllIncome = async () => {
            try {
                const response = await fetch(`http://localhost:8080/getAllIncome`); 
                const data = await response.json();
                setAllIncome(data.totalIncome);
                console.log("allIncome: ", data.totalIncome);
    
            } catch (error) {
                console.error('Fehler beim Abrufen von Gesammteinnahmen:', error);
            }
        };

        const fetchRanking = async () => {
            try {
                const response = await fetch(`http://localhost:8080/getRanking`); 
                const data = await response.json();
                setRanking(data);
                console.log("Ranking: ", data);
    
            } catch (error) {
                console.error('Fehler beim Abrufen von Gesammteinnahmen:', error);
            }
        };
    
        fetchAllIncome();
        fetchRanking();
    }, []);

    return (
        <div className="Header">
            <div id='logo-div'>
                <img src={logo} alt="Logo" id='logo-IMG'/> 
            </div>

            <div id='stats-div'>
                <div id='score-board-div'>
                    <p id='worker-headline'>Top Verdiener:</p>
                    <ul id='ranking-list' className='ul-li-Header'> 
                        {/* Überprüfe, ob das Ranking-Array Daten enthält */}
                        {ranking.length > 0 && (
                            <>
                                <li className='ul-li-Header'>
                                    <span style={{color: "gold"}}>#1 {ranking[0].Name}</span>
                                </li>
                                <li className='ul-li-Header'>
                                    <span style={{color: "B2B9BC"}}>#2 {ranking[1].Name}</span>
                                </li>
                                <li className='ul-li-Header'>
                                    <span style={{color: "#CD7F32"}}>#3 {ranking[2].Name}</span>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                <div id='income-div'>
                    <p id='income-headline'>Gesammtverdienst:</p>
                    <p id='total-income-p'>{allIncome}€</p>
                </div>
            </div>
        </div>
    );
}

export default Header;
