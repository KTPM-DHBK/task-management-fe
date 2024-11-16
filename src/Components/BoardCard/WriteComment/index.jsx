import React, { useState } from "react";
import { Avatar, Button, TextField } from "@mui/material";
import { useStorage } from "../../../Contexts";
import { useGetUserProfile } from "../../../Hooks";
import { Editor } from "@tinymce/tinymce-react";
import { writeInit } from "./constants/Write.constant";

const editorKey = process.env.REACT_APP_EDITOR_KEY;

const WriteComment = ({ content, setContent, loading, handlePostComment }) => {
  const { userData, isLoggedIn } = useStorage();
  const { userProfile } = useGetUserProfile(isLoggedIn);
  const [isFocused, setIsFocused] = useState(false);

  const handleCloseComment = () => {
    setIsFocused(false);
    setContent("");
    // if(!content) {
    //   setIsFocused(false);
    //   setContent("");
    // } else {
    //   setIsFocused(false);
    // }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleEditorChange = (content) => {
    setContent(content);
  };


  return (
    <div>
      <div className="flex justify-between mr-2">
        {userData?.avatarUrl ? (
          <Avatar
            sx={{ width: "30px", height: "30px" }}
            alt={userData?.name}
            src={userData?.avatarUrl}
          />
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
                  apiKey={editorKey}
                  value={content}
                  init={writeInit}
                  onEditorChange={handleEditorChange}
                  onFocus={handleFocus}
                />
              ) : (
                <TextField
                  fullWidth
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
              <div className="flex items-center justify-between">
                <Button
                  onClick={handlePostComment}
                  variant="contained"
                  color="primary"
                  disabled={!content}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteComment;