import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import { getFichas } from '@/lib/actions';

import Header from '@/components/Header';

export default async function Home() {
  const fichas = await getFichas();

  return (
    <Container sx={{ py: 4 }}>
      <Header title="Suas Fichas" />
      
      {fichas.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Você ainda não tem fichas de treino. Clique no + para criar uma.
        </Typography>
      ) : (
        <List>
          {fichas.map((ficha) => (
            <ListItem key={ficha.id} disablePadding sx={{ mb: 1 }}>
              <Link 
                href={ficha.ja_realizado ? '#' : `/treino/${ficha.id}`} 
                style={{ 
                  textDecoration: 'none', 
                  width: '100%',
                  pointerEvents: ficha.ja_realizado ? 'none' : 'auto'
                }}
              >
                <ListItemButton 
                  disabled={Boolean(ficha.ja_realizado)}
                  sx={{ 
                    bgcolor: 'background.paper', 
                    borderRadius: 2, 
                    boxShadow: 1,
                    height: 72,
                    color: 'text.primary',
                    '&.Mui-disabled': {
                      bgcolor: 'action.disabledBackground',
                      opacity: 0.7
                    }
                  }}
                >
                  <ListItemText 
                    primary={
                      <Typography 
                        variant="h6" 
                        sx={{ color: ficha.ja_realizado ? 'text.disabled' : 'text.primary' }}
                      >
                        {ficha.nome}
                      </Typography>
                    }
                    secondary={ficha.ja_realizado ? "Já realizado hoje" : null}
                  />
                  {ficha.ja_realizado && (
                    <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                      CONCLUÍDO
                    </Typography>
                  )}
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      )}

      <Link href="/treino/novo">
        <Fab 
          color="primary" 
          aria-label="add" 
          sx={{ position: 'fixed', bottom: 80, right: 16 }}
        >
          <AddIcon />
        </Fab>
      </Link>
    </Container>
  );
}
