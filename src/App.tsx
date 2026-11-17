/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AdminApp } from './components/AdminApp';
import { AuthenticatedSession, LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { CertificationRegulatorApp } from './components/CertificationRegulatorApp';
import { DistributorApp } from './components/DistributorApp';
import { FarmerApp } from './components/FarmerApp';
import { ProducerApp } from './components/ProducerApp';
import { PortalMode } from './types/certificationAuthority';

const SESSION_STORAGE_KEY = 'benihnusa_auth_session_v1';

export default function App() {
  const [authSession, setAuthSession] = useState<AuthenticatedSession | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!saved) return null;
      return JSON.parse(saved) as AuthenticatedSession;
    } catch {
      return null;
    }
  });
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const [prefillLoginEmail, setPrefillLoginEmail] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    try {
      if (authSession && authSession.rememberMe) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(authSession));
      } else if (!authSession) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      // Ignore storage quota issues
    }
  }, [authSession]);

  const handleLoginSuccess = (session: AuthenticatedSession) => {
    setAuthSession(session);
    if (!session.rememberMe) {
      try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {
        // Ignore storage error
      }
    }
  };

  const handleSwitchPortal = (portal: PortalMode) => {
    setAuthSession((prev) =>
      prev
        ? { ...prev, portal }
        : {
            portal,
            email: 'demo@benihnusa.id',
            fullName: 'Pengguna Demo',
            rememberMe: false,
          }
    );
  };

  const handleLogout = () => {
    setAuthSession(null);
    setPrefillLoginEmail(undefined);
    setAuthScreen('login');
  };

  if (!authSession) {
    if (authScreen === 'register') {
      return (
        <RegisterPage
          onNavigateLogin={(prefillEmail) => {
            setPrefillLoginEmail(prefillEmail);
            setAuthScreen('login');
          }}
        />
      );
    }

    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateRegister={() => {
          setPrefillLoginEmail(undefined);
          setAuthScreen('register');
        }}
        initialEmail={prefillLoginEmail}
      />
    );
  }

  if (authSession.portal === 'farmer') {
    return (
      <FarmerApp
        onSwitchPortal={handleSwitchPortal}
        onLogout={handleLogout}
      />
    );
  }

  if (authSession.portal === 'producer') {
    return (
      <ProducerApp
        onSwitchPortal={handleSwitchPortal}
        onLogout={handleLogout}
      />
    );
  }

  if (authSession.portal === 'distributor') {
    return (
      <DistributorApp
        onSwitchPortal={handleSwitchPortal}
        onLogout={handleLogout}
      />
    );
  }

  if (authSession.portal === 'admin') {
    return (
      <AdminApp
        onSwitchPortal={handleSwitchPortal}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <CertificationRegulatorApp
      onSwitchPortal={handleSwitchPortal}
      onLogout={handleLogout}
    />
  );
}
