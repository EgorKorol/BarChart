export enum TempChartActions {
  TempMaximum = "TempMaximum",
  TempMinimum = "TempMinimum",
  TempAverage = "TempAverage",
  TempMedian = "TempMedian",
}

export interface ITemperature {
  date: string;
  value: string;
}

export interface ITemperatureAction {
  label: string;
  value: TempChartActions;
}

export interface ITransformedTemperature {
  [key: string]: {
    [key: string]: {
      [key: string]: number;
    };
  };
}
