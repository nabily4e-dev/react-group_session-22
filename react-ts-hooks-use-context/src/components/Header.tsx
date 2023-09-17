import { useContext } from "react";
import { UserContext } from "../context/user";
import defaultUser from "../data";
import DarkModeToggle from "./DarkModeToggle";
import ThemedButton from "./ThemedButton";

interface Props {
  theme: string;
  setTheme(theme: string): void;
}

function Header({ theme, setTheme }: Props) {
  const { user, setUser } = useContext(UserContext);

  function handleLogin() {
    if (user) {
      setUser(null);
    } else {
      setUser(defaultUser);
    }
  }

  return (
    <header>
      <h1>React Context</h1>
      <nav>
        <ThemedButton onClick={handleLogin} theme={theme}>
          {user ? "Logout" : "Login"}
        </ThemedButton>
        <DarkModeToggle theme={theme} setTheme={setTheme} />
      </nav>
    </header>
  );
}

export default Header;
