import React from "react";
import { useStorage } from "../../../Contexts";
import { Avatar } from "@mui/material";


const ShowComment = ({item, formatDate, handleDeleteComment, handleUpdateComment}) => {
  const { userData } = useStorage();
  //eslint-disable-next-line
  const { setIsLoggedIn, isLoggedIn } = useStorage();

  return (
    <>
      {/* {isLoadingWorkspace && <Loading />} */}
      <div key={item.id}>
        <div className="flex p-2 my-2 space-x-3 bg-gray-100 rounded-md">
          {/* Avatar */}
          {userData?.avatarUrl ? (
            <Avatar sx={{ width: "30px", height: "30px" }} alt={userData?.name} src={userData?.avatarUrl} />
          ) : (
            <div className="flex items-center justify-center bg-orange-400 rounded-full w-9 h-9">
              {userData?.name[0] || " "}
            </div>
          )}

          {/* Comment Content */}
          <div className="">
            <p className="text-[12px] font-normal text-gray-500">Created {formatDate(item.createdAt)}</p>

            {/* Comment Text */}
            <div dangerouslySetInnerHTML={{__html:item.content}} className="p-2 my-2 text-[16px] w-[420px] text-gray-800 bg-white border border-gray-300 rounded-lg"></div>

            {/* Actions */}
            <div className="flex mt-2 space-x-4 text-sm text-gray-500">
              <button onClick={() => handleUpdateComment(item.id)} className="hover:underline">Edit</button>
              <span>•</span>
              <button onClick={() => handleDeleteComment(item.id)} className="hover:underline">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowComment;
