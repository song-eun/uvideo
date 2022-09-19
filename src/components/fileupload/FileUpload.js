import { useState } from "react";
import classes from "./FileUpload.module.css";
import VideoDetailForm from "./VideoDetailForm";

// 허용 가능한 확장자 목록
const ALLOW_FILE_EXTENSION = "mp4,mpg,avi,wmv,mov";
let uuid = "";

function FileUpload(props) {
  const [file, setFile] = useState("");
  const [isUploaded, setUploaded] = useState(false);

  function fileUploadValidHandler(event) {
    console.log(event);
    let file = event.target.files[0];

    if (!fileExtensionValid(file)) {
      alert(`업로드 가능한 확장자가 아닙니다. [가능한 확장자 : ${ALLOW_FILE_EXTENSION}]`);
      return;
    }

    setFile(file);
  }

  const fileUploadHandler = async () => {
    if (file !== undefined) {
      console.log(file);
      try {
        var formData = new FormData();
        formData.append("file", file);
        fetch("/api/video/upload", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            console.log(response);
            return response.json();

          })
          .then((data) => {
            setUploaded(true);
            uuid = data.id;
            console.log(data);
          });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className={classes.modal}>
      {!isUploaded && <input type="file" onChange={fileUploadValidHandler} />}
      <br />
      <br />
      <br />
      {!isUploaded && <button onClick={fileUploadHandler}>파일 업로드</button>}
      {isUploaded && <VideoDetailForm value={uuid}></VideoDetailForm>}
    </div>
  );
}

const fileExtensionValid = (name) => {
  const extension = removeFileName(name);

  if (!(ALLOW_FILE_EXTENSION.indexOf(extension) > -1) || extension === "") {
    return false;
  }

  return true;
};

const removeFileName = (originalFileName) => {
  console.log(originalFileName.name);
  const lastIndex = originalFileName.name.lastIndexOf(".");

  if (lastIndex < 0) {
    return "";
  }

  return originalFileName.name.substring(lastIndex + 1).toLowerCase();
};

export default FileUpload;
