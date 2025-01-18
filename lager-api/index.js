const express = require('express');
const mysql = require('mysql2/promise'); // Promise-basierte Version von mysql2 verwenden
const cors = require('cors'); // CORS-Modul importieren
const multer = require('multer');

const app = express();
const port = 8080;

// CORS aktivieren
app.use(cors());

// Datenbankverbindung (Promise-basiert)
let db;
(async function initializeDB() {
  try {
    db = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'LuisXeniaLina',
      database: 'lager'
    });
    console.log('Mit der MySQL-Datenbank verbunden');
  } catch (err) {
    console.error('Fehler bei der Datenbankverbindung:', err);
  }
})();

// Middleware, um JSON zu verwenden
app.use(express.json());

// Beispielroute: Alle Einträge aus einer Tabelle abrufen
app.get('/test', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM user');
    res.json(results);
  } catch (err) {
    console.error('Fehler beim Abrufen der Daten:', err);
    res.status(500).send('Fehler beim Abrufen der Daten');
  }
});

app.get('/allBikes', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM fahrrad');
    res.json(results);
  } catch (err) {
    console.error('Fehler beim Abrufen der Daten:', err);
    res.status(500).send('Fehler beim Abrufen der Daten');
  }
});

app.get('/bike/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [results] = await db.query('SELECT * FROM fahrrad WHERE FahrradID = ?', [id]);
    res.json(results);
  } catch (err) {
    console.error('Fehler beim Abrufen der Daten:', err);
    res.status(500).send('Fehler beim Abrufen der Daten');
  }
});

app.get('/todolist/:Bikeid', async (req, res) => {
  const Bikeid = req.params.Bikeid;
  const query = `
    SELECT a.AuftragID, a.Beschreibung, a.status, a.geld, t.Titel, a.Bearbeiter 
    FROM auftrag a
    JOIN todoliste t ON a.TodolisteID = t.TodolisteID
    JOIN fahrrad f ON t.FahrradID = f.FahrradID
    WHERE f.FahrradID = ?`;

  try {
    const [results] = await db.query(query, [Bikeid]);
    res.json(results);
  } catch (err) {
    console.error('Fehler beim Abrufen der Daten:', err);
    res.status(500).send('Fehler beim Abrufen der Daten');
  }
});

app.get('/getAllIncome', async (req, res) => {
  const query = `SELECT SUM(Income) AS totalIncome FROM bearbeiter WHERE BearbeiterID <= 3`;
  try {
    const [results] = await db.query(query);
    res.json({ totalIncome: results[0].totalIncome });
  } catch (err) {
    console.error('Fehler beim Abrufen der Daten:', err);
    res.status(500).send('Fehler beim Abrufen der Daten');
  }
});

app.get('/getRanking', async (req, res) => {
  const query = `SELECT * FROM bearbeiter WHERE BearbeiterID <= 3 ORDER BY Income DESC;`;
  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error('Fehler beim Abrufen der Daten:', err);
    res.status(500).send('Fehler beim Abrufen der Daten');
  }
});

// Route zum Aktualisieren eines Auftrags
app.post('/updateTodo', async (req, res) => {
  const { AuftragID, Bearbeiter, status, geld, Beschreibung } = req.body;

  if (!AuftragID) {
    return res.status(400).send('AuftragID fehlt');
  }

  const query = `
    UPDATE auftrag 
    SET Bearbeiter = ?, status = ?, geld = ?, Beschreibung = ? 
    WHERE AuftragID = ?`;

  try {
    await db.query(query, [Bearbeiter, status, geld, Beschreibung, AuftragID]);

    // Einkommen aktualisieren
    updateIncome(async (updateErr) => {
      if (updateErr) {
        return res.status(500).send('Fehler beim Aktualisieren des Einkommens');
      }

      // Fahrradstatus aktualisieren
      updateFahrradStatus((fahrradErr) => {
        if (fahrradErr) {
          return res.status(500).send('Fehler beim Aktualisieren des Fahrradstatus');
        }

        res.send('Auftrag, Einkommen und Fahrradstatus erfolgreich aktualisiert');
      });
    });
  } catch (err) {
    console.error('Fehler beim Aktualisieren des Auftrags:', err);
    res.status(500).send('Fehler beim Aktualisieren des Auftrags');
  }
});

