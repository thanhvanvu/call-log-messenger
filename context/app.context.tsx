"use client";
import { createContext, useState, use } from "react";

interface AppContextType {
  mobileModal: boolean;
  setMobileModal: (v: boolean) => void;
}

// Create a ThemeContext
const AppContext = createContext<AppContextType | null>(null);

interface IAppProvideProps {
  children: React.ReactNode;
}

const AppProvider = (props: IAppProvideProps) => {
  const [mobileModal, setMobileModal] = useState<boolean>(true);

  return (
    <AppContext
      value={{
        mobileModal,
        setMobileModal,
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
