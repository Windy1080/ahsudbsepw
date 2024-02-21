const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');

const app = express();


// Middleware zum Verarbeiten von JSON-Anfragedaten
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));
// Statische Dateien aus dem 'public'-Verzeichnis servieren
app.use(express.static('public'));
const port = process.env.PORT || 3000;

// Konfiguration für PostgreSQL-Datenbankverbindung
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'culturebeans',
  password: 'root',
  port: 5432, // Standard-PostgreSQL-Port
});

async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    console.log('Verbindung zur Datenbank erfolgreich hergestellt');
    client.release(); // Verbindung freigeben
  } catch (error) {
    console.error('Fehler bei der Verbindung zur Datenbank:', error);
  }
}

// Rufen Sie die Testfunktion auf
testDatabaseConnection();

// Endpunkt zum laden der Einträge der Datenbank
app.get('/api/inventory', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventory'); // Angenommen, Ihre Tabelle heißt 'inventory'
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route zum Löschen eines Eintrags
app.delete('/api/deleteEntry/:id', async (req, res) => {
  const { id } = req.params; // Extrahieren der ID aus den URL-Parametern

  try {
    // SQL-Statement zum Löschen des Eintrags
    const deleteQuery = 'DELETE FROM inventory WHERE id = $1';
    const result = await pool.query(deleteQuery, [id]);

    if (result.rowCount === 0) {
      // Kein Eintrag gefunden, der gelöscht werden kann
      return res.status(404).json({ message: 'Eintrag nicht gefunden' });
    }

    // Erfolgreiches Löschen des Eintrags
    res.status(200).json({ message: 'Eintrag erfolgreich gelöscht' });
  } catch (error) {
    // Fehlerbehandlung
    console.error('Fehler beim Löschen des Eintrags:', error);
    res.status(500).json({ error: 'Fehler beim Löschen des Eintrags' });
  }
});


// Endpunkt zum Einfügen eines Eintrags in die Datenbank
app.post('/api/insertEntry', async (req, res) => {
  try {
    // Extrahieren Sie die erforderlichen Daten aus dem Request
    const { process_id, process, item, amount, package_size, unit } = req.body;


    // Führen Sie die Datenbankoperationen hier durch
    // Stellen Sie sicher, dass die Spaltennamen mit Ihrer Datenbanktabelle übereinstimmen
    await pool.query('INSERT INTO inventory (process_id, process, item, amount, package_size, unit) VALUES ($1, $2, $3, $4, $5, $6)', [process_id, process, item, amount, package_size, unit]);

    console.log("body1: ", req.body);
    // Senden Sie eine Erfolgsantwort
    res.status(200).json({ message: 'Eintrag erfolgreich in die Datenbank eingefügt' });
  } catch (error) {
    console.error('Fehler beim Einfügen in die Datenbank:', req.body);
    // Senden Sie eine Fehlerantwort
    console.log(error.stack)
    res.status(500).json({ error: error.stack });
  }
});

// Server starten
app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
