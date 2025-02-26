import { createContext, useState ,useContext } from "react";

const AddContext = createContext();

export function useLocalContext() {
  return useContext(AddContext);
}

export function ContextProvider({ children }) {
    const [state, setState] = useState(false);
    const value = { state, setState };


  return <AddContext.Provider value={value}>{children}</AddContext.Provider>;
}