import { useState } from "react";
import "./App.css";
import { TextInput, Button, Checkbox, RadioButton, RadioGroup, MultiSelect, ThemeProvider, useTheme } from ".";

function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div style={{
      padding: "1rem",
      backgroundColor: "var(--color-muted)",
      borderRadius: "var(--radius-md)",
      marginBottom: "2rem"
    }}>
      <h3 style={{ marginTop: 0 }}>Theme Controls</h3>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
        <Button
          variant={theme === 'light' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setTheme('light')}
        >
          ☀️ Light
        </Button>
        <Button
          variant={theme === 'dark' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setTheme('dark')}
        >
          🌙 Dark
        </Button>
        <Button
          variant={theme === 'system' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setTheme('system')}
        >
          💻 System
        </Button>
        <span style={{ marginLeft: "1rem", fontSize: "0.875rem", color: "var(--color-muted-foreground)" }}>
          Current: <strong>{theme}</strong> (Resolved: <strong>{resolvedTheme}</strong>)
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
      <h1>Component Preview</h1>
      <p>Preview of all available components in the KYC SDK</p>

      <ThemeSwitcher />

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: "2rem" }}>
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
            <TextInput
              label='Disabled Input'
              placeholder='This is disabled'
              disabled
            />
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
            <Checkbox
              label='Checkbox with Error'
              error='This field is required'
              size='lg'
            />
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
            <RadioButton
              value='male'
              label='Male'
              description='Select if you identify as male'
            />
            <RadioButton
              value='female'
              label='Female'
              description='Select if you identify as female'
            />
            <RadioButton
              value='other'
              label='Other'
              description='Select if you identify as other'
            />
            <RadioButton
              value='prefer-not'
              label='Prefer not to say'
            />
          </RadioGroup>

          <div style={{ marginTop: "1rem" }}>
            <RadioGroup
              name='plan'
              label='Select a plan (Horizontal)'
              orientation='horizontal'
              defaultValue='basic'
            >
              <RadioButton value='basic' label='Basic' />
              <RadioButton value='pro' label='Pro' />
              <RadioButton value='enterprise' label='Enterprise' />
            </RadioGroup>
          </div>
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
          <div style={{ marginTop: "1rem" }}>
            <MultiSelect
              label='Limited Selection (Max 3)'
              placeholder='Select up to 3 options...'
              options={skillOptions}
              maxSelections={3}
              searchable
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <MultiSelect
              label='Disabled MultiSelect'
              placeholder='This is disabled'
              options={skillOptions}
              disabled
            />
          </div>
        </section>

        {/* Form Actions */}
        <section>
          <h2>Form Actions</h2>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Button variant='primary' loading={loading} onClick={handleSubmit}>
              Submit Form
            </Button>
            <Button variant='outline' onClick={() => {
              setEmail("");
              setPassword("");
              setAgreeToTerms(false);
              setNewsletter(false);
              setGender("");
              setSelectedSkills([]);
            }}>
              Reset
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
