'use client';

import * as React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from '@/app/auth/actions';

export default function Header({ title }: { title: string }) {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 3
    }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      <IconButton 
        onClick={() => signOut()} 
        color="inherit"
        sx={{ opacity: 0.6 }}
      >
        <LogoutIcon />
      </IconButton>
    </Box>
  );
}
