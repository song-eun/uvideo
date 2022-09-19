import { useEffect, createRef } from "react";

function Video({ videoUrl, getVideoElement }) {
  const videoRef = createRef();

  useEffect(() => {
    const video = videoRef.current;
    getVideoElement(video);
  }, []);

  return (
    <video ref={videoRef} controls loop width="960" height="540">
      <source src={videoUrl} />
    </video>
  );
}

export default Video;
