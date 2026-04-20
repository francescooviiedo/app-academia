'use server';

import client from './db';
import { revalidatePath } from 'next/cache';

export interface Ficha {
  id: number;
  nome: string;
  ja_realizado?: number | boolean;
}

export interface Exercicio {
  id: number;
  ficha_id: number;
  nome: string;
  peso: number;
  repeticoes_alvo: number;
  timer_segundos: number;
}

export async function createFicha(nome: string, exercicios: { nome: string; reps: number; peso: number; timer: number }[]) {
  const res = await client.execute({
    sql: 'INSERT INTO fichas (nome) VALUES (?)',
    args: [nome]
  });
  
  const fichaId = Number(res.lastInsertRowid);

  for (const ex of exercicios) {
    await client.execute({
      sql: `INSERT INTO exercicios (ficha_id, nome, repeticoes_alvo, peso, timer_segundos)
            VALUES (?, ?, ?, ?, ?)`,
      args: [fichaId, ex.nome, ex.reps, ex.peso, ex.timer]
    });
  }

  revalidatePath('/');
}

export async function getFichas() {
  const res = await client.execute(`
    SELECT f.*, 
    EXISTS (
      SELECT 1 FROM historico_treinos ht 
      WHERE ht.ficha_id = f.id 
      AND date(ht.data, 'localtime') = date('now', 'localtime') 
      AND ht.finalizado = 1
    ) as ja_realizado
    FROM fichas f
  `);
  return res.rows as unknown as Ficha[];
}

export async function getExercicios(fichaId: number) {
  const res = await client.execute({
    sql: 'SELECT * FROM exercicios WHERE ficha_id = ?',
    args: [fichaId]
  });
  return res.rows as unknown as Exercicio[];
}

export async function getExercicio(id: number) {
  const res = await client.execute({
    sql: 'SELECT * FROM exercicios WHERE id = ?',
    args: [id]
  });
  return res.rows[0] as unknown as Exercicio;
}

export async function updateExercicioDetails(id: number, peso: number, reps: number) {
  await client.execute({
    sql: 'UPDATE exercicios SET peso = ?, repeticoes_alvo = ? WHERE id = ?',
    args: [peso, reps, id]
  });
  revalidatePath(`/treino`);
}

export async function logSet(fichaId: number, nome: string, peso: number, reps: number) {
  const treinoRes = await client.execute({
    sql: "SELECT id FROM historico_treinos WHERE ficha_id = ? AND date(data, 'localtime') = date('now', 'localtime')",
    args: [fichaId]
  });

  let treinoId: number;
  if (treinoRes.rows.length === 0) {
    const newTreino = await client.execute({
      sql: 'INSERT INTO historico_treinos (ficha_id) VALUES (?)',
      args: [fichaId]
    });
    treinoId = Number(newTreino.lastInsertRowid);
  } else {
    treinoId = Number(treinoRes.rows[0].id);
  }

  await client.execute({
    sql: `INSERT INTO historico_exercicios (treino_id, nome, reps, peso)
          VALUES (?, ?, ?, ?)`,
    args: [treinoId, nome, reps, peso]
  });
  
  revalidatePath('/metricas');
}

export async function finishWorkout(fichaId: number) {
  // Find or create the session
  const treinoRes = await client.execute({
    sql: "SELECT id FROM historico_treinos WHERE ficha_id = ? AND date(data, 'localtime') = date('now', 'localtime')",
    args: [fichaId]
  });

  let treinoId: number;
  if (treinoRes.rows.length === 0) {
    const newTreino = await client.execute({
      sql: 'INSERT INTO historico_treinos (ficha_id) VALUES (?)',
      args: [fichaId]
    });
    treinoId = Number(newTreino.lastInsertRowid);
  } else {
    treinoId = Number(treinoRes.rows[0].id);
  }

  // Get all exercises for this plan to "fill the gaps" if requested
  const exsRes = await client.execute({
    sql: 'SELECT nome, peso, repeticoes_alvo FROM exercicios WHERE ficha_id = ?',
    args: [fichaId]
  });

  // For each exercise, if it wasn't logged today, we can log it with 0 reps or its target
  // But the user said "salvar os exercicios feitos e nao feitos". 
  // We'll log a summary or just ensure they are there.
  // To avoid duplicates if they were already logged, we check:
  const loggedRes = await client.execute({
    sql: 'SELECT nome FROM historico_exercicios WHERE treino_id = ?',
    args: [treinoId]
  });
  const loggedNames = new Set(loggedRes.rows.map(r => r.nome as string));

  for (const ex of exsRes.rows) {
    if (!loggedNames.has(ex.nome as string)) {
      await client.execute({
        sql: `INSERT INTO historico_exercicios (treino_id, nome, reps, peso)
              VALUES (?, ?, ?, ?)`,
        args: [treinoId, ex.nome, 0, ex.peso] // 0 reps for "not done"
      });
    }
  }

  // Mark as finished
  await client.execute({
    sql: 'UPDATE historico_treinos SET finalizado = 1 WHERE id = ?',
    args: [treinoId]
  });

  revalidatePath('/');
  revalidatePath('/metricas');
}

export async function getHistoricoSemanal() {
  const res = await client.execute(`
    SELECT date(data) as dia, count(*) as total 
    FROM historico_treinos 
    WHERE data >= date('now', '-7 days')
    GROUP BY dia
  `);
  return res.rows as unknown as { dia: string; total: number }[];
}

export async function getLoggedSetsCount(fichaId: number, exerciseName: string) {
  const res = await client.execute({
    sql: `
      SELECT COUNT(*) as count 
      FROM historico_exercicios he
      JOIN historico_treinos ht ON he.treino_id = ht.id
      WHERE ht.ficha_id = ? 
      AND he.nome = ?
      AND date(ht.data, 'localtime') = date('now', 'localtime')
      AND ht.finalizado = 0
    `,
    args: [fichaId, exerciseName]
  });
  return Number(res.rows[0].count);
}
