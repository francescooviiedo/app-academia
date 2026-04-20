'use client';

import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useRouter, usePathname } from 'next/navigation';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = React.useState(pathname === '/metricas' ? 1 : 0);

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          if (newValue === 0) router.push('/');
          else router.push('/metricas');
        }}
      >
        <BottomNavigationAction label="Treinos" icon={<FitnessCenterIcon />} />
        <BottomNavigationAction label="Métricas" icon={<BarChartIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
