import React, { useState } from "react";
import { Avatar, Button, TextField } from "@mui/material";
import { useStorage } from "../../../Contexts";
import { useGetUserProfile } from "../../../Hooks";
import { Editor } from "@tinymce/tinymce-react";

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
              <div className="flex items-center justify-between">
                <Button onClick={handlePostComment} variant="contained" color="primary" disabled={!content}>
                  {loading ? "Saving..." : "Save"}
                </Button>
                <div className="ml-4"></div>
                <Button onClick={handleCloseComment} className="text-white bg-blue-500 hover:bg-blue-500 hover:text-white">Discard Change</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteComment;