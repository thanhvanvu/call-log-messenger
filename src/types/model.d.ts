export {};

declare global {
  interface IRawLogType {
    call_duration: number;
    content: string;
    date: string;
    dateNumber: string;
    sender_name?: string;
    time: string;
    timestamp_ms: number;
  }

  interface ICallLogType {
    call_duration: string;
    content: string;
    date: string;
    sender_name: string;
    time: string;
    timestamp_ms: number;
    dateNumber?: string;
  }

  interface IDateFilterType {
    text: string;
    value: string;
    label: string;
  }

  interface IDataStatistic {
    totalSuccessCall: {
      total: number;
      totalDuration: string;
      totalDurationInHourFormat: string;
    };
    totalCallFromNameA: {
      total: number;
      totalDuration: string;
      totalDurationInHourFormat: string;
    };
    totalCallFromNameB: {
      total: number;
      totalDuration: string;
      totalDurationInHourFormat: string;
    };
    totalMissedCall: {
      total: number;
      fromNameA: number;
      fromNameB: number;
    };
  }

  interface IParticipant {
    nameA: string;
    nameB: string;
  }

  interface IDateRange {
    from: string;
    to: string;
  }

  interface IDataPdf {
    monthYear: string;
    statistic: IDataStatistic;
    callLogToShow: ICallLogType[];
    dateRange: IDateRange;
  }

  interface ITourStep {
    currentStep: number;
    step0: React.RefObject<HTMLDivElement | null> | null;
    step1: React.RefObject<HTMLDivElement | null> | null;
    step2: React.RefObject<HTMLDivElement | null> | null;
    step3: React.RefObject<HTMLDivElement | null> | null;
    step4: React.RefObject<HTMLDivElement | null> | null;
    step5: React.RefObject<HTMLDivElement | null> | null;
    step6: React.RefObject<HTMLDivElement | null> | null;
    step7: React.RefObject<HTMLDivElement | null> | null;
  }

  type OnChange = NonNullable<TableProps<ICallLogType>["onChange"]>;
  type Filters = Parameters<OnChange>[1];

  type GetSingle<T> = T extends (infer U)[] ? U : never;
  type Sorts = GetSingle<Parameters<OnChange>[2]>;
}
