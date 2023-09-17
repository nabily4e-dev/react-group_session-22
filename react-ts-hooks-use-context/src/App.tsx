import { useState } from "react";
import Header from "./components/Header";
import Profile from "./components/Profile";
import { User } from "./data";

import { UserProvider } from "./context/user";

function App() {
  const [theme, setTheme] = useState("dark");
  const [user, setUser] = useState<User | null>(null);
  return (
    <main className={theme}>
      <UserProvider>
        <Header theme={theme} setTheme={setTheme} />
        <Profile theme={theme} />
      </UserProvider>
    </main>
  );
}

export default App;
