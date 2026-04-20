import * as React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loading() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        bgcolor: '#000000',
        zIndex: 9999
      }}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
        <CircularProgress 
          size={60} 
          thickness={4}
          sx={{ 
            color: 'primary.main',
            '& .MuiCircularProgress-circle': { strokeLinecap: 'round' }
          }} 
        />
      </Box>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 800, 
          letterSpacing: 1,
          color: 'rgba(255,255,255,0.7)',
          textTransform: 'uppercase'
        }}
      >
        Carregando...
      </Typography>
    </Box>
  );
}
