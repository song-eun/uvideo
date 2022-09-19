import React, { useEffect, useState } from "react";
import styled from "styled-components";

const SkeletonLand = styled.div`
  background-color: grey;
  grid-row-start: ${(props) => `${props.column + 1}`};
  grid-row-end: ${(props) => `${props.column + 1 + props.length}`};

  cursor: pointer;
  position: relative;

  &: hover > div {
    display: block;
  }
`;

const Land = styled.div`
  grid-row-start: ${(props) => `${props.column + 1}`};
  grid-row-end: ${(props) => `${props.column + 1 + props.length}`};
  display: grid;
  grid-template-rows: repeat(${(props) => props.length}, 8px);
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
  width: 10px;
  height: 6px;
  opacity: ${(props) => `${props.opacity}`};
`;

const RowLand = ({ column, length, opacity, hColor, frameId, handleRangeList }) => {
  const [grid, setGrid] = useState(null);

  useEffect(() => {
    const tmpGrid = [];
    for (let i = 0; i < length; i++) {
      tmpGrid.push(i);
    }
    setGrid(tmpGrid);
  }, []);

  const onClickLand = (e) => {
    console.log(frameId);
    let frames = frameId;
    frames = frameId.substring(2, frameId.length - 2);
    let array = frames.split("],[");
    let frameList = [];
    for (var i = 0; i < array.length; i++) {
      let frameByObj = array[i].split(",").map((num) => parseInt(num));
      frameList.push(frameByObj);
    }
    handleRangeList(frameList);
  };

  const makeLand = () => {
    return grid.map((value, i) => <GridLand onClick={onClickLand} key={value} opacity={opacity} hColor={hColor} />);
  };

  return grid ? (
    <Land column={column} length={length}>
      {makeLand()}
    </Land>
  ) : (
    <SkeletonLand column={column} length={length}></SkeletonLand>
  );
};

export default React.memo(RowLand);
