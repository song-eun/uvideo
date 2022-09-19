import { forwardRef, memo, useImperativeHandle, useState } from "react";
import classes from "./Control.module.css";
import Range from "./Range";

// function Control({ fps, maxFrame, left, rangeList, getCurrentTime }) {
const Control = (props) => {
  // const fps = props.fps;
  // const maxFrame = props.maxFrame;
  // const left = props.left;
  // const rangeList = props.rangeList;

  return (
    <div className={classes.control} style={{ height: "20px" }}>
      <div className={classes.container}>
        <Range rangeList={props.rangeList} fps={props.fps} maxFrame={props.maxFrame} getCurrentTime={props.getCurrentTime} />
        <div className={classes.timeCursor} style={{ left: `${props.left}%` }}></div>
      </div>
    </div>
  );
};

export default Control;
