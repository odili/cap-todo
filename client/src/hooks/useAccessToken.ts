import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { authConfig } from '../config';
const { audience, scope } = authConfig;

export const useAcessToken = () => {
  const { getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();
  const [accessToken, setaccessToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently({ audience, scope });
        setaccessToken(token);
      } catch (e) {
        console.log((e as Error).message);
        const tk = await getAccessTokenWithPopup({ audience, scope });
        setaccessToken(tk);
      }
    })();
  }, [getAccessTokenSilently, getAccessTokenWithPopup]);

  return accessToken;
};
