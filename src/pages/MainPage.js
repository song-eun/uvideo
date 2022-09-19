import SearchForm from "../components/search/SearchForm";
import classes from "./MainPage.module.css";

import { useEffect, useState } from "react";
import PublicVideoGrid from "../components/videoGrid/PublicVideoGrid";

function MainPage() {
  const [searchText, setSearchText] = useState("");
  const [videoList, setVideoList] = useState([]);

  function handleInputText(text) {
    setSearchText(text);
  }

  useEffect(() => {
    fetch("/api/video/search", {
      method: "POST",
      body: JSON.stringify({
        content: searchText,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setVideoList(data);
      });
  }, [searchText]);

  return (
    <section className={classes.mainDiv}>
      <SearchForm handleInputText={handleInputText} />
      <div className={classes.wrapVideos}>
        <PublicVideoGrid videos={videoList} />
      </div>
    </section>
  );
}

export default MainPage;
