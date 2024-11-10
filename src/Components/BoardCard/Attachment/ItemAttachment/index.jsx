import React, { useState } from "react";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MorePoperAttach from "../MorePoperAttach";
import { Link } from "react-router-dom";
import { Box, Modal } from "@mui/material";

const ItemAttachment = ({ item, moreRef, handleCloseMore, openMore, handleOpenMore, formatDate, handleDeleteFile }) => {
  const [openImg, setOpenImg] = useState(false);
  const handleImageClick = () => setOpenImg(true);
  const handleCloseImageClick = () => setOpenImg(false);
  return (
    <div key={item.id} className="flex items-center justify-between my-3">
      <div className="flex items-center">
        <div className="w-[60px] h-[40px]">
          <img
            onClick={handleImageClick}
            src={item.url}
            alt="attachment"
            className="rounded-[4px] cursor-pointer object-cover w-full h-full"
          />
        </div>
        <div className="ml-3">
          <p className="text-gray-700 text-[13px] truncate max-w-[240px] whitespace-nowrap">{item.name}</p>
          <p className="text-[12px] font-normal text-gray-500">Added {formatDate(item.createdAt)}</p>
        </div>
      </div>
      <div className="flex items-center">
        <Link className="cursor-pointer" to={item.url} target="_blank">
          <ArrowOutwardIcon sx={{ cursor: "pointer", width: "14px", height: "14px" }} />
        </Link>
        <div className="more-poper" ref={moreRef}>
          <button onClick={() => handleOpenMore(item.id)} className="px-1 ml-3 py-[2px] rounded-sm bg-gray-300">
            <MoreHorizIcon />
          </button>
          {openMore === item.id && (
            <MorePoperAttach
              handleOpenMore={handleOpenMore}
              handleCloseMore={handleCloseMore}
              handleDeleteFile={() => handleDeleteFile(item.id)}
            />
          )}
        </div>
      </div>
      <Modal open={openImg} onClose={handleCloseImageClick}>
        <Box>
          <div
            className="z-50 w-[80%] h-[80%] m-auto text-center bg-black bg-opacity-50 "
            onClick={handleCloseImageClick}
          >
            <img
              src={item.url}
              alt="attachment"
              className="rounded-[4px] p-4 cursor-pointer object-cover w-full h-full"
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ItemAttachment;
