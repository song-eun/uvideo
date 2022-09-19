import Grid from "../layout/Grid";
import { Link } from "react-router-dom";
import VideoItem from "./VideoItem";
import classes from "./PublicVideoGrid.module.css";

function PublicVideoGrid(props) {
  console.log(props.videos);

  return (
    // <ul className={classes.list}>
    <Grid>
      {props.videos.map((video) => (
        <div key={video.id}>
          <Link to="/analysis" state={{ videoId: video.id }} className={classes.videoLink}>
            <VideoItem key={video.id} id={video.id} title={video.fileName} />
            {/* <button>chart</button> */}
          </Link>
          {/* <button>graph</button> */}
        </div>
      ))}
      <div></div>
    </Grid>
  );
}

export default PublicVideoGrid;
