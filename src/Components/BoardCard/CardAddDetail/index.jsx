import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { useGetCardById } from "../../../Hooks";
import { useListBoardContext } from "../../../Pages/ListBoard/ListBoardContext";
import { useParams } from "react-router-dom";

const CardAddDetail = ({ content, setContent, loading }) => {
  const { handlePostComment } = useListBoardContext();
  const [isFocused, setIsFocused] = useState(false);
  const cardId = localStorage.getItem("cardId");
  const { idBoard } = useParams();
  const { data: dataCard } = useGetCardById(idBoard, cardId);
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

  return (
    <>
      <div className="w-[468px] h-full border-gray-300 rounded-sm">
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
            label="Add detail..."
            variant="outlined"
            onFocus={handleFocus}
          />
        )}
      </div>

      <div className="flex items-center mt-2">
        {isFocused && (
          <div className="flex items-center justify-between">
            <Button onClick={() => handlePostComment(dataCard)} variant="contained" color="primary" disabled={!content}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <div className="ml-4"></div>
            <Button onClick={handleCloseComment} className="text-white bg-blue-500 hover:bg-blue-500 hover:text-white">
              Discard Change
            </Button>
          </div>
        )}
      </div>
      {/* {addDetailSucess ? (
            <>
            </>
          ) : (
            <>
              {listComment?.map((item) => (
                <ShowDetail
                  item={item}
                  key={item.id}
                />
              ))}
            </>
          )} */}
    </>
  );
};

export default CardAddDetail;
