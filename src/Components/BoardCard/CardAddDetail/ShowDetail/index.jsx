import React, { useEffect, useState } from "react";
import { Box, Modal } from "@mui/material";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
// import { useStorage } from "../../../../Contexts";

const ShowDetail = ({
  item,
  handleDeleteComment,
  handleUpdateComment,

}) => {
  // const { userData } = useStorage();
  //eslint-disable-next-line
  const [isFocusedEditor, setIsFocusedEditor] = useState(false);
  const [openImg, setOpenImg] = useState(false);
  const [selectedImgUrl, setSelectedImgUrl] = useState("");

  const handleImageClick = (url) => {
    setSelectedImgUrl(url);
    setOpenImg(true);
  };

  const handleCloseImageClick = () => {
    setOpenImg(false);
    setSelectedImgUrl("");
  };

  useEffect(() => {
    const handleEditorClick = (e) => {
      if (e.target.tagName === "IMG") {
        handleImageClick(e.target.src);
      }
    };

    const editorArea = document.querySelector(".tox-edit-area");

    if (isFocusedEditor && editorArea) {
      editorArea.addEventListener("click", handleEditorClick);
    }

    return () => {
      if (isFocusedEditor && editorArea) {
        editorArea.removeEventListener("click", handleEditorClick);
      }
    };
  }, [isFocusedEditor]);

  return (
    <>
      {/* {isLoadingWorkspace && <Loading />} */}
      <div>
        <div key={item.id}>
          <div className="flex p-2 my-2 space-x-3 rounded-md bg-gray-50">
            {/* Avatar */}
            {/* {userData?.avatarUrl ? (
              <div>
                <Avatar sx={{ width: "30px", height: "30px" }} alt={userData?.name} src={userData?.avatarUrl} />
              </div>
            ) : (
              <div className="flex items-center justify-center bg-orange-400 rounded-full w-9 h-9">
                {userData?.name[0] || " "}
              </div>
            )} */}

            {/* Comment infomation */}
            <div className="">
              <div className="flex items-center">
                {/* <span className="mr-4 text-[14px] font-medium">{userData.name}</span> */}
                {/* <p className="text-[14px] font-normal text-gray-500">Created {formatDate(item.createdAt)}</p> */}
              </div>

              {/* Comment conttent */}
              <div
                dangerouslySetInnerHTML={{ __html: item.content }}
                className="p-2 my-2 text-[16px] w-[420px] text-gray-800 bg-white border border-gray-300 rounded-lg"
              ></div>

              {/* Actions */}
              <div className="flex mt-2 space-x-4 text-sm text-gray-500">
                <button onClick={() => handleUpdateComment(item.id)} className="hover:underline">
                  Edit
                </button>
                <span>•</span>
                <button onClick={() => handleDeleteComment(item.id)} className="hover:underline">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        <Modal open={openImg} onClose={handleCloseImageClick}>
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <div className="z-50 w-[80%] h-[80%] text-center bg-black bg-opacity-50 overflow-y-auto">
              <Zoom>
                <img
                  src={selectedImgUrl}
                  alt="attachment"
                  className="rounded-[4px] p-4 cursor-pointer object-cover w-full h-full"
                />
              </Zoom>
            </div>
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center mt-3 text-center">
                <Link
                  className="p-2 mr-3 rounded-md cursor-pointer hover:bg-gray-800"
                  to={selectedImgUrl}
                  target="_blank"
                >
                  <ArrowOutwardIcon sx={{ cursor: "pointer", width: "18px", height: "18px", color: "white" }} />
                  <span className="text-[16px] text-white ml-2">Open in new tab</span>
                </Link>
                <button
                  onClick={handleCloseImageClick}
                  className="flex items-center p-2 text-white rounded-md hover:bg-gray-800"
                >
                  <CloseIcon sx={{ color: "white", fontSize: "16px", cursor: "pointer" }} />
                  <span className="text-[16px] text-white ml-2">Close</span>
                </button>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default ShowDetail;
