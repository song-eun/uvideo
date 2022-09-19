import { memo, useState, useEffect } from "react";

import styled from "styled-components";
import RowSea from "./RowSea";
import classes from "./Graph.module.css"

const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: auto;
  border: 1px solid rgb(224, 224, 224); 
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  margin-top: 2rem
`;

const MapDiv = styled.div`
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

const Loading = styled.div`
  display: flex;
  align-items: center; /* 수직 정렬 */
  flex-direction: row; /* default: row */
  justify-content: center; /* flex direction에 대해서 정렬방식 선택 */
  height: 5rem;
`;

const getZScoreArray = (mapArray) => {
  let weightArray = mapArray.filter((node) => node.data.node_weight > 0);
  let sumWeight = 0;
  weightArray.map((node) => (sumWeight += node.data.node_weight));
  let avgWeight = sumWeight / weightArray.length;
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

  let standardDeviation = Math.sqrt(squaredSum / (weightArray.length - 1))

  let zScoreArray = mapArray.map((node) => {
    return (node.data.node_weight - avgWeight) / standardDeviation;
  });
  return zScoreArray;
};


const Graph = ({ videoId, selectedObj, setGraphRange }) => {

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
    setGraphRange(graphFrameList);
  }

  const [mapArray, setMapArray] = useState(null);
  const [IsLoadedMap, setIsLoadedMap] = useState(false);

    useEffect(() => {
      fetch(`/api/urban-ai/graph/${videoId}?maxX=150&maxY=150&objectName=${selectedObj}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setMapArray(data.graphData);
        })
        .catch((err) => console.error(err));
    }, []);

  useEffect(() => {
    if (mapArray !== null) {
      setIsLoadedMap(true);
    }
  }, [mapArray]);

  const GernerateMapGrid = () => {
    if (!mapArray) return <></>;

    const zScoreArray = getZScoreArray(mapArray);

    mapArray.map((node, i) => {
      node.data.hColor = (1.0 - zScoreArray[i]) * 170;
      return node;
    });

    return (
      <MapDiv>
        {mapArray.map((r, i) => {
          return r.data.node_weight === 0 ? (
            <RowSea key={i} column={Math.floor(i / 150)} length={1} />
          ) : (
            <Land key={i} column={Math.floor(i / 150)} length={1}>
              <GridLand key={i} onClick={onClickLand} opacity={r.data.opacity} hColor={r.data.hColor} value={r.data.frameId}></GridLand>
            </Land>
          );
        })}
      </MapDiv>
    );
  };

  return (
    <>
    <div className={classes.divHr}></div>
    <div className={classes.text}>이동경로</div>
    {IsLoadedMap ? (
      <MapContainer>
          <GernerateMapGrid />
      </MapContainer>
    ) : (
      <Loading>
        <div>Loading</div>
      </Loading>
    )}
    </>
  );
};

export default memo(Graph);
