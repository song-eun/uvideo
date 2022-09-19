import VideoGrid from "./PublicVideoGrid";
import { useEffect, useState } from "react";

function AdminVideos() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    setIsLoading(true);

    fetch("/api/video/admin-list", requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const videos = [];
        for (const key in data) {
          const video = {
            ...data[key],
          };
          videos.push(video);
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
      <h1>All Videos for admin</h1>
      <VideoGrid videos={loadedVideos} />
    </section>
  );
}

export default AdminVideos;
