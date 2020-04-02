import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import "./styles.css";
import { IProps } from "./types";

const BarChart: React.FC<IProps> = ({ data = [] }) => {
  const medianRef = useRef<null | HTMLDivElement>(null);
  const [medianWidth, setMedianWidth] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(0);

  useLayoutEffect(() => {
    if (medianRef.current) {
      setMedianWidth(medianRef.current.offsetWidth);
    }
  }, [medianRef]);

  useEffect(() => {
    if (data.length) {
      const max = Math.max(...data.map(([, value]) => Math.abs(value)));

      setMaxValue(Math.ceil(max));
    }
  }, [data]);

  const { length } = data;
  const width = +(medianWidth / length).toFixed(0);

  return (
    <aside className="bar-chart">
      <div className="bar-chart__y">
        {maxValue && <span className="bar-chart__y-num bar-chart__y-num--max">{maxValue}</span>}
        {maxValue && <span className="bar-chart__y-num bar-chart__y-num--half-max">{maxValue / 2}</span>}
        <span className="bar-chart__y-num bar-chart__y-num--zero">0</span>
        {maxValue && <span className="bar-chart__y-num bar-chart__y-num--half-min">{-(maxValue / 2)}</span>}
        {maxValue && <span className="bar-chart__y-num bar-chart__y-num--min">{-maxValue}</span>}
      </div>
      <div className="bar-chart__median" ref={medianRef}>
        {data.map(([key, value], index): 0 | JSX.Element | null => {
          const height = maxValue ? +((340 * Math.abs(value)) / maxValue).toFixed(0) : 0;

          return (
            <div
              className="bar-chart__item"
              style={{
                width: width - 20,
                left: index * width + 10,
                height,
                bottom: value > 0 ? 0 : -height,
              }}
              key={key}
            >
              <div className="bar-chart__tooltip">
                {key}: {value}℃
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default BarChart;
