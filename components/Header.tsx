'use client';

import * as React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut } from '@/app/auth/actions';

import Avatar from '@mui/material/Avatar';

export default function Header({ 
  title, 
  rightAction 
}: { 
  title?: string, 
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
