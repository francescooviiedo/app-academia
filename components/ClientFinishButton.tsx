'use client';

import * as React from 'react';
import { Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { finishWorkout } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export default function ClientFinishButton({ fichaId }: { fichaId: number }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleFinish = async () => {
    setLoading(true);
    try {
      await finishWorkout(fichaId);
      router.push('/metricas');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      fullWidth
      variant="contained"
      color="primary"
      size="large"
      onClick={handleFinish}
      disabled={loading}
      startIcon={<CheckCircleIcon />}
      sx={{ height: 60, borderRadius: 30, fontWeight: 'bold', fontSize: '1.1rem' }}
    >
      {loading ? 'Encerrando...' : 'Encerrar Treino'}
    </Button>
  );
}
