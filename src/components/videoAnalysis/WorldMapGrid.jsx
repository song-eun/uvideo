import { memo, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { MemoizedSea } from "./RowSea";
// import RowLand from "./RowLand";

const MapWrapper = styled.div`
  width: auto;
  display: grid;
  grid-gap: 3px;
  grid-template-rows: repeat(150, 3px);
`;
const MapDiv = styled.div`
  width: auto;
  display: grid;
  grid-template-columns: repeat(150, 12px);
`;

const Land = styled.div`
  grid-row-start: ${(props) => `${props.column + 1}`};
  grid-row-end: ${(props) => `${props.column + 1 + 1}`};
  display: grid;
  grid-template-rows: repeat(1, 8px);
  grid-gap: 3px;

  justify-self: center;
  cursor: pointer;
  position: relative;

  &: hover > div {
    display: block;
  }
`;

const GridLand = styled.div`
  background-color: ${(props) => `hsl(${props.hColor}`},100%,50%);
  width: 12px;
  height: 8px;
  opacity: ${(props) => `${props.opacity}`};
`;

const onClickLand = (e) => {
  console.log(e.target.attributes);
};

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

  return Math.sqrt(squaredSum / weightArray.length - 1);
};

const getZScoreArray = (mapArray, avgWeight, standardDeviation) => {
  let zScoreArray = mapArray.map((node) => {
    return (node.data.node_weight - avgWeight) / standardDeviation;
  });
  return zScoreArray;
};

const WorldMapGrid = ({ finishLoading, mapRef, videoId, obj }) => {
  const [mapArray, setMapArray] = useState(null);
  const [IsLoadedMap, setIsLoadedMap] = useState(false);

  useEffect(() => {
    fetch(`/api/urban-ai/graph/${videoId}?maxX=150&maxY=150&objectName=${obj}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMapArray(data.graphData);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (mapArray !== null) {
      //   console.log(mapArray);
      // finishLoading(true);
      setIsLoadedMap(true);
    }
  }, [mapArray]);

  const GernerateMapGrid = () => {
    if (!mapArray) return <></>;

    //weight가 0이 아닌 배열
    const validWeightArray = getValidWeightArray(mapArray);
    const avgWeight = getAvgWeight(validWeightArray);
    const standardDeviation = getStandardDeviation(mapArray, avgWeight);
    const zScoreArray = getZScoreArray(mapArray, avgWeight, standardDeviation);

    mapArray.map((node, i) => {
      node.data.hColor = (1.0 - zScoreArray[i]) * 170;
      return node;
    });

    return (
      <MapDiv>
        {mapArray.map((r, i) => {
          return r.data.node_weight === 0 ? (
            <MemoizedSea key={i} column={Math.floor(i / 150)} length={1} />
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
      <MapWrapper>
        <GernerateMapGrid />
      </MapWrapper>
    </>
  );
};

export default memo(WorldMapGrid);
