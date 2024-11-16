import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Close as CloseIcon } from "@mui/icons-material";

import { ButtonBoardCard } from "../../ButtonBoardCard";
import { getAllTagByIdBoard } from "../../../Services/API/ApiBoard/apiBoard";
import { useListBoardContext } from "../../../Pages/ListBoard/ListBoardContext";
import { apiUploadMultiFile } from "../../../Services/API/ApiUpload/apiUpload";

function BackgroundPhoto({ position, handleCloseShowMenuBtnCard, background, chooseBackground }) {
  const { dataBoard } = useListBoardContext();
  const [listColorLabel, setListColorLabel] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [allUrls, setAllUrls] = useState([]);

  useEffect(() => {
    const getAllLabelOfBoard = async () => {
      try {
        const res = await getAllTagByIdBoard(dataBoard?.id);
        setListColorLabel(res?.data.data || []);
      } catch (err) {
        console.error("Error all label data: ", err);
      }
    };
    getAllLabelOfBoard();
  }, [dataBoard]);

  const handleChooseColor = (item) => {
    chooseBackground(item);
  };

  const handleRemoveColor = () => {
    chooseBackground("");
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files.length === 0) return;
    toast.info("Uploading...");
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    try {
      const response = await apiUploadMultiFile(formData);
      toast.success("Upload successful!");
      const totalFileUpload = [...response.data, ...uploadedFiles];
      setUploadedFiles(totalFileUpload);
      // Lấy tất cả các URL từ totalFileUpload và lưu trữ chúng trong trạng thái allUrls
      const urls = totalFileUpload.map((file) => file.url);
      setAllUrls(urls);
      chooseBackground(urls[0]);
      return response.data;
    } catch (error) {
      toast.error("Upload failed!");
    }
  };
  return (
    <div
      style={{ top: position.top - 300, left: position.left }}
      className="absolute w-[250px] bg-white rounded-[8px] py-2 font-medium text-[12px] z-50 shadow-[0_3px_10px_rgba(0,0,0,0.3)]"
    >
      <div className="p-2 mx-8 text-center">Cover photo</div>
      <div className="mx-2">
        <div className="py-2 bg-white">Size</div>
        <div className="flex items-center justify-center">
          <div className="w-[200px] cursor-pointer flex items-center justify-center flex-col border border-black-1 rounded-[4px]">
            <div
              style={{
                backgroundImage: background && background.startsWith("http") ? `url(${background})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: background && background.startsWith("#") ? background : "#f3f4f6",
              }}
              className={`w-full h-[54px] p-2 rounded-t-[4px]`}
            />

            <div className="w-[90%]">
              <div className={`bg-gray-200  w-[90%] h-[6px] my-2 rounded-[4px]`} />
              <div className={`bg-gray-200  w-[70%] h-[6px] my-2 rounded-[4px]`} />
              <div className="flex items-center justify-between w-full pb-2">
                <div className="flex w-full">
                  <div className={`bg-gray-200  w-[10%] mr-1 h-[10px] rounded-[4px]`} />
                  <div className={`bg-gray-200  w-[10%] mr-1 h-[10px] rounded-[4px]`} />
                </div>
                <div className={`bg-gray-200  w-[10%] h-[16px] rounded-[50%]`} />
              </div>
            </div>
          </div>
        </div>
        {background && (
          <ButtonBoardCard
            onHandleEvent={handleRemoveColor}
            nameBtn="Delete cover photo"
            isActive={true}
            className={"justify-center bg-gray-100 hover:bg-gray-300 my-2"}
          />
        )}
        <div className="mt-2">
          <div className="py-2 bg-white">Color</div>
          <ul className="flex flex-wrap items-center justify-center">
            {Array.isArray(listColorLabel)
              ? listColorLabel?.map((item, index) => (
                  <li
                    onClick={() => handleChooseColor(item.color)}
                    key={index}
                    style={{
                      backgroundColor: item.color,
                      border: background === item.color ? "3px solid #60a5fa" : "none",
                      boxShadow: background === item.color ? "0 3px 10px rgba(0,0,0,0.3)" : "none",
                    }}
                    className={`w-12 h-8 cursor-pointer rounded-[4px] mr-1 mb-1`}
                  ></li>
                ))
              : null}
          </ul>
        </div>
        <div className="py-2 bg-white">Attachments</div>
        <div className="flex items-center mb-4">
          {allUrls.map((url, index) => (
            <div
              key={index}
              className={`${background === url ? "border-[3px] border-blue-400 shadow-[0_3px_10px_rgba(0,0,0,0.3)]" : ""} w-[80px] h-[50px] bg-gray-500 overflow-hidden rounded-[8px] mr-1`}
            >
              <img
                onClick={() => handleChooseColor(url)}
                src={url}
                alt={`Uploaded ${index + 1}`}
                className={`block w-full h-full cursor-pointer `}
                style={{ objectFit: "scale-down" }}
              />
            </div>
          ))}
        </div>
        <button className="w-full px-2 rounded-sm">
          <input type="file" id="fileInput" multiple className="hidden" onChange={handleFileChange} />
          <label
            htmlFor="fileInput"
            className="block w-full p-2 text-center bg-gray-200 rounded-sm cursor-pointer hover:bg-gray-300"
          >
            Upload cover photo
          </label>
        </button>
      </div>
      <CloseIcon
        onClick={handleCloseShowMenuBtnCard}
        className="cursor-pointer absolute right-3 top-3 p-1 rounded-[4px] hover:bg-gray-100 "
      />
    </div>
  );
}

export default React.memo(BackgroundPhoto);
