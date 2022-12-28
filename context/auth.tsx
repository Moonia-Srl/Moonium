import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

import { login, logout, refresh } from '../api/auth';
import useTranslation from '../hooks/useTranslation';
import { Admin, Login } from '../schema/interfaces';

type AuthContext = {
  admin: Admin | null;
  loading: boolean;
  error: string;

  signOut: () => void;
  signIn: (data: Login) => void;
};

const AuthCtx = createContext<AuthContext | null>(null);

/**
 * Custom hook to retrieve and interact with the Auth Context
 * @returns {AuthContext}
 */
export const useAuth = () => {
  // Retrieves the data for the Web3 context in the hierarchy
  const value = useContext(AuthCtx);
  // If the context hasn't been initialized returns an error
  if (value == null) throw new Error('useAuth must be used inside an AuthProvider');
  return value; // Else the context value
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Get a reference to the i18n translate function
  const { t } = useTranslation();

  // Hook internal state, the value are exported to the consumer
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [admin, setAdmin] = useState<Admin | null>(null);

  console.log('BP__ useAuth', admin, loading, error);

  // Callback to execute on API call success
  const onSuccess = useCallback((admin: Admin) => {
    setAdmin(admin), setLoading(false);
  }, []);

  // Callback to execute on API call error
  const onError = useCallback(
    (err: unknown) => {
      // Determines the translation key for the error
      const message = t(typeof err === 'string' ? err : 'errors.api_call_failed');
      setError(message), setLoading(false);
    },
    [t]
  );

  // Authenticates a new user provided username and passwords
  const signIn = useCallback(
    (data: Login) => {
      // Changes the loading state to true and resets the error state
      setLoading(true), setError('');
      // Fetches the project by the project slug and sets the internal state
      login(data).then(onSuccess).catch(onError);
    },
    [onError, onSuccess]
  );

  // Logouts the current authenticated admin
  const signOut = useCallback(() => {
    // Resets the internal states as well
    logout(), setAdmin(null), setError('');
  }, []);

  /**
   * onMount tries to automatically login the admin based on the previous
   * session (the RefreshToken in localStorage)
   * @function
   */
  useEffect(() => {
    // Changes the loading state to true and resets the error state
    setLoading(true), setError('');
    // Fetches the project by the project slug and sets the internal state
    refresh().then(onSuccess).catch(onError);
  }, [onError, onSuccess]);

  return (
    <AuthCtx.Provider value={{ admin, signIn, signOut, loading, error }}>
      {children}
    </AuthCtx.Provider>
  );
};
