'use client';

import * as React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper, Box } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from '@/app/auth/actions';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = React.useState(pathname === '/metricas' ? 1 : (pathname === '/' ? 0 : -1));

  return (
    <Box sx={{ 
      position: 'fixed', 
      bottom: 20, 
      left: '2%', 
      right: '2%', 
      zIndex: 1000 
    }}>
      <Paper 
        sx={{ 
          borderRadius: '40px', 
          overflow: 'hidden',
          bgcolor: 'primary.main', // Mint green
          boxShadow: '0 8px 32px rgba(178, 255, 214, 0.3)',
          mx: 'auto',
          maxWidth: 400
        }} 
        elevation={0}
      >
        <BottomNavigation
          showLabels={false}
          value={value}
          onChange={(event, newValue) => {
            if (newValue === 2) {
              signOut();
              return;
            }
            setValue(newValue);
            if (newValue === 0) router.push('/');
            else if (newValue === 1) router.push('/metricas');
          }}
          sx={{ 
            bgcolor: 'transparent',
            height: 64,
            '& .MuiBottomNavigationAction-root': {
              color: 'rgba(0, 0, 0, 0.4)',
              minWidth: 0,
              '&.Mui-selected': {
                color: '#000000',
              },
            },
          }}
        >
          <BottomNavigationAction icon={<FitnessCenterIcon />} />
          <BottomNavigationAction icon={<BarChartIcon />} />
          <BottomNavigationAction icon={<LogoutIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
