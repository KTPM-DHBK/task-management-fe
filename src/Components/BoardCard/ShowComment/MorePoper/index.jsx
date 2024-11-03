import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const MorePoper = ({ handleCloseMore, handleDeleteFile }) => {
  return (
    <div className="absolute w-[200px] bg-white rounded-[8px] px-2 py-2 font-medium text-[12px] z-50 shadow-[0_3px_10px_rgba(0,0,0,0.3)]">
      <CloseIcon
        onClick={handleCloseMore}
        className="cursor-pointer flex float-end right-3 p-1 top-3 rounded-[4px] hover:bg-gray-100"
      />
      <div className="p-3">
        <button onClick={handleDeleteFile} className="w-full p-2 text-left text-red-600 rounded-md hover:bg-gray-200 my-1rounded-sm">
          Delete
        </button>
      </div>
    </div>
  );
};

export default MorePoper;
