import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import PropTypes from "prop-types";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import InventoryIcon from "@mui/icons-material/Inventory";

import { EditIcon, AttachmentIcon, DescriptionIcon } from "../../Components/Icons";
import { useListBoardContext } from "../../Pages/ListBoard/ListBoardContext";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

function ItemList({
  id,
  dataList,
  dataCard,
  imageSrc,
  isFollowing = false,
  isDescriptionIcon = true,
  Attachments = [],
  Comments = [],
  Users = [],
  isArchived = false,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });

  const itemStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
    alignItems: "center",
    paddingLeft: 5,
    borderRadius: 5,
    userSelect: "none",
    cursor: "grab",
    boxSizing: "border-box",
    zIndex: 999,
  };

  let { handleShowBoardCard, handleShowBoardEdit } = useListBoardContext();
  return (
    <div
      style={itemStyle}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="relative group bg-white rounded-[8px] my-2 shadow-md hover:ring-1 hover:ring-blue-500 cursor-pointer"
    >
      <div
        onClick={() => handleShowBoardCard(dataList, dataCard)}
        className="flex flex-col justify-center min-h-[40px]"
      >
        {imageSrc === "" && (
          <div className="w-full min-h-[20px]">
            <img src={imageSrc} alt="" className="w-full h-full object-cover rounded-tl-[8px] rounded-tr-[8px]" />
          </div>
        )}
        <div className="flex flex-col mx-[12px]">
          <div className="flex items-center flex-wrap mt-2">
            <div
              className={`hover:opacity-90 bg-blue-500 mr-1 mb-1 h-[8px] w-[40px] rounded-[4px] transition-all duration-50`}
            />
          </div>
          <div className="text-[16px] font-[400] text-black-500 py-[4px] whitespace-normal">{dataCard.title}</div>
          <div className="flex items-center justify-between w-full flex-wrap">
            <div className="flex items-center flex-wrap pb-2">
              {isFollowing && (
                <Tippy
                  content={<span className="text-[12px] max-w-[150px]">You are following this tag</span>}
                  arrow={false}
                  placement="bottom"
                >
                  <div className="">
                    <RemoveRedEyeOutlinedIcon className={"p-[4px] "} />
                  </div>
                </Tippy>
              )}
              {isDescriptionIcon && (
                <Tippy
                  content={<span className="text-[12px] max-w-[150px]">The card already has a description</span>}
                  arrow={false}
                  placement="bottom"
                >
                  <div className="">
                    <DescriptionIcon className={"p-[4px] "} />
                  </div>
                </Tippy>
              )}
              {Comments.length > 0 && (
                <Tippy
                  content={<span className="text-[12px] max-w-[150px]">Comment</span>}
                  arrow={false}
                  placement="bottom"
                >
                  <div className="flex items-center ">
                    <SmsOutlinedIcon className={"p-[4px] ml-[2px]"} />
                    <div className="text-[12px] font-[400] text-black-500 py-[4px]">{Attachments.length}</div>
                  </div>
                </Tippy>
              )}
              {Attachments.length > 0 && (
                <Tippy
                  content={<span className="text-[12px] max-w-[150px]">Attachments</span>}
                  arrow={false}
                  placement="bottom"
                >
                  <div className="flex items-center ">
                    <AttachmentIcon className={"p-[4px] ml-[2px]"} />
                    <div className="text-[12px] font-[400] text-black-500 py-[4px]">{Attachments.length}</div>
                  </div>
                </Tippy>
              )}
              {isArchived && (
                <Tippy
                  content={<span className="text-[12px] max-w-[150px]">Attachments</span>}
                  arrow={false}
                  placement="bottom"
                >
                  <div className="flex items-center ">
                    <InventoryIcon className={"p-[4px] ml-[2px]"} />
                    <div className="text-[12px] font-[400] text-black-500 py-[4px]">Archived</div>
                  </div>
                </Tippy>
              )}
            </div>
            <div className="flex items-center flex-wrap pb-2 ml-auto">
              <div className="flex items-center justify-center rounded-[50%] w-[24px] h-[24px] px-3 mr-[2px] font-medium text-white text-[10px] bg-gradient-to-b from-green-400 to-blue-500">
                PM
              </div>
            </div>
          </div>
        </div>
      </div>
      {isArchived || (
        <Tippy content={<span className="text-[12px] max-w-[150px]">Edit card</span>} arrow={false} placement="bottom">
          <div
            onClick={(e) => handleShowBoardEdit(e, dataList, dataCard)}
            className="absolute right-1 top-1 rounded-[50%] p-2 hover:bg-gray-100 bg-white group-hover:opacity-100 opacity-0 transition-opacity duration-300"
          >
            <EditIcon width={16} height={16} />
          </div>
        </Tippy>
      )}
    </div>
  );
}

ItemList.propTypes = {
  isArchived: PropTypes.bool,
};
export default React.memo(ItemList);
