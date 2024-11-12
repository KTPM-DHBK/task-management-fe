import React, { useCallback, useState } from "react";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";

import { FilterIcon } from "../../Components/Icons";
import TippyDetail from "../TippyDetail";
import RightSidebar from "../../Components/RightSidebar";
import { useListBoardContext } from "../../Pages/ListBoard/ListBoardContext";
import { HiDotsVertical } from "react-icons/hi";
import GroupIcon from "@mui/icons-material/Group";
import GroupAvatars from "../GroupAvatars";

function HeaderBoard() {
  const { activeStar, handleActiveStar, dataBoard, membersBoard } = useListBoardContext();
  const [rightSidebar, setRightSidebar] = useState(false);

  const handleToggleRightSidebar = useCallback(() => {
    setRightSidebar(!rightSidebar);
  }, [rightSidebar]);

  return (
    <div className="relative flex items-center justify-between h-[32px] py-6 px-4 bg-gray-100">
      <div className="flex items-center">
        <div className="text-black p-2 font-bold text-[18px]">{dataBoard.title}</div>
        <TippyDetail title="Star or unstar this tables. Starred tables will appear at the top of the tables list.">
          <div
            onClick={handleActiveStar}
            className="flex items-center justify-center cursor-pointer rounded-[4px] p-[6px] ml-2 hover:bg-gray-300 transition-opacity duration-300"
          >
            {activeStar ? (
              <StarRoundedIcon style={{ fontSize: "20px" }} />
            ) : (
              <StarOutlineRoundedIcon style={{ fontSize: "20px" }} />
            )}
          </div>
        </TippyDetail>
      </div>
      <div
        style={{
          transition: "margin 0.2s ease-in",
        }}
        className={`flex items-center ${rightSidebar && "mr-[330px]"}`}
      >
        <div className="flex">
          <GroupAvatars users={membersBoard} />
        </div>

        <TippyDetail title={"Table filter tags"}>
          <div className="cursor-pointer flex items-center px-3 py-[6px] ml-2 rounded-[4px] hover:bg-gray-300 transition-bg duration-300">
            <FilterIcon width={16} height={16} className={"mr-2"} />
            <span className="text-[14px] font-medium">Filter</span>
          </div>
        </TippyDetail>
        <TippyDetail title={"Share Board"}>
          <div className="cursor-pointer flex items-center px-3 py-1 ml-2 rounded-[4px] bg-gray-600 hover:bg-gray-700 transition-bg duration-300">
            <GroupIcon width={16} height={16} className={"mr-2 text-white"} />
            <span className="text-[14px] font-medium text-white">Members</span>
          </div>
        </TippyDetail>
        <TippyDetail title={"Menu"}>
          <div
            onClick={handleToggleRightSidebar}
            className="cursor-pointer rounded-[4px] p-2 ml-2 hover:bg-gray-300 transition-opacity duration-300"
          >
            <HiDotsVertical size={16} className="text-gray-700 rotate-90" />
          </div>
        </TippyDetail>
      </div>
      <RightSidebar onClose={handleToggleRightSidebar} isOpen={rightSidebar} />
    </div>
  );
}

export default React.memo(HeaderBoard);
