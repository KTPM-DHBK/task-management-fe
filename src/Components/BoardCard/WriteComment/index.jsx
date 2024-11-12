import React, { useState, useEffect } from "react";
import { Avatar, Button, TextField, Box, Modal } from "@mui/material";
import { useStorage } from "../../../Contexts";
import { useGetUserProfile } from "../../../Hooks";
import { Editor } from "@tinymce/tinymce-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

const WriteComment = ({ content, setContent, loading, handlePostComment }) => {
  const { userData, isLoggedIn } = useStorage();
  const { userProfile } = useGetUserProfile(isLoggedIn);
  const [isFocused, setIsFocused] = useState(false);
  const [openImg, setOpenImg] = useState(false);
  const [selectedImgUrl, setSelectedImgUrl] = useState("");

  const handleCloseComment = () => {
    setIsFocused(false);
    setContent("");
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleEditorChange = (content) => {
    setContent(content);
  };

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

    if (isFocused) {
      document.querySelector(".tox-edit-area").addEventListener("click", handleEditorClick);
    }

    return () => {
      if (isFocused) {
        document.querySelector(".tox-edit-area").removeEventListener("click", handleEditorClick);
      }
    };
  }, [isFocused]);

  return (
    <div>
      <div className="flex justify-between mr-2">
        {userData?.avatarUrl ? (
          <Avatar sx={{ width: "30px", height: "30px" }} alt={userData?.name} src={userData?.avatarUrl} />
        ) : (
          <div className="flex items-center justify-center bg-orange-400 rounded-full w-9 h-9">
            {userProfile?.name[0] || " "}
          </div>
        )}
        <div className="ml-4">
          <div className="border-gray-300 rounded-sm ">
            <div className="w-[428px] h-full">
              {isFocused ? (
                <Editor
                  apiKey="qibz0pdsl3j3pwij2g3sw1414jdo15snwf06ohs4j3rolood"
                  value={content}
                  init={{
                    images_upload_url: "https://api-task-management-production.up.railway.app/api/upload/file",
                    referrer_policy: "origin",
                    height: 280,
                    width: "100%",
                    menubar: false,
                    forced_root_block: "p",
                    statusbar: false,
                    branding: false,
                    plugins: ["advlist", "autolink", "lists", "link", "image"],
                    toolbar: "undo redo bold italic alignleft aligncenter alignright | link image media",
                  }}
                  onEditorChange={handleEditorChange}
                  onFocus={handleFocus}
                />
              ) : (
                <TextField
                  sx={{
                    width: "100%",
                  }}
                  id="outlined-basic"
                  size="medium"
                  label="Write a comment..."
                  variant="outlined"
                  onFocus={handleFocus}
                />
              )}
            </div>
          </div>

          <div className="flex items-center mt-2">
            {isFocused && (
              <div>
                <Button onClick={handlePostComment} variant="contained" color="primary" disabled={!content}>
                  {loading ? "Saving..." : "Save"}
                </Button>
                <Button onClick={handleCloseComment} className="ml-2">Discard Change</Button>
              </div>
            )}
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
              <Link className="p-2 mr-3 rounded-md cursor-pointer hover:bg-gray-800" to={selectedImgUrl} target="_blank">
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
  );
};

export default WriteComment;