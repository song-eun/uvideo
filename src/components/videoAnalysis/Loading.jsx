import React, { useEffect, memo } from 'react';
import styled from 'styled-components';

const LoadingDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  background-color: var(--backgroundColor);
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 30px;
  justify-content: center;
  align-items: center;
`
const Indication = styled.div`
  color: var(--textColor);
  font-size: 25px;
  text-align: center;
`

const LoadingScreen = () => {
    return <LoadingDiv>
        <Indication>
            데이터가 준비중입니다
        </Indication>
    </LoadingDiv>
}

export default LoadingScreen;