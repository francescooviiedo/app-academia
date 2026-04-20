import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import { getHistoricoSemanal } from '@/lib/actions';

export default async function Metricas() {
  const historico = await getHistoricoSemanal();

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Suas Métricas
      </Typography>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Atividade Semanal
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Card sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {historico.length}
            </Typography>
            <Typography variant="body1">Treinos / 7 dias</Typography>
          </CardContent>
        </Card>
      </Box>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Log de Treinos
      </Typography>
      
      {historico.length === 0 ? (
        <Typography color="text.secondary">Nenhum treino registrado.</Typography>
      ) : (
        historico.map((item, index) => (
          <Card key={index} sx={{ mb: 2, borderRadius: 3 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">{new Date(item.dia).toLocaleDateString('pt-BR', { weekday: 'long' })}</Typography>
              <Typography color="primary" sx={{ fontWeight: 'bold' }}>{item.total} sessões</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}
