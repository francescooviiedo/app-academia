'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { 
  Box, Typography, Button, Paper, TextField, 
  CircularProgress
} from '@mui/material';
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
    const title = "Descanso Finalizado!";
    const options = {
      body: `Símbora! Próxima série de ${exercicio.nome}`,
      icon: "/icons/icon-192x192.png",
      vibrate: [200, 100, 200],
      badge: "/icons/icon-192x192.png",
    };

    console.log("Notification status:", "Notification" in window ? Notification.permission : "Not supported");
    
    if ("Notification" in window && Notification.permission === "granted") {
      console.log("Attempting to show notification...");
      // Prefer service worker notification for better background support
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          console.log("Using Service Worker notification");
          registration.showNotification(title, options).catch(err => console.error("SW Notification Error:", err));
        }).catch(() => {
          console.log("SW not ready, falling back to basic notification");
          new Notification(title, options);
        });
      } else {
        console.log("No Service Worker support, using basic notification");
        new Notification(title, options);
      }
    } else {
      console.warn("Notifications are not granted or supported.");
    }

    if (audioRef.current) {
      console.log("Playing audio...");
      audioRef.current.play().catch(err => console.error("Audio Play Error:", err));
    }
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
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      const timerEnd = () => {
        setIsActive(false);
        handleTimerEnd();
      };
      timerEnd();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, handleTimerEnd]);

  const startTimer = () => {
    setTimeLeft(timerDuration);
    setIsActive(true);
  };

  const handleUpdateDuration = (val: number) => {
    setTimerDuration(val);
    if (!isActive) {
      setTimeLeft(0); // Keeping it at 0 or setting to val? Usually 0 is fine if not running
    }
  };

  return (
    <Box sx={{ pb: 12 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          textAlign: 'center', 
          bgcolor: '#1A1A1A', 
          borderRadius: 8,
          border: '1px solid rgba(178, 255, 214, 0.1)',
          mb: 3
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
          {exercicio.nome}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {reps} reps • {peso}kg
        </Typography>

        <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
          <CircularProgress 
            variant="determinate" 
            value={timeLeft > 0 ? (timeLeft / timerDuration) * 100 : 0} 
            size={160}
            thickness={4}
            sx={{ 
              color: 'primary.main',
              '& .MuiCircularProgress-circle': { strokeLinecap: 'round' }
            }}
          />
          <Box sx={{
            top: 0, left: 0, bottom: 0, right: 0,
            position: 'absolute', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              {timeLeft > 0 ? timeLeft : timerDuration}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {!isActive && timeLeft === 0 ? (
            <Button 
              variant="contained" 
              size="large" 
              onClick={startTimer}
              sx={{ borderRadius: 32, px: 4, py: 1.5, fontWeight: 800, minWidth: 160 }}
            >
              START REST
            </Button>
          ) : (
            <Button 
              variant="outlined" 
              size="large" 
              onClick={() => setIsActive(!isActive)}
              sx={{ borderRadius: 32, px: 4, py: 1.5, fontWeight: 800 }}
            >
              {isActive ? 'PAUSE' : 'RESUME'}
            </Button>
          )}
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, bgcolor: '#1A1A1A', borderRadius: 6 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>Settings</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Weight (kg)"
            type="number"
            value={peso}
            onChange={(e) => handleUpdateDetails(parseFloat(e.target.value) || 0, reps)}
            fullWidth
            size="small"
          />
          <TextField
            label="Reps"
            type="number"
            value={reps}
            onChange={(e) => handleUpdateDetails(peso, parseInt(e.target.value) || 0)}
            fullWidth
            size="small"
          />
        </Box>
        
        <TextField
          label="Rest Time (s)"
          type="number"
          value={timerDuration}
          onChange={(e) => handleUpdateDuration(parseInt(e.target.value) || 0)}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />

        <Button 
          variant="text" 
          fullWidth
          onClick={() => router.back()}
          sx={{ color: 'primary.main', fontWeight: 800 }}
        >
          FINISH EXERCISE
        </Button>
      </Paper>
    </Box>
  );
}
