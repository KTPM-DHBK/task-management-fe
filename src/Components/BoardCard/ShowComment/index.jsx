import React, { useEffect, useState } from "react";
import { useStorage } from "../../../Contexts";
import { Avatar, Button } from "@mui/material";
import "react-medium-image-zoom/dist/styles.css";
import { Editor } from "@tinymce/tinymce-react";
import { updateComment } from "../../../Services/API/ApiComment";
import { toast } from "react-toastify";
import { useForm, FormProvider } from "react-hook-form";
import { PreviewImageModal } from "../../Modals/PreviewImageModal";
import { editorInit } from "./constants/Editor.constant";
import { useListBoardContext } from "../../../Pages/ListBoard/ListBoardContext";
import { formatDate } from "../WriteComment/helpers/formatDate";

// const editorKey = process.env.REACT_APP_EDITOR_KEY;

const ShowComment = ({ item, handleDeleteComment }) => {
  const { dataCard, setLoading, setContent, setUpFileComment, setPostUploadedFiles, boardId, setDataCard, loading } =
    useListBoardContext();
  const { userData } = useStorage();
  //eslint-disable-next-line
  const [isFocused, setIsFocused] = useState(false);
  const [openImagePreview, setOpenImagePreview] = useState(false);
  const [editorContent, setEditorContent] = useState(item.content);
  const [canEdit, setCanEdit] = useState(false);
  const [newContent, setNewContent] = useState("");

  const method = useForm();
  const { setValue } = method;

  const handleImageClick = (url) => {
    setValue("selectedImgUrl", url);
    setOpenImagePreview(true);
  };

  const handleUpdateComment = async (boardId, cmdId, newContent) => {
    setLoading(true);

    const parser = new DOMParser();
    const doc = parser.parseFromString(newContent, "text/html");
    const images = doc.querySelectorAll("img");
    const imageUrls = Array.from(images).map((img) => img.src);

    const params = {
      content: newContent,
      files: imageUrls,
      cardId: dataCard.id,
    };

    const loadingToastId = toast.loading();

    try {
      const response = await updateComment(boardId, cmdId, params);

      setContent("");
      setUpFileComment([]);

      const newComment = response.data;

      setDataCard((prevDataCard) => ({
        ...prevDataCard,
        comments: prevDataCard.comments.map((comment) =>
          comment.id === cmdId ? response.data : comment
        ),
        files: [...prevDataCard.files, ...response.data.files],
      }));
      setPostUploadedFiles((prev) => [...prev, ...newComment.files]);

      toast.success("Edit successfully!");
    } catch (err) {
      toast.error("Cannot Edit comment");
      console.error("Comment error: ", err);
    } finally {
      toast.dismiss(loadingToastId);
      setLoading(false);
    }
  };

  const handleCloseImageClick = () => {
    setOpenImagePreview(false);
    setValue("selectedImgUrl", "");
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
    //eslint-disable-next-line
  }, [isFocused]);

  return (
    <>
      {isFocused && canEdit ? (
        <div className="flex">
          {userData?.avatarUrl ? (
            <Avatar sx={{ width: "30px", height: "30px" }} alt={userData?.name} src={userData?.avatarUrl} />
          ) : (
            <div className="flex items-center justify-center bg-orange-400 rounded-full w-9 h-9">
              {userData?.name[0] || " "}
            </div>
          )}
          <div className="w-full ml-4">
            <Editor
              apiKey="qibz0pdsl3j3pwij2g3sw1414jdo15snwf06ohs4j3rolood"
              value={editorContent}
              init={editorInit}
              onEditorChange={handleEditorChange}
              onFocus={handleFocus}
            />
            <div className="flex items-center justify-between mt-2">
              <Button
                onClick={() => handleUpdateComment(boardId, item.id, newContent)}
                variant="contained"
                color="primary"
                disabled={!newContent}
              >
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
          </div>
        </div>
      ) : (
        <div className="flex p-2 my-2 space-x-3 rounded-md bg-gray-50" key={item.id}>
          {userData?.avatarUrl ? (
            <Avatar sx={{ width: "30px", height: "30px" }} alt={userData?.name} src={userData?.avatarUrl} />
          ) : (
            <div className="flex items-center justify-center bg-orange-400 rounded-full w-9 h-9">
              {userData?.name[0] || " "}
            </div>
          )}

          {/* Comment infomation */}
          <div>
            <div className="flex items-center">
              <span className="mr-4 text-[14px] font-medium">{userData.name}</span>
              <p className="text-[14px] font-normal text-gray-500">Created {formatDate(item.createdAt)}</p>
            </div>

            {/* Comment content */}
            <div
              dangerouslySetInnerHTML={{ __html: item.content }}
              className="p-2 my-2 text-[16px] w-[420px] text-gray-800 bg-white border border-gray-300 rounded-lg break-words overflow-hidden text-ellipsis"
            />

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
      )}
      {
        <FormProvider {...method}>
          <PreviewImageModal open={openImagePreview} handleCloseImageClick={handleCloseImageClick} />
        </FormProvider>
      }
    </>
  );
};

export default ShowComment;
