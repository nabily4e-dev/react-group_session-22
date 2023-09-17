interface Props {
  theme: string;
  setTheme(theme: string): void;
}

function DarkModeToggle({ theme, setTheme }: Props) {
  function handleToggleTheme(e: React.ChangeEvent<HTMLInputElement>) {
    setTheme(e.target.checked ? "dark" : "light");
  }
  return (
    <label>
      Dark Mode
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={handleToggleTheme}
      />
    </label>
  );
}

export default DarkModeToggle;
