import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import PropTypes from "prop-types";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { useEffect } from "react";

import { EditIcon, AttachmentIcon, DescriptionIcon } from "../../Components/Icons";
import { useListBoardContext } from "../../Pages/ListBoard/ListBoardContext";
import { useNavigate } from "react-router-dom";

function ItemList({ id, dataList, dataCard, isFollowing = false, isArchived = false }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: id,
    data: { ...dataCard, type: "card" },
  });

  let { handleShowBoardCard, handleShowBoardEdit, boardId, idWorkSpace } = useListBoardContext();
  const navigate = useNavigate();
  const handleGetDataCardDetail = async (dataList, dataCard) => {
    try {
      handleShowBoardCard(dataList, dataCard);
    } catch (err) {
      console.error("Error fetching data card detail: ", err);
      navigate(`/workspace/${idWorkSpace}/board/${boardId}`);
    }
  };

  useEffect(() => {
    if (!dataCard) {
      navigate(`/workspace/${idWorkSpace}/board/${boardId}`);
    }
  }, [dataCard, idWorkSpace, boardId, navigate]);

  const itemStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    display: "flex",
    borderRadius: 5,
    userSelect: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      style={itemStyle}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="relative group bg-white rounded-[8px] my-2 shadow-md hover:ring-1 hover:ring-blue-500 cursor-pointer"
    >
      <div
        onClick={() => handleGetDataCardDetail(dataList, dataCard)}
        className="flex flex-col justify-center min-h-[40px] w-full"
      >
        {dataCard?.coverUrl && (
          <div
            style={{
              backgroundImage: dataCard?.coverUrl.startsWith("http") ? `url(${dataCard?.coverUrl})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            className={`w-full min-h-[80px] rounded-t-[6px] ${dataCard?.coverUrl.startsWith("bg-") ? dataCard?.coverUrl : ""}`}
          />
        )}
        <div className="flex flex-col mx-[12px]">
          <div className="flex items-center flex-wrap mt-2">
            {dataCard?.tagCards?.length > 0 &&
              dataCard?.tagCards.map((tagCard, index) =>
                tagCard?.tag?.color ? (
                  <div
                    key={index}
                    className={`hover:opacity-90 ${tagCard.tag.color} mr-1 mb-1 h-[8px] w-[40px] rounded-[4px] transition-all duration-50`}
                  />
                ) : null,
              )}
          </div>
          <div className="text-[14px] font-[400] text-black-500 py-[4px] whitespace-normal">{dataCard.title}</div>
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
              {dataCard?.description && (
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
              {dataCard?.comments?.length > 0 && (
                <Tippy
                  content={<span className="text-[12px] max-w-[150px]">Comment</span>}
                  arrow={false}
                  placement="bottom"
                >
                  <div className="flex items-center ">
                    <SmsOutlinedIcon className={"p-[4px] ml-[2px]"} />
                    <div className="text-[12px] font-[400] text-black-500 py-[4px]">{dataCard?.comments?.length}</div>
                  </div>
                </Tippy>
              )}
              {dataCard?.files?.length > 0 && (
                <Tippy
                  content={<span className="text-[12px] max-w-[150px]">Attachments</span>}
                  arrow={false}
                  placement="bottom"
                >
                  <div className="flex items-center ">
                    <AttachmentIcon className={"p-[4px] ml-[2px]"} />
                    <div className="text-[12px] font-[400] text-black-500 py-[4px]">{dataCard?.files?.length}</div>
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
            {dataCard?.members?.length > 0 &&
              dataCard?.members?.map((member, index) => (
                <div key={index} className="flex items-center flex-wrap pb-2 ml-auto">
                  <div className="flex items-center justify-center rounded-[50%] w-[24px] h-[24px] px-3 mr-[2px] font-medium text-white text-[10px] bg-gradient-to-b from-green-400 to-blue-500">
                    PM
                  </div>
                </div>
              ))}
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
