import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { authConfig } from '../config';
const { audience, scope } = authConfig;

export const useApi = (url: string) => {
  const { getAccessTokenSilently } = useAuth0();
  const [state, setState] = useState<{
    error: Error | null;
    loading: boolean;
    data: any;
  }>({
    error: null,
    loading: true,
    data: null,
  });
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const accessToken = await getAccessTokenSilently({ audience, scope });
        const res = await fetch(url, {
          headers: {
            // Add the Authorization header
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setState({
          ...state,
          data: await res.json(),
          error: null,
          loading: false,
        });
      } catch (error) {
        setState({
          ...state,
          error: error as Error,
          loading: false,
        });
      }
    })();
  }, [refreshIndex]);

  return {
    ...state,
    refresh: () => setRefreshIndex(refreshIndex + 1),
  };
};
