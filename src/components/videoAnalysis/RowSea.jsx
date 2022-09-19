import React from "react";
import styled from "styled-components";

const Land = styled.div`
  grid-row-start: ${(props) => `${props.column + 1}`};
  grid-row-end: ${(props) => `${props.column + 1 + props.length}`};
`;
// export const RowSea = ({ column, setCountry, point, length }) => {
const RowSea = ({ column, length }) => {
  return <Land column={column} length={length}></Land>;
};

export default RowSea

// export const RowSea = React.memo(RowSea);
