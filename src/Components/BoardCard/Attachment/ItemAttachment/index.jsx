import React from "react";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MorePoper from "../../ShowComment/MorePoper";

const ItemAttachment = ({item, moreRef, handleCloseMore, openMore, handleOpenMore, formatDate, handleDeleteFile}) => {
  return (
    <div key={item.id} className="flex items-center justify-between my-3">
      <div className="flex items-center">
        <div className="w-[60px] h-[40px]">
          <img src={item.url} alt="attachment" className="rounded-[4px] cursor-pointer object-cover w-full h-full" />
        </div>
        <div className="ml-3">
          <p className="text-gray-700 text-[13px] truncate max-w-[240px] whitespace-nowrap">{item.name}</p>
          <p className="text-[12px] font-normal text-gray-500">Added {formatDate(item.createdAt)}</p>
        </div>
      </div>
      <div className="flex items-center">
        <ArrowOutwardIcon sx={{ cursor: "pointer", width: "14px", height: "14px" }} />
        <div className="more-poper" ref={moreRef}>
          <button onClick={() => handleOpenMore(item.id)} className="px-1 ml-3 py-[2px] rounded-sm bg-gray-300">
            <MoreHorizIcon />
          </button>
          {openMore === item.id && (
            <MorePoper handleOpenMore={handleOpenMore} handleCloseMore={handleCloseMore} handleDeleteFile={() => handleDeleteFile(item.id)}/>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemAttachment;
