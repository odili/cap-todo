import { Container, Box, Typography } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import Todos from 'component/Todos';
import LoginButton from 'component/LoginButton';
export default function Home() {
  const { isAuthenticated } = useAuth0();
  return (
    <Container>
      {isAuthenticated ? (
        <Todos />
      ) : (
        <Box sx={{ display: 'grid', placeItems: 'center' }}>
          <Typography sx={{ mb: '2rem' }}>
            Login to Create and access you schedule
          </Typography>
          <LoginButton />
        </Box>
      )}
    </Container>
  );
}
