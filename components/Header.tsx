'use client';

import * as React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

export default function Header({ 
  rightAction 
}: { 
  rightAction?: React.ReactNode 
}) {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 3,
      width: '100%'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'black',
            fontWeight: 'bold',
            width: 48,
            height: 48
          }}
        >
          JD
        </Avatar>
        <Box>
          <Typography variant="body2" color="text.secondary">Welcome back!</Typography>
          <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>Athlete</Typography>
        </Box>
      </Box>
      
      {rightAction ? rightAction : (
        <Box sx={{ width: 48 }} /> // Spacer if no action
      )}
    </Box>
  );
}
