import { useState } from 'react';
import { LoginPage } from '@/core/auth/LoginPage';
import { SignInPage } from '@/core/auth/SignInPage';

export const AuthPage = () => {
  const [isSignInMode, setIsSignInMode] = useState(false);

  const switchToSignIn = () => setIsSignInMode(true);
  const switchToLogin = () => setIsSignInMode(false);

  return (
    <>
      {isSignInMode ? (
        <SignInPage onSwitchToLogin={switchToLogin} />
      ) : (
        <LoginPage onSwitchToSignIn={switchToSignIn} />
      )}
    </>
  );
};