import { ReactNode } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { authConfig } from '../config';
type Prop = {
  children?: ReactNode;
};

export default function Auth0ProviderWithHistory({ children }: Prop) {
  const navigate = useNavigate();

  const onRedirectCallback = (appState: any) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={authConfig.domain}
      clientId={authConfig.clientId}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      useRefreshTokens={true}
      // scope="read:todos write:todos"
    >
      {children}
    </Auth0Provider>
  );
}
