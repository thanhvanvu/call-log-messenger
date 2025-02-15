export {};

declare global {
  interface IRawLogType {
    call_duration: number;
    content: string;
    date: string;
    sender_name: string;
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
  }

  interface IDateFilterType {
    text: string;
    value: string;
  }

  interface IDataStatistic {
    totalSuccessCall: {
      total: number;
      totalDuration: string;
    };
    totalCallFromNameA: {
      total: number;
      totalDuration: string;
    };
    totalCallFromNameB: {
      total: number;
      totalDuration: string;
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

  type OnChange = NonNullable<TableProps<ICallLogType>["onChange"]>;
  type Filters = Parameters<OnChange>[1];

  type GetSingle<T> = T extends (infer U)[] ? U : never;
  type Sorts = GetSingle<Parameters<OnChange>[2]>;
}
