import { useState, useEffect } from "react";
import { TextInput, Button } from "./components/ui";
import { useSDKConfig } from "./hooks";

function Widget() {
  const { setTheme } = useSDKConfig();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const { theme } = (event as CustomEvent).detail;
      setTheme(theme);
    };

    const handleLanguageChange = (event: Event) => {
      const { lang, dir } = (event as CustomEvent).detail;
      console.log("Language changed to:", lang, dir);
    };

    const handleDebugChange = (event: Event) => {
      const { debug } = (event as CustomEvent).detail;
      console.log("Debug mode:", debug);
    };

    const handleUserData = (event: Event) => {
      const { userData } = (event as CustomEvent).detail;
      console.log("User data received:", userData);

      if (userData.firstName) setFirstName(userData.firstName);
      if (userData.lastName) setLastName(userData.lastName);
      if (userData.email) setEmail(userData.email);
    };

    window.addEventListener("widget-theme-change", handleThemeChange);
    window.addEventListener("widget-language-change", handleLanguageChange);
    window.addEventListener("widget-debug-change", handleDebugChange);
    window.addEventListener("widget-user-data", handleUserData);

    return () => {
      window.removeEventListener("widget-theme-change", handleThemeChange);
      window.removeEventListener("widget-language-change", handleLanguageChange);
      window.removeEventListener("widget-debug-change", handleDebugChange);
      window.removeEventListener("widget-user-data", handleUserData);
    };
  }, [setTheme]);

  const handleSubmit = () => {
    alert(`Form submitted!\nName: ${firstName} ${lastName}\nEmail: ${email}`);
  };

  const handleReset = () => {
    setEmail("");
    setFirstName("");
    setLastName("");
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
          borderRadius: "12px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          padding: "2rem",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <h1
          style={{
            marginTop: 0,
            marginBottom: "0.5rem",
            fontSize: "1.875rem",
            fontWeight: "bold",
            color: "var(--foreground)",
          }}
        >
          KYC Verification
        </h1>
        <p
          style={{
            margin: "0 0 2rem 0",
            color: "var(--muted-foreground)",
            fontSize: "0.875rem",
          }}
        >
          Please provide your information to continue
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          {/* First Name Input */}
          <TextInput
            label='First Name'
            type='text'
            placeholder='Enter your first name'
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />

          {/* Last Name Input */}
          <TextInput
            label='Last Name'
            type='text'
            placeholder='Enter your last name'
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />

          {/* Email Input */}
          <TextInput
            label='Email Address'
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            helperText="We'll never share your email"
          />

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <Button variant='primary' onClick={handleSubmit} fullWidth>
              Submit
            </Button>
            <Button variant='outline' onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>

        <div
          style={{
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border)",
            fontSize: "0.75rem",
            color: "var(--muted-foreground)",
            textAlign: "center",
          }}
        >
          Powered by KYC SDK v0.0.1
        </div>
      </div>
    </div>
  );
}

export default Widget;
