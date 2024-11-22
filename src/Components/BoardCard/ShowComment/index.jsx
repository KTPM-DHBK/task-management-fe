import React, { useEffect, useState } from "react";
import { useStorage } from "../../../Contexts";
import { Avatar, Button } from "@mui/material";
import "react-medium-image-zoom/dist/styles.css";
import { updateComment } from "../../../Services/API/ApiComment";
import { toast } from "react-toastify";
import { useForm, FormProvider } from "react-hook-form";
import { PreviewImageModal } from "../../Modals/PreviewImageModal";
import { useListBoardContext } from "../../../Pages/ListBoard/ListBoardContext";
import { formatDate } from "../WriteComment/helpers/formatDate";
import { useGetCardById } from "../../../Hooks";
import { TextEditor } from "../../TextEditor/TextEditor";
import { useParams } from "react-router-dom";
import Loading from "../../Loading";

export const BoardComments = ({ item, handleDeleteComment }) => {
  const { idBoard } = useParams();
  const { setPostUploadedFiles } = useListBoardContext();
  const [loading, setLoading] = useState(false);
  const { userData } = useStorage();

  const [isFocused, setIsFocused] = useState(false);
  const [openImagePreview, setOpenImagePreview] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const cardId = localStorage.getItem("cardId");
  const { data: dataCard, isLoading } = useGetCardById(cardId);

  const method = useForm();
  const { setValue, watch, handleSubmit } = method;

  const handleImageClick = (url) => {
    setValue("selectedImgUrl", url);
    setOpenImagePreview(true);
  };

  const handleUpdateComment = async (data) => {
    const { content } = data;
    setLoading(true);

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const images = doc.querySelectorAll("img");
    const imageUrls = Array.from(images).map((img) => img.src);

    const params = {
      content: content,
      files: imageUrls,
      cardId: dataCard.id
    };

    const loadingToastId = toast.loading();

    try {
      const response = await updateComment(idBoard, item.id, params);

      const newComment = response.data;
      setPostUploadedFiles((prev) => [...prev, ...newComment.files]);
    } catch (err) {
      toast.error("Cannot create comment");
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
    setValue("content", item.content);
  };

  const handleCloseComment = () => {
    setIsFocused(false);
    setCanEdit(false);
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
    // eslint-disable-next-line
  }, [isFocused]);

  return (
    <FormProvider {...method}>
      {isFocused && canEdit ? (
        <form onSubmit={handleSubmit(handleUpdateComment)}>
          <TextEditor
            value={watch("content")}
            onChange={(value) => {
              setValue("content", value);
            }}
            loading={loading}
            setLoading={setLoading}
            placeholder="Write your message..."
          />
          <div className="flex items-center justify-between mt-2">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              sx={{ textTransform: "none" }}
              disabled={!watch("content") || loading}
            >
              Save
            </Button>
            <div className="ml-4"></div>
            <Button
              onClick={handleCloseComment}
              size="small"
              sx={{ textTransform: "none" }}
              className="text-white bg-blue-500 hover:bg-blue-500 hover:text-white px-1"
            >
              Discard Change
            </Button>
          </div>
        </form>
      ) : (
        <div
          className="flex p-2 my-2 space-x-3 rounded-md bg-gray-50"
          key={item.id}
        >
          <Avatar
            sx={{ width: "30px", height: "30px" }}
            src={userData?.avatarUrl}
          >
            {userData?.name[0] || " "}
          </Avatar>

          {/* Comment infomation */}
          <div className="w-full">
            <div className="flex items-center w-full">
              <span className="mr-4 text-[14px] font-medium">
                {userData.name}
              </span>
              <p className="text-[14px] font-normal text-gray-500">
                Created {formatDate(item.createdAt)}
              </p>
            </div>

            {/* Comment content */}
            <div
              dangerouslySetInnerHTML={{ __html: item.content }}
              className="p-3 my-2 w-full  bg-white border border-gray-300 rounded-lg"
            />

            {/* Actions */}
            <div className="flex mt-2 space-x-4 text-sm text-gray-500">
              <button onClick={handleEditClick} className="hover:underline">
                Edit
              </button>
              <span>•</span>
              <button
                onClick={() => handleDeleteComment(item.id)}
                className="hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoading ||
        !userData ||
        (loading && <Loading className="bg-white bg-opacity-10 z-1" />)}
      {
        <PreviewImageModal
          open={openImagePreview}
          handleCloseImageClick={handleCloseImageClick}
        />
      }
    </FormProvider>
  );
};
