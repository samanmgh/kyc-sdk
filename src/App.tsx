import { useState } from "react";
import "./App.css";
import {
  TextInput,
  Button,
  Checkbox,
  RadioButton,
  RadioGroup,
  MultiSelect,
  KYCSDKProvider,
  useSDKConfig,
} from ".";
import type { Theme } from ".";

function ThemeSwitcher() {
  const { theme, setTheme, toggleTheme } = useSDKConfig();

  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "var(--muted)",
        borderRadius: "var(--radius)",
        marginBottom: "2rem",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Theme Controls (KYCSDKProvider)</h3>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant={theme === "light" ? "primary" : "outline"}
          size='sm'
          onClick={() => setTheme("light")}
        >
          ☀️ Light
        </Button>
        <Button
          variant={theme === "dark" ? "primary" : "outline"}
          size='sm'
          onClick={() => setTheme("dark")}
        >
          🌙 Dark
        </Button>
        <Button variant='ghost' size='sm' onClick={toggleTheme}>
          🔄 Toggle
        </Button>
        <span
          style={{
            marginLeft: "1rem",
            fontSize: "0.875rem",
            color: "var(--muted-foreground)",
          }}
        >
          Theme: <strong>{theme}</strong>
        </span>
      </div>
    </div>
  );
}

function AppContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [gender, setGender] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Form submitted successfully!");
    }, 2000);
  };

  const skillOptions = [
    { label: "JavaScript", value: "js" },
    { label: "TypeScript", value: "ts" },
    { label: "React", value: "react" },
    { label: "Vue", value: "vue" },
    { label: "Angular", value: "angular" },
    { label: "Node.js", value: "node" },
    { label: "Python", value: "python" },
    { label: "Go", value: "go" },
  ];

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1>KYC SDK Component Preview</h1>
      <p>Demo with simplified KYCSDKProvider (shadcn compatible)</p>

      <ThemeSwitcher />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          marginTop: "2rem",
        }}
      >
        {/* Button Component */}
        <section>
          <h2>Button Component</h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Button variant='primary'>Primary Button</Button>
            <Button variant='secondary'>Secondary Button</Button>
            <Button variant='outline'>Outline Button</Button>
            <Button variant='ghost'>Ghost Button</Button>
            <Button variant='primary' size='sm'>
              Small
            </Button>
            <Button variant='primary' size='lg'>
              Large
            </Button>
            <Button variant='primary' loading>
              Loading
            </Button>
            <Button variant='primary' disabled>
              Disabled
            </Button>
          </div>
        </section>

        {/* TextInput Component */}
        <section>
          <h2>TextInput Component</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <TextInput
              label='Email'
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              helperText="We'll never share your email"
            />
            <TextInput
              label='Password'
              type='password'
              placeholder='Enter your password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <TextInput label='Disabled Input' placeholder='This is disabled' disabled />
            <TextInput
              label='Input with Error'
              placeholder='This has an error'
              error='This field is required'
            />
          </div>
        </section>

        {/* Checkbox Component */}
        <section>
          <h2>Checkbox Component</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Checkbox
              label='I agree to the terms and conditions'
              description='You must agree to continue'
              checked={agreeToTerms}
              onChange={setAgreeToTerms}
              required
            />
            <Checkbox
              label='Subscribe to newsletter'
              description='Get weekly updates about new features'
              checked={newsletter}
              onChange={setNewsletter}
            />
            <Checkbox label='Disabled Checkbox' disabled />
            <Checkbox label='Indeterminate Checkbox' indeterminate />
          </div>
        </section>

        {/* RadioButton Component */}
        <section>
          <h2>RadioButton Component</h2>
          <RadioGroup
            name='gender'
            label='Select your gender'
            value={gender}
            onChange={setGender}
            required
          >
            <RadioButton value='male' label='Male' description='Select if you identify as male' />
            <RadioButton
              value='female'
              label='Female'
              description='Select if you identify as female'
            />
            <RadioButton value='other' label='Other' />
            <RadioButton value='prefer-not' label='Prefer not to say' />
          </RadioGroup>
        </section>

        {/* MultiSelect Component */}
        <section>
          <h2>MultiSelect Component</h2>
          <MultiSelect
            label='Select your skills'
            placeholder='Choose your technical skills...'
            options={skillOptions}
            value={selectedSkills}
            onChange={setSelectedSkills}
            searchable
            required
          />
        </section>

        {/* Form Actions */}
        <section>
          <h2>Form Actions</h2>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Button variant='primary' loading={loading} onClick={handleSubmit}>
              Submit Form
            </Button>
            <Button
              variant='outline'
              onClick={() => {
                setEmail("");
                setPassword("");
                setAgreeToTerms(false);
                setNewsletter(false);
                setGender("");
                setSelectedSkills([]);
              }}
            >
              Reset
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function App() {
  // Example: Parent controls theme state (like next-themes)
  const [theme, setTheme] = useState<Theme>("light");

  return (
    <KYCSDKProvider config={{ debug: true }} theme={theme} setTheme={setTheme}>
      <AppContent />
    </KYCSDKProvider>
  );
}

export default App;
