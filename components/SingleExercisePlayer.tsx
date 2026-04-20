'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, Button, Paper, TextField, 
  CircularProgress
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { updateExercicioDetails, logSet } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface Exercicio {
  id: number;
  ficha_id: number;
  nome: string;
  peso: number;
  repeticoes_alvo: number;
  timer_segundos: number;
}

export default function SingleExercisePlayer({ 
  exercicio, 
  initialReps = 0 
}: { 
  exercicio: Exercicio,
  initialReps?: number 
}) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(exercicio.timer_segundos || 60);
  
  const [reps, setReps] = useState(initialReps);
  const [peso, setPeso] = useState(exercicio.peso);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const saveAndLog = useCallback(async () => {
    const nextSet = reps + 1;
    await logSet(exercicio.ficha_id, exercicio.nome, peso, nextSet);
    await updateExercicioDetails(exercicio.id, peso, exercicio.repeticoes_alvo); 
    setReps(nextSet);
  }, [exercicio.ficha_id, exercicio.id, exercicio.nome, exercicio.repeticoes_alvo, peso, reps]);

  const handleTimerEnd = useCallback(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Descanso Finalizado!", {
        body: `Símbora! Próxima série de ${exercicio.nome}`,
        icon: "/icons/icon-192x192.png"
      });
    }
    audioRef.current?.play().catch(() => {});
    saveAndLog();
  }, [exercicio.nome, saveAndLog]);

  const handleUpdateDetails = useCallback(async (newPeso: number, newReps: number) => {
    setPeso(newPeso);
    setReps(newReps);
    await updateExercicioDetails(exercicio.id, newPeso, exercicio.repeticoes_alvo);
  }, [exercicio.id, exercicio.repeticoes_alvo]);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            handleTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, handleTimerEnd]);

  const startTimer = () => {
    setTimeLeft(timerDuration);
    setIsActive(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '80vh', gap: 3 }}>
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
          {exercicio.nome}
        </Typography>
        
        <Box sx={{ mt: 3, mb: 4 }}>
          <TextField
            label="Tempo de Descanso (segundos)"
            type="number"
            value={timerDuration}
            size="small"
            inputMode="numeric"
            onChange={(e) => setTimerDuration(parseInt(e.target.value) || 0)}
            sx={{ maxWidth: 200 }}
          />
        </Box>

        <Box sx={{ position: 'relative', display: 'inline-flex', mb: 4 }}>
          <CircularProgress 
            variant="determinate" 
            value={timeLeft > 0 ? (timeLeft / timerDuration) * 100 : 0} 
            size={220}
            thickness={2}
          />
          <Box sx={{
            top: 0, left: 0, bottom: 0, right: 0,
            position: 'absolute', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography variant="h2" component="div" sx={{ fontWeight: 'light' }}>
              {timeLeft > 0 ? timeLeft : 'Rest'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {!isActive && timeLeft === 0 ? (
            <Button 
              variant="contained" 
              size="large" 
              startIcon={<PlayArrowIcon />}
              onClick={startTimer}
              sx={{ borderRadius: 28, px: 6, py: 1.5 }}
            >
              Iniciar Descanso
            </Button>
          ) : (
            <Button 
              variant="outlined" 
              size="large" 
              onClick={() => setIsActive(!isActive)}
              sx={{ borderRadius: 28, px: 4 }}
            >
              {isActive ? <PauseIcon /> : 'Continuar'}
            </Button>
          )}
        </Box>
      </Paper>

      <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 4, boxShadow: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Peso (kg)"
            type="number"
            value={peso}
            size="small"
            inputMode="numeric"
            onChange={(e) => handleUpdateDetails(parseFloat(e.target.value) || 0, reps)}
            fullWidth
          />
          <TextField
            label="Reps / Séries"
            type="number"
            value={reps}
            size="small"
            inputMode="numeric"
            onChange={(e) => handleUpdateDetails(peso, parseInt(e.target.value) || 0)}
            fullWidth
          />
        </Box>
        
        <Button 
          variant="text" 
          fullWidth
          onClick={() => router.back()}
          sx={{ color: 'text.secondary', fontWeight: 'bold' }}
        >
          VOLTAR PARA A FICHA
        </Button>
      </Box>
    </Box>
  );
}
