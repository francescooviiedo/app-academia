import * as React from 'react';
import { 
  Container, Typography, Box, TextField, Button, Paper, 
  Link as MuiLink, Alert 
} from '@mui/material';
import Link from 'next/link';
import { signup } from '../actions';

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const { message } = await searchParams;

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -1 }}>
          JOIN <span style={{ color: '#B2FFD6' }}>US</span>
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Start your transformation.
        </Typography>
      </Box>

      {message && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 4 }}>
          {message}
        </Alert>
      )}

      <Box component="form" action={signup}>
        <TextField
          fullWidth
          placeholder="Email"
          name="email"
          type="email"
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          placeholder="Password"
          name="password"
          type="password"
          required
          sx={{ mb: 4 }}
        />
        <Button 
          fullWidth 
          variant="contained" 
          type="submit" 
          size="large"
          sx={{ 
            height: 64, 
            borderRadius: 32, 
            fontWeight: 800, 
            fontSize: '1.2rem',
            boxShadow: '0 10px 30px rgba(178, 255, 214, 0.3)',
            mb: 4
          }}
        >
          SIGN UP
        </Button>

        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          By clicking sign up, you agree to our terms.
        </Typography>
      </Box>
    </Container>
  );
}
