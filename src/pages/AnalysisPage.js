import { useState, useEffect, useRef, memo} from "react";
import { useLocation } from "react-router-dom";

// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
// import { Line, getElementAtEvent } from "react-chartjs-2";

import RowSea from "../components/videoAnalysis/RowSea";
import Display from "../components/videoAnalysis/Display";
import classes from "./AnalysisPage.module.css";
import styled from "styled-components";
import LoadingScreen from "../components/videoAnalysis/Loading";
import ChartAnalysis from "../components/videoAnalysis/ChartAnalysis";
import Graph from "../components/videoAnalysis/Graph";

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;
`;

const MapDiv = styled.div`
  border: 1px solid rgb(224, 224, 224); 
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  width: auto;
  display: grid;
  grid-template-columns: repeat(150, 10px);
`;

const Land = styled.div`
  grid-row-start: ${(props) => `${props.column + 1}`};
  grid-row-end: ${(props) => `${props.column + 1 + 1}`};

  justify-self: center;
  cursor: pointer;
  position: relative;

  &: hover > div {
    display: block;
  }
`;

const GridLand = styled.div`
  background-color: ${(props) => `hsl(${props.hColor}`},100%,50%);
  width: 10px;
  height: 6px;
  opacity: ${(props) => `${props.opacity}`};
`;

const ContentDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Loading = styled.div`
  display: flex;
  align-items: center; /* 수직 정렬 */
  flex-direction: row; /* default: row */
  justify-content: center; /* flex direction에 대해서 정렬방식 선택 */
  height: 5rem;
