import PublicVideoGrid from "./PublicVideoGrid";
import { useEffect, useState } from "react";

function PublicVideos() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    setIsLoading(true);

    fetch("/api/video/list", requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const videos = [];
        console.log(data);
        for (const key in data) {
          console.log(data[key]);
          const video = {
            ...data[key],
          };
          videos.push(video);
          console.log(video.privacyStatus);
        }
        setIsLoading(false);
        setLoadedVideos(videos);
      });
  }, []);

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <section>
      <h1>PublicVideos</h1>
      <PublicVideoGrid videos={loadedVideos} />
    </section>
  );
}

export default PublicVideos;

//https://velog.io/@pixelstudio/React-Hooks%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-%ED%95%84%ED%84%B0-%EB%B2%84%ED%8A%BC-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-1-
