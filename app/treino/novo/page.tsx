'use client';

import * as React from 'react';
import { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { createFicha } from '@/lib/actions';
import { useRouter } from 'next/navigation';

interface ExercicioInput {
  nome: string;
  reps: number;
  peso: number;
  timer: number;
}

export default function NovaFicha() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [exercicios, setExercicios] = useState<ExercicioInput[]>([{ nome: '', reps: 10, peso: 0, timer: 60 }]);

  const addExercicio = () => {
    setExercicios([...exercicios, { nome: '', reps: 10, peso: 0, timer: 60 }]);
  };

  const removeExercicio = (index: number) => {
    setExercicios(exercicios.filter((_, i) => i !== index));
  };

  const updateExercicio = (index: number, field: keyof ExercicioInput, value: string | number) => {
    const newExs = [...exercicios];
    newExs[index] = { ...newExs[index], [field]: value } as ExercicioInput;
    setExercicios(newExs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createFicha(nome, exercicios);
    router.push('/');
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Nova Ficha de Treino
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Nome da Ficha"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          sx={{ mb: 4 }}
        />

        <Typography variant="h6" gutterBottom>
          Exercícios
        </Typography>

        {exercicios.map((ex, index) => (
          <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Nome"
                value={ex.nome}
                onChange={(e) => updateExercicio(index, 'nome', e.target.value)}
                required
              />
              <IconButton onClick={() => removeExercicio(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                type="number"
                label="Reps"
                value={ex.reps}
                inputMode="numeric"
                onChange={(e) => updateExercicio(index, 'reps', parseInt(e.target.value))}
                sx={{ flex: 1 }}
              />
              <TextField
                type="number"
                label="Peso"
                value={ex.peso}
                inputMode="decimal"
                onChange={(e) => updateExercicio(index, 'peso', parseFloat(e.target.value))}
                sx={{ flex: 1 }}
              />
              <TextField
                type="number"
                label="Desc."
                value={ex.timer}
                inputMode="numeric"
                onChange={(e) => updateExercicio(index, 'timer', parseInt(e.target.value))}
                sx={{ flex: 1 }}
              />
            </Box>
          </Box>
        ))}

        <Button startIcon={<AddIcon />} onClick={addExercicio} sx={{ mb: 4 }}>
          Adicionar
        </Button>

        <Button type="submit" variant="contained" fullWidth size="large" sx={{ height: 56, borderRadius: 28 }}>
          Salvar
        </Button>
      </Box>
    </Container>
  );
}
