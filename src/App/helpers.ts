import { ITemperature, ITransformedTemperature, TempChartActions } from "./types";
import { correctMonthsNames } from "./constants";
import { IBarChart } from "../components/BarChart/types";

const getFormattedMonth = (month: string): string => {
  const substrMonth = month.length > 3 ? month.substr(0, 3) : month.substr(0, 2);

  return correctMonthsNames[substrMonth.toLowerCase()];
};

export const transformData = (data: ITemperature[]): ITransformedTemperature => {
  const preparedData: ITransformedTemperature = {};

  data.forEach(({ date, value }) => {
    const [day, month, year] = date.split(" ");
    const formattedMonth = getFormattedMonth(month);

    const existYear = preparedData[year];
    const existMonth = existYear && preparedData[year][formattedMonth];
    const existDay = existYear && existMonth && preparedData[year][formattedMonth][day];

    preparedData[year] = {
      ...existYear,
      [formattedMonth]: {
        ...existMonth,
        [day]: existDay ? (+existDay + +value) / 2 : +value,
      },
    };
  });

  return preparedData;
};

const getActionValue = (
  data: { [key: string]: { [key: string]: number } },
  selectedAction: TempChartActions
): IBarChart[] => {
  switch (selectedAction) {
    case TempChartActions.TempMinimum:
      return Object.entries(data).map(([month, value]) => {
        const min = Math.min(...Object.entries(value).map(([, num]) => num));

        return [month, min];
      });
    case TempChartActions.TempMaximum:
      return Object.entries(data).map(([month, value]) => {
        const max = Math.max(...Object.entries(value).map(([, num]) => num));

        return [month, max];
      });
    case TempChartActions.TempAverage:
      return Object.entries(data).map(([month, value]) => {
        const average = Object.entries(value).reduce((acc, [, num]) => acc + num, 0) / Object.entries(value).length;

        return [month, +average.toFixed(2)];
      });
    case TempChartActions.TempMedian:
      return Object.entries(data).map(([month, value]) => {
        const sortedValues = Object.entries(value)
          .map(([, num]) => num)
          .sort((a, b) => a - b);
        const isEven = sortedValues.length % 2 === 0;

        if (isEven) {
          const median = (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2;

          return [month, +median.toFixed(2)];
        }

        return [month, sortedValues[(sortedValues.length - 1) / 2]];
      });
    default:
      return [];
  }
};

export const getBarChartData = (
  data: ITransformedTemperature,
  selectedYear: string,
  selectedMonth: string | null,
  selectedAction: TempChartActions | null
): IBarChart[] => {
  if (selectedMonth) {
    return Object.entries(data[selectedYear][selectedMonth]);
  }

  if (selectedAction) {
    return getActionValue(data[selectedYear], selectedAction);
  }

  return [];
};
