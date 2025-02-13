"use client";
import { createContext, useState, use, useEffect } from "react";

interface AppContextType {
  callLogs: string;
  setCallLogs: (v: string) => void;
  language: string;
  setLanguage: (v: string) => void;
}

// Create a ThemeContext
const AppContext = createContext<AppContextType | null>(null);

interface IAppProvideProps {
  children: React.ReactNode;
}

const AppProvider = (props: IAppProvideProps) => {
  const [callLogs, setCallLogs] = useState<string>("test");
  const [language, setLanguage] = useState<string>("en");

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <AppContext
      value={{
        callLogs,
        setCallLogs,
        language,
        setLanguage,
      }}
    >
      {props.children}
    </AppContext>
  );
};

// custom hook to call useContext
export const useCurrentApp = () => {
  const currentAppContext = use(AppContext);

  if (!currentAppContext) {
    throw new Error("useCurrentApp has to be used within <AppContext.Provider>");
  }

  return currentAppContext;
};

export default AppProvider;
