import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@mui/material';

export default function LoginButton() {
  const { loginWithRedirect } = useAuth0();
  return (
    <Button
      size="large"
      variant="contained"
      onClick={() => loginWithRedirect()}
    >
      Log in
    </Button>
  );
}
