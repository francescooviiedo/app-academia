import { createClient } from '@libsql/client';
import path from 'path';

const dbPath = `file:${path.resolve(process.cwd(), 'gym.db')}`;
const client = createClient({
  url: dbPath,
});

// Initialize schema
async function initDb() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS fichas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS exercicios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ficha_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      peso REAL DEFAULT 0,
      repeticoes_alvo INTEGER DEFAULT 10,
      timer_segundos INTEGER DEFAULT 60,
      FOREIGN KEY (ficha_id) REFERENCES fichas (id) ON DELETE CASCADE
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS historico_treinos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ficha_id INTEGER NOT NULL,
      data TEXT DEFAULT CURRENT_TIMESTAMP,
      finalizado INTEGER DEFAULT 0,
      FOREIGN KEY (ficha_id) REFERENCES fichas (id)
    );
  `);

  // Migrate existing table if needed
  try {
    await client.execute('ALTER TABLE historico_treinos ADD COLUMN finalizado INTEGER DEFAULT 0');
  } catch {
    // Column likely already exists
  }

  await client.execute(`
    CREATE TABLE IF NOT EXISTS historico_exercicios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      treino_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      reps INTEGER NOT NULL,
      peso REAL NOT NULL,
      FOREIGN KEY (treino_id) REFERENCES historico_treinos (id) ON DELETE CASCADE
    );
  `);
}

initDb().catch(console.error);

export default client;
