// import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, Paper } from '@mui/material';
// import { Todo } from 'types';
import { useApi } from 'hooks/useApi';
import { apiEndpoint, authConfig } from '../config';
export default function ListTodos() {
  // const [todos, setTodos] = useState<Todo[]>([]);

  const opts = {
    audience: authConfig.audience,
    scope: authConfig.scope,
  };
  const { loginWithRedirect, getAccessTokenWithPopup } = useAuth0();
  const {
    loading,
    error,
    refresh,
    data: todos,
  } = useApi(`${apiEndpoint}/todos`,);
  const getTokenAndTryAgain = async () => {
    await getAccessTokenWithPopup(opts);
    refresh();
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    if ((error as Error).message === 'login_required') {
      return <Button onClick={() => loginWithRedirect(opts)}>Login</Button>;
    }
    if ((error as Error).message === 'consent_required') {
      return (
        <Button onClick={getTokenAndTryAgain}>Consent to reading users</Button>
      );
    }
    return <div>Oops {(error as Error).message}</div>;
  }
  return <Paper>{JSON.stringify(todos, null, 2)}</Paper>;
}
