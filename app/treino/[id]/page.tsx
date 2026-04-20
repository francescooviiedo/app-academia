import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { getExercicios, getFichas } from '@/lib/actions';
import ClientFinishButton from '@/components/ClientFinishButton';
import { redirect } from 'next/navigation';

export default async function DetalhesTreino({ params }: { params: { id: string } }) {
  const { id } = await params;
  const fichaId = parseInt(id);
  const exercicios = await getExercicios(fichaId);
  const fichas = await getFichas();
  const ficha = fichas.find(f => f.id === fichaId);

  if (ficha?.ja_realizado) {
    redirect('/');
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        {ficha?.nome || 'Treino'}
      </Typography>
      
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {exercicios.length} Exercícios
      </Typography>

      <List>
        {exercicios.map((ex) => (
          <Link key={ex.id} href={`/treino/${id}/exercicio/${ex.id}`} style={{ textDecoration: 'none' }}>
            <ListItem sx={{ bgcolor: 'background.paper', mb: 1, borderRadius: 2, boxShadow: 1, cursor: 'pointer' }}>
              <ListItemText 
                primary={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>{ex.nome}</Typography>}
                secondary={`${ex.repeticoes_alvo} reps • ${ex.peso}kg`} 
              />
            </ListItem>
          </Link>
        ))}
      </List>

      <Box sx={{ mt: 4, mb: 2 }}>
        <ClientFinishButton fichaId={fichaId} />
      </Box>
    </Container>
  );
}
