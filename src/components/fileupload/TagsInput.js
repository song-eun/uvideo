import { useState } from "react";
import classes from "./TagInput.module.css";

function TagsInput(props) {
  const [tags, setTags] = useState([]);

  function handleKeyDown(e) {
    if (e.key !== "Enter") return;
    const value = e.target.value;
    if (!value.trim()) return;
    setTags([...tags, value]);
    e.target.value = "";
  }

  function removeTag(index) {
    setTags(tags.filter((el, i) => i !== index));
  }

  props.setTagList(tags.toString());

  return (
    <div>
      <div className={classes.tagsInputContainer}>
        <input onKeyDown={handleKeyDown} type="text" className={classes.tagsInput} placeholder="Type somthing" />
      </div>
      {tags.map((tag, index) => (
        <div className={classes.tagItem} key={index}>
          <span className={classes.text}>{tag}</span>
          <span className={classes.close} onClick={() => removeTag(index)}>
            &times;
          </span>
        </div>
      ))}
    </div>
  );
}

export default TagsInput;
