import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { IconButton, Container } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import AccountMenu from './component/AccountMenu';
import LoginIcon from './component/LoginIcon';

function App() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  return (
    <>
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          my: { xs: '1.5rem', md: '4rem' },
          border: (t) => `1px solid ${t.palette.primary.main}`,
          borderRadius: '8px',
          height: { xs: '3rem', md: '5rem' }
        }}
      >
        <IconButton size="large" color="primary" onClick={() => navigate('/')}>
          <HomeIcon />
        </IconButton>
        {isAuthenticated ? <AccountMenu /> : <LoginIcon />}
      </Container>

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
