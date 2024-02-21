const { Pool } = require('pg');

// Konfiguration für die Verbindung zur PostgreSQL-Datenbank
const pool = new Pool({
  user: 'culturebeans',
  host: 'localhost',
  database: 'culturebeans',
  password: 'culture',
  port: 5432, // Standard-Port für PostgreSQL
});

// Funktion zum Ausführen von SQL-Abfragen
async function query(text, params) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

module.exports = {
  query,
};

const db = require('./db'); // Importieren Sie die db.js-Datei

async function insertEntry(artikel, menge, preis) {
  const queryText = 'INSERT INTO inventar (artikel, menge, preis) VALUES ($1, $2, $3) RETURNING *';
  const values = [artikel, menge, preis];

  try {
    const result = await db.query(queryText, values);
    return result.rows[0]; // Gibt den eingefügten Eintrag zurück
  } catch (error) {
    console.error('Fehler beim Einfügen des Eintrags:', error);
    throw error;
  }
}

module.exports = {
  insertEntry,
};
