import React from 'react';
import CloseIcon from "@mui/icons-material/Close";


const UploadPoper = ({ handleCloseAttach, handleFileChange }) => {
  return (
    <div
      // style={{ top: position.top - 100, left: position.left - 320}}
      className="absolute w-[260px] bg-white rounded-[8px] px-2 pt-2 pb-6 font-medium text-[12px] z-50 shadow-[0_3px_10px_rgba(0,0,0,0.3)]"
    >
      <div className="p-2 mx-8 mb-4 text-center">Attached</div>
      <div className="mx-2 my-2">
        <p className="mb-2 text-sm text-textColor">Attach a file from your computer</p>
        <p className="text-[12px] text-gray-500">You can also drag and drop files to upload them.</p>
      </div>
      <button className="w-full px-2 rounded-sm">
        <input type="file" id="fileInput" multiple className="hidden" onChange={handleFileChange} />
        <label
          htmlFor="fileInput"
          className="block w-full p-2 text-center bg-gray-200 rounded-sm cursor-pointer hover:bg-gray-300"
        >
          Choose a file
        </label>
      </button>
      <CloseIcon
        onClick={handleCloseAttach}
        className="cursor-pointer absolute right-3 top-3 p-1 rounded-[4px] hover:bg-gray-100"
      />
    </div>
  )
}

export default UploadPoper