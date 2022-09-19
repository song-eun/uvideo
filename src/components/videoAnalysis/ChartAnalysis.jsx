import React, { memo, useEffect, useState } from "react";
import { useRef } from "react";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line, getElementAtEvent } from "react-chartjs-2";
import classes from "./ChartAnalysis.module.css";
import styled from "styled-components";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Loading = styled.div`
  display: flex;
  align-items: center; /* 수직 정렬 */
  flex-direction: row; /* default: row */
  justify-content: center; /* flex direction에 대해서 정렬방식 선택 */
  height: 5rem;
`;

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
  maintainAspectRatio: false,
};

function ChartAnalysis({ videoElement, videoId, selectedObj }) {
    const [data, setData] = useState(null);
    const [isChartLoaded, setChartLoaded] = useState(false);
    const chartRef = useRef();

    const printElementAtEvent = (element) => {
      if (!element.length) return;

      const { datasetIndex, index } = element[0];
      return data.labels[index];
    };

    const onChartClick = (event) => {
      const { current: chart } = chartRef;

      if (!chart) {
        return;
      }
      const element = printElementAtEvent(getElementAtEvent(chart, event));
      const time = element.split(":").map((num) => parseInt(num));
      console.log(videoElement);

      if (videoElement) {
        console.log(videoElement);
        videoElement.currentTime = time[0] * 60 + time[1];
      }
    };

    useEffect(()=>{
      fetch(`/api/urban-ai/chart/${videoId}?timeSet=10&objectName=${selectedObj}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((result) => {
          const labels = result.timeList;

          const datas = { labels, datasets: [
            {
              label: `${selectedObj} Num`, // 클릭된 객체이름으로 동적이게 가능?
              data: result.objectNum,
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              borderWidth: 2,
            },{
              label: `${selectedObj} Speed`, // 클릭된 객체이름으로 동적이게 가능?
              data: result.objectSpeed,
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgba(53, 162, 235, 0.5)",
              borderWidth: 2,
            }], 
          };
          console.log(datas)
          setData(datas);
          setChartLoaded(true);
        });
    },[])


    return (
      <>
        <div className={classes.divHr}></div>
        <div className={classes.text}>그래프</div>
        {
          isChartLoaded ? (
            <div className={classes.chartContain}> 
              <Line ref={chartRef} options={options} data={data} onClick={onChartClick} />
            </div>
          ) : (
            <Loading>
              <div>Loading</div>
            </Loading>
          )}
      </>
    )
}

export default memo(ChartAnalysis);
