import { forwardRef, memo, useImperativeHandle, useRef, useState, useEffect, useSyncExternalStore } from "react";
import Control from "./Control";
import Video from "./Video";
import classes from "./Display.module.css";

const Display = forwardRef((props, ref) => {
  const [left, setLeft] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  let videoRef = null;
  let [videoElement, setVideoElement] = useState();

  //rangeList 넘겨주기
  const [rangeList, setRangeList] = useState([]);

  useImperativeHandle(ref, () => ({
    setRange: (range) => {
      console.log(range)
      setRangeList(range);
      console.log(rangeList);
    },
  }));

  const fps = props.fps;
  const maxFrame = props.maxFrame;
  // const rangeList = props.rangeList;

  let myVideo;
  let myControl;
  if (fps !== 0) {
    myVideo = <Video getVideoElement={getVideoElement} videoUrl={props.videoUrl} />;
    myControl = (
      <Control
        fps={fps}
        maxFrame={maxFrame}
        left={left}
        getCurrentTime={getCurrentTime}
        rangeList={rangeList}
        ref={props.controlComponentRef}
      />
    );
  } else {
    myVideo = null;
    myControl = null;
  }

  function getCurrentTime(newTime) {
    console.log(videoRef);
    // console.log(props);
    props.handleVideoElement(videoRef);

    if (videoRef) {
      videoRef.currentTime = newTime;
    }
    // setCurrentTime(newTime);
    setLeft(((newTime * fps) / maxFrame) * 100);
  }

  function getVideoElement(video) {
    setVideoElement(video);
    console.log(videoElement);
    // console.log(props);
    props.handleVideoElement(video);
    videoRef = video;

    videoRef.addEventListener("timeupdate", (event) => {
      // setCurrentTime(event.target.currentTime * fps);
      setLeft(((event.target.currentTime * fps) / maxFrame) * 100);
    });
  }

  return (
    <div className={classes.displayContain}>
      <h1>{props.title}</h1>
      {myVideo}
      {myControl}
    </div>
  );
});

export default Display;