// Funktion zur Aktualisierung des Einkommens
async function updateIncome(callback) {
  const bearbeiterIds = [1, 2, 3]; // IDs der Bearbeiter, deren Einkommen aktualisiert werden soll
  let completedRequests = 0;

  async function updateBearbeiterIncome(bearbeiterId) {
    const querySum = `SELECT SUM(geld) AS total FROM auftrag WHERE Bearbeiter = ? AND Status = 'Erledigt'`;

    try {
      const [result] = await db.query(querySum, [bearbeiterId]);

      if (!result || result.length === 0) {
        console.error(`Keine Ergebnisse für Bearbeiter-ID ${bearbeiterId}`);
        return;
      }

      const totalIncome = result[0].total || 0;
      const updateQuery = `UPDATE bearbeiter SET Income = ? WHERE BearbeiterID = ?`;

      await db.query(updateQuery, [totalIncome, bearbeiterId]);
      console.log(`Einkommen für Bearbeiter ${bearbeiterId} erfolgreich aktualisiert: ${totalIncome}`);
      completedRequests++;

      if (completedRequests === bearbeiterIds.length) {
        callback(null); // Kein Fehler
      }
    } catch (err) {
      console.error('Fehler beim Aktualisieren der Income:', err);
      callback(err);
    }
  }

  bearbeiterIds.forEach(bearbeiterId => {
    updateBearbeiterIncome(bearbeiterId);
  });
}

// Funktion zur Aktualisierung des Fahrradstatus
async function updateFahrradStatus(callback) {
  try {
    const [fahrradIDsResult] = await db.query(`SELECT FahrradID FROM fahrrad`);
    const fahrradIDs = fahrradIDsResult.map(row => row.FahrradID);

    await Promise.all(fahrradIDs.map(async (fahrradID) => {
      const [todolistResult] = await db.query(`SELECT * FROM todoliste WHERE FahrradID = ?`, [fahrradID]);

      await Promise.all(todolistResult.map(async (todolist) => {
        const todolistID = todolist.TodolisteID;

        const [auftragResult] = await db.query(`SELECT * FROM auftrag WHERE TodolisteID = ?`, [todolistID]);
        const auftragStatusArr = auftragResult.map(row => row.Status);

        let neuerStatus;
        if (auftragStatusArr.length === 0) {
          neuerStatus = 'Frei';
        } else if (auftragStatusArr.every(status => status === 'Erledigt')) {
          neuerStatus = 'Standzeit2';
        } else if (auftragStatusArr.every(status => status === 'Frei')) {
          neuerStatus = 'Frei';
        } else {
          neuerStatus = 'Standzeit1';
        }

        await db.query(`UPDATE fahrrad SET Status = ? WHERE FahrradID = ?`, [neuerStatus, fahrradID]);
        console.log(`Fahrrad ${fahrradID} erfolgreich aktualisiert auf Status: ${neuerStatus}`);
      }));
    }));

    callback(null); // Erfolgreich
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Fahrradstatus:', error);
    callback(error); // Fehler zurückgeben
  }
}


// Funktion um gesammte und abgeschlossene Todos zu sehen
app.get('/todoStats/:Bikeid', async (req, res) => {
  const Bikeid = req.params.Bikeid;
  const query = `
    SELECT abgeschlosseneTodos, anzahlTodos
    FROM todoliste
    WHERE f.FahrradID = ?`;

  try {
    const [results] = await db.query(query, [Bikeid]);
    res.json(results);
  } catch (err) {
    console.error('Fehler beim Abrufen der Daten:', err);
    res.status(500).send('Fehler beim Abrufen der Daten');
  }
});

















const upload = multer({ dest: 'uploads/' });

// Neues Fahrrad erstellen
app.post('/createBike', upload.single('image'), async (req, res) => {
  const { name, modell, groesse, schaltung, kaufdatum, einkaufspreis, verkaufspreis, notiz, todos } = req.body;
  const image = req.file; // Das hochgeladene Bild

  try {
      // Fahrrad in die Datenbank einfügen
      const query = `
          INSERT INTO fahrrad (Name, Modell, Groeße, Schaltung, Kaufdatum, Einkaufspreis, Verkaufspreis, Notiz)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await db.query(query, [name, modell, groesse, schaltung, kaufdatum, einkaufspreis, verkaufspreis, notiz]);

      // Todos in die Datenbank einfügen, falls vorhanden
      const parsedTodos = JSON.parse(todos);
  
          // 1. neue todoliste erstellen 
          const fahrradID = result.insertId; 
          const query2 = `INSERT INTO todoliste (FahrradID, Titel, Notiz, anzahlTodos) VALUES (?, ?, ?, ?)`;
          const [result2] = await db.query(query2, [fahrradID, name, notiz, parsedTodos.length]);
          const todolistID = result2.insertId;

          // 2. todos in die liste hinzufügen
          const defaultBearbeiterID = 4;
          const defaultStatus = "Frei";
          const todoQuery = `INSERT INTO auftrag (TodolisteID, Beschreibung, Summe, Bearbeiter, Status, geld) VALUES ?`;
          const todoValues = parsedTodos.map(todo => [todolistID, todo.name, todo.preis, defaultBearbeiterID, defaultStatus, todo.preis]);  // Füge den Bearbeiter hinzu
          await db.query(todoQuery, [todoValues]);
      

      res.status(200).send('Fahrrad und Todos erfolgreich erstellt');
  } catch (err) {
      console.error('Fehler beim Speichern in der Datenbank:', err);
      res.status(500).send('Fehler beim Speichern in der Datenbank');
  }
});

// Server starten
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
