import React from "react";

const UpdateImageProfile = ({handleChooseAvatar}) => {
  return (
    <div className="absolute z-50 w-40 p-2 bg-white rounded-sm shadow-lg">
      <input type="file" id="fileInput" multiple className="hidden" onChange={handleChooseAvatar} />
      <label
        htmlFor="fileInput"
        className="block w-full p-2 text-center bg-gray-200 rounded-sm cursor-pointer hover:bg-gray-300"
      >
        Add profile photo
      </label>
    </div>
  );
};

export default UpdateImageProfile;
