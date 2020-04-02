import React, { useMemo, useState, useEffect } from "react";
import "./styles.css";
import { chartActions, data } from "./constants";
import { TempChartActions } from "./types";
import { transformData, getBarChartData } from "./helpers";
import BarChart from "../components/BarChart/BarChart";
import { IBarChart } from "../components/BarChart/types";

function App() {
  const preparedData = useMemo(() => transformData(data), []);

  const years = Object.keys(preparedData);
  const [selectedYear, setSelectedYear] = useState<string>(years[0]);
  const handleYearSelect = (value: string) => (): void => {
    setSelectedYear(value);
    setSelectedMonth(null);
    setSelectedAction(TempChartActions.TempMaximum);
  };

  const months = useMemo(() => Object.keys(preparedData[selectedYear]), [preparedData, selectedYear]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const handleMonthSelect = (value: string) => (): void => {
    if (selectedMonth === value) {
      setSelectedMonth(null);
      setSelectedAction(TempChartActions.TempMaximum);
    } else {
      setSelectedMonth(value);
      setSelectedAction(null);
    }
  };

  const [selectedAction, setSelectedAction] = useState<TempChartActions | null>(TempChartActions.TempMaximum);
  const handleActionSelect = (value: TempChartActions) => (): void => {
    setSelectedAction(value);
  };

  const [chartData, setChartData] = useState<IBarChart[]>([]);
  useEffect(() => {
    console.log(`useEffect getBarChartData`);
    setChartData(getBarChartData(preparedData, selectedYear, selectedMonth, selectedAction));
  }, [selectedYear, selectedMonth, selectedAction, preparedData]);

  return (
    <main className="App">
      <div>
        {chartActions.map(
          ({ label, value }): JSX.Element => (
            <button
              key={value}
              className={`button${selectedAction === value ? " button--active" : ""}`}
              type="button"
              disabled={selectedAction === null}
              onClick={handleActionSelect(value)}
            >
              {label}
            </button>
          )
        )}
      </div>
      <div>
        {years.map(
          (value): JSX.Element => (
            <button
              key={value}
              className={`button${selectedYear === value ? " button--active" : ""}`}
              type="button"
              onClick={handleYearSelect(value)}
            >
              {value}
            </button>
          )
        )}
      </div>
      <div>
        {months.map(
          (value): JSX.Element => {
            const selected = selectedMonth === value;
            return (
              <button
                key={value}
                className={`button${selected ? " button--active" : ""}`}
                type="button"
                onClick={handleMonthSelect(value)}
              >
                {value}
                {selected && " ✅"}
              </button>
            );
          }
        )}
      </div>
      <BarChart data={chartData} />
    </main>
  );
}

export default App;
