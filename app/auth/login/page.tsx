import * as React from 'react';
import { 
  Container, Typography, Box, TextField, Button, Paper, 
  Link as MuiLink, Alert 
} from '@mui/material';
import Link from 'next/link';
import { login } from '../actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const { message } = await searchParams;

  return (
    <Container maxWidth="xs" sx={{ mt: 15 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: 'transparent' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
          Gym Tracker
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
          Bem vindo de volta!
        </Typography>

        {message && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        <Box component="form" action={login}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            required
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            required
            sx={{ mb: 3 }}
            variant="outlined"
          />
          <Button 
            fullWidth 
            variant="contained" 
            type="submit" 
            size="large"
            sx={{ 
              height: 56, 
              borderRadius: 28, 
              fontWeight: 'bold', 
              fontSize: '1.1rem',
              mb: 3
            }}
          >
            ENTRAR
          </Button>

          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Não tem uma conta?{' '}
            <Link href="/auth/register" passHref style={{ textDecoration: 'none' }}>
              <MuiLink component="span" sx={{ fontWeight: 'bold' }}>
                Cadastre-se
              </MuiLink>
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
