import * as React from 'react';
import { Container, Typography, Fab, Box, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import { getFichas } from '@/lib/actions';
import Header from '@/components/Header';

import { IconButton } from '@mui/material';

export default async function Home() {
  const fichas = await getFichas();

  return (
    <Container sx={{ py: 4 }}>
      <Header 
        rightAction={
          <Link href="/treino/novo">
            <IconButton 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.05)', 
                borderRadius: 3, 
                color: 'primary.main' 
              }}
            >
              <AddIcon />
            </IconButton>
          </Link>
        } 
      />
      
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
        Your Training
      </Typography>
      
      {fichas.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No training plans found. Click the + button to start.
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3 }}>
          {fichas.map((ficha) => (
            <Link 
              key={ficha.id}
              href={ficha.ja_realizado ? '#' : `/treino/${ficha.id}`} 
              style={{ 
                textDecoration: 'none', 
                pointerEvents: ficha.ja_realizado ? 'none' : 'auto'
              }}
            >
              <Paper 
                sx={{ 
                  p: 3,
                  borderRadius: 3, 
                  bgcolor: '#1A1A1A',
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {ficha.nome}
                  </Typography>
                  
                  {ficha.ja_realizado ? (
                    <Box sx={{ 
                      px: 2, py: 0.5, 
                      bgcolor: 'primary.main', 
                      borderRadius: 10 
                    }}>
                      <Typography variant="caption" sx={{ color: 'black', fontWeight: 900 }}>
                        CONCLUÍDO
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ 
                      px: 2, py: 0.5, 
                      bgcolor: '#EAB308', // Yellow
                      borderRadius: 10 
                    }}>
                      <Typography variant="caption" sx={{ color: 'black', fontWeight: 900 }}>
                        NÃO INICIADA
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Link>
          ))}
        </Box>
      )}
    </Container>
  );
}
