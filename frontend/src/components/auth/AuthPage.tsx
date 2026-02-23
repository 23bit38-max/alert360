import { useState } from 'react';
import { LoginPage } from './LoginPage';
import { SignInPage } from './SignInPage';

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