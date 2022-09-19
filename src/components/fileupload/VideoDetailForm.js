import { useState, useRef } from "react";

import Card from "../ui/Card";
import TagInput from "./TagsInput";
import classes from "./VideoDetailForm.module.css";

function VideoDetailForm(props) {

  const fileId = props.value;
  const titleInputRef = useRef();
  const [selectedState, setSelectedState] = useState("");
  const [tagList, setTagList] = useState(null);

  const handleChange = (e) => {
    console.log(e.target);
    setSelectedState(e.target.id);
  };

  function submitHandler(event) {
    event.preventDefault();
    console.log(event);
    console.log(selectedState);

    const enteredTitle = titleInputRef.current.value;
    let enteredSetting = false;

    if (selectedState === "public-state") {
      enteredSetting = true;
    }

    console.log(fileId);
    console.log(enteredTitle);
    console.log(enteredSetting);
    console.log(tagList);

    fetch("/api/video/add-details", {
      method: "PUT",
      body: JSON.stringify({
        fileId: fileId,
        fileName: enteredTitle,
        tag: tagList,
        privacyStatus: enteredSetting,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .then(() => {
        window.location.reload();
      });
  }
  const onCheckEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <Card>
      <form className={classes.form} onSubmit={submitHandler} onKeyPress={onCheckEnter}>
        <div className={classes.control}>
          <label htmlFor="title">제목</label>
          <input type="text" required id="title" ref={titleInputRef} />
        </div>

        <div className={classes.control}>
          <input id="public-state" name="platform" value="public-state" type="radio" onClick={handleChange} /> public
          <input id="private-state" name="platform" value="private-state" type="radio" onClick={handleChange} /> private
        </div>
        <TagInput setTagList={setTagList} />
        <div className={classes.actions}>
          <button>업로드</button>
        </div>
      </form>
    </Card>
  );
}

export default VideoDetailForm;
