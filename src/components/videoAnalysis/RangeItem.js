// import { useEffect, useRef } from "react";
import classes from "./RangeItem.module.css";
function RangeItem(props) {
  return (
    <li style={{ background: "rgb(0, 103, 184)", width: `${props.percent}%`, left: `${props.left}%` }} className={classes.listItem}></li>
  );
}

export default RangeItem;
