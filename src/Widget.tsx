import { useState, useEffect } from 'react';

import KYC_SDK from './index';
import { Button, TextInput } from './components/ui';
import { useSDKConfig, useTranslation } from './hooks';

function Widget() {
  const { setTheme } = useSDKConfig();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const { theme } = (event as CustomEvent).detail;
      setTheme(theme);
    };

    const handleDebugChange = (event: Event) => {
      const { debug } = (event as CustomEvent).detail;
      console.log('Debug mode:', debug);
    };

    const handleUserData = (event: Event) => {
      const { userData } = (event as CustomEvent).detail;
      console.log('User data received:', userData);

      if (userData.firstName) setFirstName(userData.firstName);
      if (userData.lastName) setLastName(userData.lastName);
      if (userData.email) setEmail(userData.email);
    };

    window.addEventListener('widget-theme-change', handleThemeChange);
    window.addEventListener('widget-debug-change', handleDebugChange);
    window.addEventListener('widget-user-data', handleUserData);

    return () => {
      window.removeEventListener('widget-theme-change', handleThemeChange);
      window.removeEventListener('widget-debug-change', handleDebugChange);
      window.removeEventListener('widget-user-data', handleUserData);
    };
  }, [setTheme]);

  const handleSubmit = () => {
    alert(t('alerts.formSubmitted', { firstName, lastName, email }));
  };

  const handleReset = () => {
    setEmail('');
    setFirstName('');
    setLastName('');
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
          borderRadius: 'var(--radius)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          padding: '2rem',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        <h1
          style={{
            marginTop: 0,
            marginBottom: '0.5rem',
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: 'var(--foreground)',
          }}
        >
          {t('kyc.title')}
        </h1>
        <p
          style={{
            margin: '0 0 2rem 0',
            color: 'var(--muted-foreground)',
            fontSize: '0.875rem',
          }}
        >
          {t('kyc.subtitle')}
        </p>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          {/* First Name Input */}
          <TextInput
            label={t('kyc.form.firstName.label')}
            type="text"
            placeholder={t('kyc.form.firstName.placeholder')}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          {/* Last Name Input */}
          <TextInput
            label={t('kyc.form.lastName.label')}
            type="text"
            placeholder={t('kyc.form.lastName.placeholder')}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          {/* Email Input */}
          <TextInput
            label={t('kyc.form.email.label')}
            type="email"
            placeholder={t('kyc.form.email.placeholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            helperText={t('kyc.form.email.helper')}
          />

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            <Button variant="primary" onClick={handleSubmit} fullWidth>
              {t('common.submit')}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              {t('common.reset')}
            </Button>
          </div>
        </div>

        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border)',
            fontSize: '0.75rem',
            color: 'var(--muted-foreground)',
            textAlign: 'center',
          }}
        >
          {t('kyc.footer', { version: KYC_SDK.version })}
        </div>
      </div>
    </div>
  );
}

export default Widget;
