import Grid from "../layout/Grid";
import VideoItem from "./VideoItem";
// import classes from "./VideoList.module.css";

function MyVideoGrid(props) {
  return (
    // <ul className={classes.list}>
    <Grid>
      {props.videos.map((video) => (
        <div key={video.id}>
          <VideoItem key={video.id} id={video.id} title={video.fileName} />
          <button>modify</button>
          <button>delete</button>
        </div>
      ))}
      <div></div>
    </Grid>
  );
}

export default MyVideoGrid;
