import { Container, Typography, Box, Paper } from '@mui/material';
import { getHistoricoSemanal } from '@/lib/actions';
import Header from '@/components/Header';

export default async function Metricas() {
  const historico = await getHistoricoSemanal();

  return (
    <Container sx={{ py: 4 }}>
      <Header title="Your Progress" />

      <Typography variant="h6" sx={{ mt: 2, mb: 3, fontWeight: 'bold' }}>
        Weekly Activity
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 3 }}>
        <Paper sx={{ 
          p: 4, 
          borderRadius: 4, // Less rounded (was 8)
          bgcolor: 'primary.main', 
          color: 'black',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(178, 255, 214, 0.2)'
        }}>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 1 }}>
            {historico.length}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8 }}>Sessions / Week</Typography>
        </Paper>
      </Box>

      <Typography variant="h6" sx={{ mt: 5, mb: 3, fontWeight: 'bold' }}>
        Training Log
      </Typography>
      
      {historico.length === 0 ? (
        <Typography color="text.secondary">No workouts registered yet.</Typography>
      ) : (
        historico.map((item, index) => (
          <Paper key={index} sx={{ mb: 2, p: 3, borderRadius: 3, bgcolor: '#1A1A1A' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                {new Date(item.dia).toLocaleDateString('en-US', { weekday: 'long' })}
              </Typography>
              <Typography color="primary" sx={{ fontWeight: 800 }}>
                {item.total} SESSIONS
              </Typography>
            </Box>
          </Paper>
        ))
      )}
    </Container>
  );
}