`;

const getValidWeightArray = (mapArray) => {
  let weightArray = mapArray.filter((node) => node.data.node_weight > 0);
  return weightArray;
};

//1. 평균 구하기
const getAvgWeight = (weightArray) => {
  let sumWeight = 0;
  weightArray.map((node) => (sumWeight += node.data.node_weight));
  let avgWeight = sumWeight / weightArray.length;
  return avgWeight;
};

//2.분산 구하기
const getStandardDeviation = (weightArray, avgWeight) => {
  let avgMinusList = weightArray.map((node) => {
    let num = 0;
    let weight = node.data.node_weight;
    num = weight - avgWeight;
    num = num * num;
    return num;
  });

  let squaredSum = avgMinusList.reduce(function add(sum, curValue) {
    return sum + curValue;
  }, 0);

  return Math.sqrt(squaredSum / (weightArray.length - 1));
};

const getZScoreArray = (mapArray, avgWeight, standardDeviation) => {
  let zScoreArray = mapArray.map((node) => {
    return (node.data.node_weight - avgWeight) / standardDeviation;
  });
  return zScoreArray;
};

// const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: "top",
//     },
//   },
//   maintainAspectRatio: false,
// };

function GraphAnalysisPage() {
  //분석 페이지에 필요한 변수
  const [objectList, setObjectList] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedObj, setSelectedObj] = useState(null);
  const [isSelectedObj, setIsSelectedObj] = useState(false);
  const [maxFrame, setMaxFrame] = useState(0);
  const [fps, setFps] = useState(0);
  const [rangeList, setRangeList] = useState([]);
  const [videoElement, setVideoElement] = useState(null);
  const [title, setTitle] = useState("");

  let location = useLocation();
  const videoId = location.state.videoId;
  const videoUrl = `http://202.31.147.195:7778/api/video/stream/${videoId}`;

  const displayComponentRef = useRef();

  useEffect(() => {
    fetch(`/api/urban-ai/object-list/${videoId}`, {
      method: "GET",
      redirect: "follow",
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {

        let str = data.objectList.replaceAll("[", "");
        str = str.replaceAll("]", "");
        str = str.split(", ");
        console.log(str);
        setObjectList(str);
        setMaxFrame(data.maxFrame);
        setFps(data.fps);
        setTitle(data.titls);
        setIsLoaded(true);
      });
  }, []);

  function handleObj(event) {
    event.preventDefault();
    console.log(event.target.value);
    fetch(`/api/urban-ai/emerge-frame/${videoId}?objectName=${event.target.value}`, {
      method: "GET",
      redirect: "follow",
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setRangeList(data.emergeFrame);
        displayComponentRef.current.setRange(data.emergeFrame);
      });
    setSelectedObj(event.target.value);
    setIsSelectedObj(true);
  }

  function handleVideoElement(video) {
    setVideoElement(video);
    console.log(video);
  }

  // function ChartAnalysis() {
  //   const [labels, setLabels] = useState(null);
  //   const [data, setData] = useState(null);
  //   const [isChartLoaded, setChartLoaded] = useState(false);
  //   const chartRef = useRef();

  //   const printElementAtEvent = (element) => {
  //     if (!element.length) return;

  //     const { datasetIndex, index } = element[0];
  //     return data.labels[index];
  //   };

  //   const onChartClick = (event) => {
  //     const { current: chart } = chartRef;

  //     if (!chart) {
  //       return;
  //     }
  //     const element = printElementAtEvent(getElementAtEvent(chart, event));
  //     const time = element.split(":").map((num) => parseInt(num));
  //     console.log(videoElement);

  //     if (videoElement) {
  //       console.log(videoElement);
  //       videoElement.currentTime = time[0] * 60 + time[1];
  //     }
  //   };

  //   fetch(`/api/urban-ai/chart/${videoId}?timeSet=10&objectName=${selectedObj}`, {
  //     method: "GET",
  //   })
  //     .then((response) => response.json())
  //     .then((result) => {
  //       setLabels(result.timeList);
  //       let datasets = [];

  //       var objectNum = {
  //         label: `${selectedObj} Num`, // 클릭된 객체이름으로 동적이게 가능?
  //         data: result.objectNum,
  //         borderColor: "rgb(255, 99, 132)",
  //         backgroundColor: "rgba(255, 99, 132, 0.5)",
  //         borderWidth: 2,
  //       };

  //       var objectSpeed = {
  //         label: `${selectedObj} Speed`, // 클릭된 객체이름으로 동적이게 가능?
  //         data: result.objectSpeed,
  //         borderColor: "rgb(53, 162, 235)",
  //         backgroundColor: "rgba(53, 162, 235, 0.5)",
  //         borderWidth: 2,
  //       };

  //       datasets.push(objectNum);
  //       datasets.push(objectSpeed);
  //       console.log(datasets);
  //       const data = { labels, datasets: datasets };

  //       setData(data);
  //       setChartLoaded(true);
  //     });

  //   return (
  //     isChartLoaded ? 
  //     (
  //       <>
  //         <div className={classes.divHr}></div>
  //         <div className={classes.text}>그래프</div>
  //         <div className={classes.chartContain}> <Line ref={chartRef} options={options} data={data} onClick={onChartClick} /></div>
  //       </>
  //     ) : 
  //       <>
  //         <div className={classes.divHr}></div>
  //         <div className={classes.text}>그래프</div>
  //         <Loading><div>Loading</div></Loading>
  //       </>
  //     )
  // }

  const onClickLand = (e) => {
    let frames = e.target.attributes.value.value;
    frames = frames.substring(2, frames.length - 2);
    let array = frames.split("],[");
    let graphFrameList = [];
    for (var i = 0; i < array.length; i++) {
      let frameByObj = array[i].split(",").map((num) => parseInt(num));
      graphFrameList.push(frameByObj);
    }
    console.log(graphFrameList);
    displayComponentRef.current.setRange(graphFrameList);
  };

  // const Graph = memo(() => {
  //   const [mapArray, setMapArray] = useState(null);
  //   const [IsLoadedMap, setIsLoadedMap] = useState(false);

  //   useEffect(() => {
  //     fetch(`/api/urban-ai/graph/${videoId}?maxX=150&maxY=150&objectName=${selectedObj}`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log(data);
  //         setMapArray(data.graphData);
  //       })
  //       .catch((err) => console.error(err));
  //   }, []);

  //   useEffect(() => {
  //     if (mapArray !== null) {
  //       setIsLoadedMap(true);
  //     }
  //   }, [mapArray]);

  //   const GernerateMapGrid = () => {
  //     if (!mapArray) return <></>;

  //     //weight가 0이 아닌 배열
  //     const validWeightArray = getValidWeightArray(mapArray);
  //     const avgWeight = getAvgWeight(validWeightArray);
  //     const standardDeviation = getStandardDeviation(mapArray, avgWeight);
  //     const zScoreArray = getZScoreArray(mapArray, avgWeight, standardDeviation);

  //     console.log(validWeightArray)
  //     console.log(avgWeight)
  //     console.log(standardDeviation)

  //     mapArray.map((node, i) => {
  //       node.data.hColor = (1.0 - zScoreArray[i]) * 170;
  //       return node;
  //     });

  //     return (
  //       <MapDiv>
  //         {mapArray.map((r, i) => {
  //           return r.data.node_weight === 0 ? (
  //             <RowSea key={i} column={Math.floor(i / 150)} length={1} />
  //           ) : (
  //             <Land key={i} column={Math.floor(i / 150)} length={1}>
  //               <GridLand key={i} onClick={onClickLand} opacity={r.data.opacity} hColor={r.data.hColor} value={r.data.frameId}></GridLand>
  //             </Land>
  //           );
  //         })}
  //       </MapDiv>
  //     );
  //   };

  //   return (
  //     IsLoadedMap ? (
  //       <>
  //         <div className={classes.divHr}></div>
  //         <div className={classes.text}>이동경로</div>
  //         <MapContainer>
  //           <GernerateMapGrid />
  //         </MapContainer>
  //       </>
  //     ) : 
  //     (
  //       <>
  //         <div className={classes.divHr}></div>
  //         <div className={classes.text}>이동경로</div>
  //         <Loading><div>Loading</div></Loading>
  //       </>
  //     )
  //   );
  // });

  function AnalysisSelect() {
    return (
      <div className={classes.analysisContainer}>
      <div className={classes.analysisDiv}>
        {/* <ChartAnalysis /> */}
        <ChartAnalysis videoElement={videoElement} videoId={videoId} selectedObj={selectedObj}/>
        {/* <Graph /> */}
        <Graph videoId={videoId} selectedObj={selectedObj} setGraphRange={displayComponentRef.current.setRange} />
      </div>
      </div>
    );
  }

  return (
    isLoaded ? (
    <div className={classes.contain}>
      <ContentDiv>
      <Display
        title={title}
        fps={fps}
        maxFrame={maxFrame}
        rangeList={rangeList}
        videoId={videoId}
        videoUrl={videoUrl}
        handleVideoElement={handleVideoElement}
        ref={displayComponentRef}
      />
      <div className={classes.btnContain}>
        <div className={classes.objList}>객체 리스트</div>
        <div onClick={handleObj} className={classes.btnDiv}>
        {
            objectList.map((item) => (
              <button className={classes.btn} value={item} key={item}>
                {item}
              </button>
            ))
            }
        </div>
      </div>
      </ContentDiv>
      {isSelectedObj && <AnalysisSelect />}
    </div>) :
    <LoadingScreen/>
  );
}

export default memo(GraphAnalysisPage);
