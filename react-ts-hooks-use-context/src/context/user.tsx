import React, { useState } from "react";
import { User } from "../data";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = React.createContext<User | UserContextType>(
  {} as UserContextType
);

function UserProvider({ children }: { children: React.ReactNode }) {
  // const currentUser = {
  //   name: "NabiL",
  //   interests: ["React", "Next.js", "TypeScript", "JavaScript", "Node", "CSS"],
  // };

  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
