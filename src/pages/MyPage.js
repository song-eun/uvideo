import { useContext, useState } from "react";

import Card from "../components/ui/Card";
// import Modal from "../components/ui/Modal";
import Backdrop from "../components/ui/Backdrop";
import AuthContext from "../store/auth-context";
import FileUpload from "../components/fileupload/FileUpload";
import MyVideos from "./MyVideos";
import { FaPlus } from "react-icons/fa";

function MyPage(props) {
  const authCtx = useContext(AuthContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function deleteHandler() {
    setModalIsOpen(true);
  }

  function closeModalHandler() {
    setModalIsOpen(false);
  }

  return (
    <Card>
      {/* <h2>{props.text}</h2> */}
      <h2>{authCtx.username}</h2>
      <div className="actions">
        <button className="btn" onClick={deleteHandler}>
          <FaPlus /> {/* + 아이콘 */}
        </button>
      </div>
      <MyVideos />
      {modalIsOpen && <FileUpload onCancel={closeModalHandler} onConfirm={closeModalHandler} />}
      {modalIsOpen && <Backdrop onCancel={closeModalHandler} />}
    </Card>
  );
}

export default MyPage;
