// import Card from "../ui/Card";
import classes from "./VideoItem.module.css";

const DEFALUT_URL = "http://202.31.147.195:7778/api/video/thumbnail/";

function VideoItem(props) {
  console.log(props);
  let image_url = DEFALUT_URL + props.id;

  return (
    <div className={classes.galleryItem}>
      <div className={classes.image}>
        <img src={image_url} alt={props.title} />
      </div>
      <div className={classes.content}>{props.title}</div>
    </div>
  );
}

export default VideoItem;
