import MyVideoGrid from "./MyVideoGrid";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../../store/auth-context";

function MyVideos() {
  const authCtx = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    // console.log(authCtx);
    // console.log(authCtx.username);
    setIsLoading(true);

    fetch(`/api/video/list/${authCtx.username}`, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const videos = [];
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
      <h1>My Videos</h1>
      <MyVideoGrid videos={loadedVideos} />
    </section>
  );
}

export default MyVideos;
