import React, { useState } from "react";
import HeadlessTippy from "@tippyjs/react/headless"; // HeadlessTippy cho tùy chỉnh hoàn toàn
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useGetWorkspaceByUser } from "../../../Hooks";
import { Avatar } from "@mui/material";
import Loading from "../../Loading";
import { useNavigate } from "react-router-dom";

export default function Workspaces() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { workspaceInfo, isLoading } = useGetWorkspaceByUser();

  if (isLoading) return <Loading />;

  return (
    <div className="relative inline-block">
      <HeadlessTippy
        interactive={true}
        visible={isOpen}
        onClickOutside={() => setIsOpen(false)}
        placement="bottom-start"
        render={(attrs) => (
          <div
            className="w-[300px] bg-white border border-solid border-gray-500 rounded-md shadow-md max-h-80 overflow-scroll flex flex-col gap-2 p-0 pl-2 pt-2"
            tabIndex="-1"
            {...attrs}
          >
            {workspaceInfo?.map((workspace, index) => (
              <div
                key={index}
                className="px-2 py-2 text-gray-700 rounded-md cursor-pointer hover:bg-slate-200"
                onClick={() => navigate(`/workspace/${workspace.id}/home`)}
              >
                <div className="flex items-center gap-2 text-base">
                  <Avatar sx={{ width: 28, height: 28, borderRadius: 1 }}>{workspace.title[0]}</Avatar>
                  <div className="text-sm font-bold">{workspace.title}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm flex items-center font-semibold mx-1 text-[#44546f] hover:bg-slate-200 px-2 py-1 rounded-[4px] active:bg-slate-200"
        >
          Workspaces
          <ExpandMoreIcon sx={{ color: "#44546f" }} />
        </button>
      </HeadlessTippy>
    </div>
  );
}
