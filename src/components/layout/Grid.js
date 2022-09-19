import classes from "./Grid.module.css";

function Grid(props) {
  return (
    <div className={classes.gridContainer}>
      <div className={classes.gallery}>{props.children}</div>
    </div>
  );
}

export default Grid;