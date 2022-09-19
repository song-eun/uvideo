import RangeItem from "./RangeItem";
import classes from "./Range.module.css";
import { useRef, useEffect } from "react";

function Range({ rangeList, maxFrame, fps, getCurrentTime }) {
  let frameList = [];

  rangeList.map((item) => {
    let startFrame = item[0];
    let endFrame = item[item.length - 1];
    if(item.length < 4) {
      startFrame -= 2;
      endFrame += 2;
    }
    const percentFrame = ((endFrame - startFrame) / maxFrame) * 100;
    const left = (startFrame / maxFrame) * 100;
    let option = {
      percent: percentFrame,
      left: left,
    };
    frameList.push(option);
  });

  const controlRef = useRef(null);

  useEffect(() => {
    if (controlRef) {
      controlRef.current.addEventListener("click", (e) => {
        const rect = e.target.getBoundingClientRect();
        const width = rect.width;
        const offsetX = e.offsetX;
        const widthRatio = offsetX / width;
        const duration = maxFrame / fps;
        const toTime = Math.round(widthRatio * duration);
        // console.log(toTime);
        getCurrentTime(toTime);
      });
    }
  }, []);

  return (
    <ol className={classes.timeline} ref={controlRef}>
      {frameList.map((item, i) => (
        <RangeItem key={i} percent={item.percent} left={item.left} />
      ))}
    </ol>
  );
}

export default Range;
