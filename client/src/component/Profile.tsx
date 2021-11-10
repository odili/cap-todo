import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function Profile() {
  const { user, isAuthenticated, isLoading, getAccessTokenWithPopup } =
    useAuth0();
  const [todos, setTodos] = useState(null);

  useEffect(() => {
    (async () => {
      const apiUrl =
        'https://61ma19x8oi.execute-api.us-east-2.amazonaws.com/todos';

      try {
        const accessToken = await getAccessTokenWithPopup({
          audience: 'https://use-our-Todo-App',
          scope: 'read:todos write:todos',
        });
        // console.log(accessToken);
        const res = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { items } = await res.json();

        setTodos(items);
      } catch (e) {
        console.log((e as Error).message);
      }
    })();
  }, [getAccessTokenWithPopup]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      {isAuthenticated && (
        <div>
          <img src={user?.picture} alt={user?.name} />
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
        </div>
      )}
      {todos ? (
        <pre>{JSON.stringify(todos, null, 2)}</pre>
      ) : (
        <p>No todos yet</p>
      )}
    </>
  );
}
