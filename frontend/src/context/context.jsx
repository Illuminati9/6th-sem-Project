import { createContext, useState, useContext } from "react";

const AddContext = createContext();

export function useLocalContext() {
  return useContext(AddContext);
}

export function ContextProvider({ children }) {
  const [state, setState] = useState(false);
  const [join, setJoin] = useState(false);

  const value = { state, setState, join, setJoin };

  return <AddContext.Provider value={value}>{children}</AddContext.Provider>;
}
