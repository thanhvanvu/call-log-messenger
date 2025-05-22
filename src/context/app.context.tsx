"use client";
import { createContext, useState, use, useEffect, useRef } from "react";

import TourGuide from "@/component/TourGuide";

interface AppContextType {
  rawCallLogs: IRawLogType[];
  setRawCallLogs: (v: IRawLogType[]) => void;
  participants: IParticipant | null;
  setParticipants: (v: IParticipant) => void;
  dataStatistic: IDataStatistic;
  setDataStatistic: (v: IDataStatistic) => void;
  dateFilter: IDateFilterType[];
  setDateFilter: (v: IDateFilterType[]) => void;
  dateRange: IDateRange | null;
  setDateRange: (v: IDateRange | null) => void;
  guideTour: boolean;
  setGuideTour: (v: boolean) => void;
  tourStep: ITourStep;
  setTourStep: (v: ITourStep) => void;
  dataPdf: IDataPdf[];
  setDataPdf: (v: IDataPdf[]) => void;
  chatLogImages: IChatLog[];
  setChatLogImages: (v: IChatLog[]) => void;
  language: string;
  setLanguage: (v: string) => void;
}

// Create a ThemeContext
const AppContext = createContext<AppContextType | null>(null);

interface IAppProvideProps {
  children: React.ReactNode;
}

const AppProvider = (props: IAppProvideProps) => {
  const [rawCallLogs, setRawCallLogs] = useState<IRawLogType[]>([]);
  const [participants, setParticipants] = useState<IParticipant | null>(null);
  const [dataStatistic, setDataStatistic] = useState<IDataStatistic>({
    totalSuccessCall: {
      total: 0,
      totalDuration: "",
      totalDurationInHourFormat: "",
    },
    totalCallFromNameA: {
      total: 0,
      totalDuration: "",
      totalDurationInHourFormat: "",
    },
    totalCallFromNameB: {
      total: 0,
      totalDuration: "",
      totalDurationInHourFormat: "",
    },
    totalMissedCall: {
      total: 0,
      fromNameA: 0,
      fromNameB: 0,
    },
  });
  const [dateFilter, setDateFilter] = useState<IDateFilterType[]>([]);
  const [dateRange, setDateRange] = useState<IDateRange | null>(null);
  const [guideTour, setGuideTour] = useState<boolean>(false);

  const [tourStep, setTourStep] = useState<ITourStep>({
    currentStep: 0,
    step0: null,
    step1: null,
    step2: null,
    step3: null,
    step4: null,
    step5: null,
    step6: null,
    step7: null,
  });

  const [dataPdf, setDataPdf] = useState<IDataPdf[]>([]);

  const [chatLogImages, setChatLogImages] = useState<IChatLog[]>([]);

  const [language, setLanguage] = useState<string>("");

  // Read language from sessionStorage on mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);

  return (
    <AppContext
      value={{
        rawCallLogs,
        setRawCallLogs,
        participants,
        setParticipants,
        dataStatistic,
        setDataStatistic,
        dateFilter,
        setDateFilter,
        dateRange,
        setDateRange,
        guideTour,
        setGuideTour,
        tourStep,
        setTourStep,
        dataPdf,
        setDataPdf,
        chatLogImages,
        setChatLogImages,
        language,
        setLanguage,
      }}
    >
      <TourGuide />
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
