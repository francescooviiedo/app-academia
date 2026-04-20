import * as React from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function Loading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
      <CircularProgress sx={{ color: 'primary.main' }} />
    </Box>
  );
}
