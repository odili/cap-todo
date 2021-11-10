import { useAuth0 } from '@auth0/auth0-react';
import { IconButton, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Login } from '@mui/icons-material';

export default function LoginIcon() {
  const { loginWithRedirect } = useAuth0();
  return (
    <Tooltip title="Login">
      <IconButton
        size="large"
        color="primary"
        onClick={() => loginWithRedirect()}
        sx={{ bgcolor: (t) => alpha(t.palette.primary.main, 0.15) }}
      >
        <Login />
      </IconButton>
    </Tooltip>
  );
}
