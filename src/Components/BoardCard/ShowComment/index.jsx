import React, { useEffect, useState } from "react";
import { useStorage } from "../../../Contexts";
import { Avatar, Box, Button, Modal } from "@mui/material";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { updateComment } from "../../../Services/API/ApiComment";
import { toast } from "react-toastify";

const ShowComment = ({ item, setDataCard, dataCard, postUploadedFiles, content, boardId, setContent, setPostUploadedFiles, setUpFileComment, setLoading, formatDate, loading, handleDeleteComment, handlePostComment }) => {
  const { userData } = useStorage();
  //eslint-disable-next-line
  const [isFocused, setIsFocused] = useState(false);
  const [openImg, setOpenImg] = useState(false);
  const [selectedImgUrl, setSelectedImgUrl] = useState("");
  const [editorContent, setEditorContent] = useState(item.content);
  const [canEdit, setCanEdit] = useState(false);
  const [newContent, setNewContent] = useState("");

  const handleImageClick = (url) => {
    setSelectedImgUrl(url);
    setOpenImg(true);
  };

  const handleUpdateComment = async (boardId, cmdId, newContent) => {
    console.log('cmdId', item.id);
    console.log('content', newContent);
    const parser = new DOMParser();
    const doc = parser.parseFromString(newContent, "text/html");
    const images = doc.querySelectorAll("img");
    const imageUrls = Array.from(images).map((img) => img.src);
    console.log('imageUrls', imageUrls);
    const params = {
      content: newContent,
      files: imageUrls,
      cardId: dataCard.id,
    };
    console.log('params', params);
    setLoading(true);
    const loadingToastId = toast.loading("Saving...");
    try {
      const response = await updateComment(boardId, cmdId, params);
      toast.dismiss(loadingToastId);
      toast.success("Create comment successfully!");

      // Cập nhật lại nội dung và các file sau khi bình luận thành công
      setContent("");
      setUpFileComment([]);
      const newComment = response.data;
      console.log('newComment', newComment);

      // Thêm bình luận mới vào danh sách bình luận và files vào danh dataCard
      setDataCard((prevDataCard) => ({
        ...prevDataCard,
        comments: [...prevDataCard.comments, newComment],
        files: [...prevDataCard.files, ...newComment.files],
        // files: [...newComment.files],
        // files: [...postUploadedFiles, ...newComment.files],
      }));
      // Cập nhật danh sách file đã tải lên từ comment
      setPostUploadedFiles((prev) => [...prev, ...newComment.files]);
    } catch (err) {
      toast.dismiss(loadingToastId);
      toast.error("Cannot create comment");
      console.error("Lỗi khi đăng comment:", err);
    } finally {
      setLoading(false);
    }
  };



  const handleCloseImageClick = () => {
    setOpenImg(false);
    setSelectedImgUrl("");
  };

  const handleEditClick = () => {
    setIsFocused(true);
    setCanEdit(true);
    setEditorContent(item.content);
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
    setNewContent(content);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleCloseComment = () => {
    setIsFocused(false);
    setCanEdit(false);
    setNewContent("");
  };

  useEffect(() => {
    const handleEditorClick = (e) => {
      if (e.target.tagName === "IMG") {
        handleImageClick(e.target.src);
      }
    };

    const editorArea = document.querySelector(".tox-edit-area");

    if (isFocused && editorArea) {
      editorArea.addEventListener("click", handleEditorClick);
    }

    return () => {
      if (isFocused && editorArea) {
        editorArea.removeEventListener("click", handleEditorClick);
      }
    };
  }, [isFocused]);

  return (
    <>
      <div>
        {isFocused && canEdit ? (
          <>
            <Editor
              apiKey="qibz0pdsl3j3pwij2g3sw1414jdo15snwf06ohs4j3rolood"
              value={editorContent}
              init={{
                images_upload_url: "https://api-task-management-production.up.railway.app/api/upload/file",
                referrer_policy: "origin",
                height: 340,
                licenseKey: "gpl",
                width: "100%",
                menubar: false,
                forced_root_block: "p",
                newline_behavior: '',
                statusbar: false,
                branding: false,
                plugins: ["advlist", "autolink", "lists", "link", "image"],
                toolbar: "code fullscreen visualblocks | undo redo bold italic alignleft aligncenter alignright | link image media",
                content_style: `
                img {
                  max-width: 100%;
                  height: 80%;
                }
              `,
              }}
              onEditorChange={handleEditorChange}
              onFocus={handleFocus}
            />
            <div className="flex items-center mt-2">
              <div className="flex items-center justify-between">
                <Button onClick={() => handleUpdateComment(boardId, item.id,  newContent)} variant="contained" color="primary" disabled={!newContent}>
                  {loading ? "Saving..." : "Save"}
                </Button>
                <div className="ml-4"></div>
                <Button
                  onClick={handleCloseComment}
                  className="text-white bg-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  Discard Change
                </Button>
              </div>
              {/* {isFocused && (
              )} */}
            </div>
          </>
        ) : (
          <div key={item.id}>
            <div className="flex p-2 my-2 space-x-3 rounded-md bg-gray-50">
              {/* Avatar */}
              {userData?.avatarUrl ? (
                <div>
                  <Avatar sx={{ width: "30px", height: "30px" }} alt={userData?.name} src={userData?.avatarUrl} />
                </div>
              ) : (
                <div className="flex items-center justify-center bg-orange-400 rounded-full w-9 h-9">
                  {userData?.name[0] || " "}
                </div>
              )}

              {/* Comment infomation */}
              <div className="">
                <div className="flex items-center">
                  <span className="mr-4 text-[14px] font-medium">{userData.name}</span>
                  <p className="text-[14px] font-normal text-gray-500">Created {formatDate(item.createdAt)}</p>
                </div>

                {/* Comment content */}
                <div
                  dangerouslySetInnerHTML={{ __html: item.content }}
                  className="p-2 my-2 text-[16px] w-[420px] text-gray-800 bg-white border border-gray-300 rounded-lg break-words overflow-hidden text-ellipsis"
                ></div>

                {/* Actions */}
                <div className="flex mt-2 space-x-4 text-sm text-gray-500">
                  <button onClick={handleEditClick} className="hover:underline">
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
        )}
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

export default ShowComment;
