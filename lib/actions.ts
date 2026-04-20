'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export interface Ficha {
  id: number;
  nome: string;
  ja_realizado?: boolean;
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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  const { data: ficha, error: fichaError } = await supabase
    .from('fichas')
    .insert([{ nome, user_id: user.id }])
    .select()
    .single();

  if (fichaError) throw fichaError;
  
  const fichaId = ficha.id;

  const exerciciosData = exercicios.map(ex => ({
    user_id: user.id,
    ficha_id: fichaId,
    nome: ex.nome,
    repeticoes_alvo: ex.reps,
    peso: ex.peso,
    timer_segundos: ex.timer
  }));

  const { error: exError } = await supabase
    .from('exercicios')
    .insert(exerciciosData);

  if (exError) throw exError;

  revalidatePath('/');
}

export async function getFichas() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const today = new Date().toLocaleDateString('en-CA');

  const { data: fichas, error } = await supabase
    .from('fichas')
    .select('*')
    .eq('user_id', user.id);
  
  if (error) throw error;

  const { data: recentTreinos } = await supabase
    .from('historico_treinos')
    .select('ficha_id')
    .eq('user_id', user.id)
    .eq('finalizado', true)
    .gte('data', `${today}T00:00:00`)
    .lte('data', `${today}T23:59:59`);

  const realizedIds = new Set(recentTreinos?.map(t => t.ficha_id));

  return fichas.map(f => ({
    ...f,
    ja_realizado: realizedIds.has(f.id)
  })) as Ficha[];
}

export async function getExercicios(fichaId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('exercicios')
    .select('*')
    .eq('user_id', user.id)
    .eq('ficha_id', fichaId);
  
  if (error) throw error;
  return data as Exercicio[];
}

export async function getExercicio(id: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('exercicios')
    .select('*')
    .eq('user_id', user.id)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Exercicio;
}

export async function updateExercicioDetails(id: number, peso: number, reps: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('exercicios')
    .update({ peso, repeticoes_alvo: reps })
    .eq('user_id', user.id)
    .eq('id', id);
  
  if (error) throw error;
  revalidatePath(`/treino`);
}

export async function logSet(fichaId: number, nome: string, peso: number, reps: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const today = new Date().toLocaleDateString('en-CA');

  // Find session for today
  let { data: treinos, error: treinoError } = await supabase
    .from('historico_treinos')
    .select('id')
    .eq('user_id', user.id)
    .eq('ficha_id', fichaId)
    .gte('data', `${today}T00:00:00`)
    .lte('data', `${today}T23:59:59`)
    .limit(1);

  if (treinoError) throw treinoError;

  let treinoId: number;
  if (!treinos || treinos.length === 0) {
    const { data: newTreino, error: createError } = await supabase
      .from('historico_treinos')
      .insert([{ ficha_id: fichaId, user_id: user.id }])
      .select()
      .single();
    if (createError) throw createError;
    treinoId = newTreino.id;
  } else {
    treinoId = treinos[0].id;
  }

  const { error: logError } = await supabase
    .from('historico_exercicios')
    .insert([{ treino_id: treinoId, nome, reps, peso, user_id: user.id }]);

  if (logError) throw logError;
  
  revalidatePath('/metricas');
}

export async function finishWorkout(fichaId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const today = new Date().toLocaleDateString('en-CA');

  // 1. Find or create session
  let { data: treinos } = await supabase
    .from('historico_treinos')
    .select('id')
    .eq('user_id', user.id)
    .eq('ficha_id', fichaId)
    .gte('data', `${today}T00:00:00`)
    .lte('data', `${today}T23:59:59`)
    .limit(1);

  let treinoId: number;
  if (!treinos || treinos.length === 0) {
    const { data: newTreino } = await supabase
      .from('historico_treinos')
      .insert([{ ficha_id: fichaId, user_id: user.id }])
      .select()
      .single();
    treinoId = newTreino.id;
  } else {
    treinoId = treinos[0].id;
  }

  // 2. Fill gaps for exercises not logged today
  const { data: exs } = await supabase
    .from('exercicios')
    .select('nome, peso')
    .eq('user_id', user.id)
    .eq('ficha_id', fichaId);

  const { data: logged } = await supabase
    .from('historico_exercicios')
    .select('nome')
    .eq('treino_id', treinoId);

  const loggedNames = new Set(logged?.map(l => l.nome));

  const missingExs = exs?.filter(ex => !loggedNames.has(ex.nome)).map(ex => ({
    treino_id: treinoId,
    nome: ex.nome,
    reps: 0,
    peso: ex.peso,
    user_id: user.id
  })) || [];

  if (missingExs.length > 0) {
    await supabase.from('historico_exercicios').insert(missingExs);
  }

  // 3. Mark as finished
  await supabase
    .from('historico_treinos')
    .update({ finalizado: true })
    .eq('user_id', user.id)
    .eq('id', treinoId);

  revalidatePath('/');
  revalidatePath('/metricas');
}

export async function getHistoricoSemanal() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  const { data, error } = await supabase
    .from('historico_treinos')
    .select('data')
    .eq('user_id', user.id)
    .gte('data', lastWeek.toISOString());

  if (error) throw error;

  const groups: Record<string, number> = {};
  data.forEach(t => {
    const d = new Date(t.data).toISOString().split('T')[0];
    groups[d] = (groups[d] || 0) + 1;
  });

  return Object.entries(groups).map(([dia, total]) => ({ dia, total }));
}

export async function getLoggedSetsCount(fichaId: number, exerciseName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const today = new Date().toLocaleDateString('en-CA');

  const { data, error } = await supabase
    .from('historico_exercicios')
    .select(`
      id,
      historico_treinos!inner(ficha_id, data, finalizado, user_id)
    `)
    .eq('nome', exerciseName)
    .eq('historico_treinos.ficha_id', fichaId)
    .eq('historico_treinos.user_id', user.id)
    .eq('historico_treinos.finalizado', false)
    .gte('historico_treinos.data', `${today}T00:00:00`)
    .lte('historico_treinos.data', `${today}T23:59:59`);

  if (error) throw error;
  return data?.length || 0;
}
