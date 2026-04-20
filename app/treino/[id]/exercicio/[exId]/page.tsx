import * as React from 'react';
import Container from '@mui/material/Container';
import { getExercicio, getFichas, getLoggedSetsCount } from '@/lib/actions';
import SingleExercisePlayer from '@/components/SingleExercisePlayer';
import { redirect } from 'next/navigation';

export default async function PaginaExercicio({ params }: { params: Promise<{ id: string, exId: string }> }) {
  const { id, exId } = await params;
  const fichaId = parseInt(id);
  
  const fichas = await getFichas();
  const ficha = fichas.find(f => f.id === fichaId);

  if (ficha?.ja_realizado) {
    redirect('/');
  }

  const exercicio = await getExercicio(parseInt(exId));

  if (!exercicio) {
    return <div>Exercício não encontrado</div>;
  }

  // Get current session progress
  const initialReps = await getLoggedSetsCount(fichaId, exercicio.nome);

  // Ensure it's a plain object to avoid Next.js serialization errors
  const plainExercicio = { ...exercicio };

  return (
    <Container sx={{ py: 2, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SingleExercisePlayer exercicio={plainExercicio} initialReps={initialReps} />
    </Container>
  );
}
