import React, { useState, useMemo } from "react";
import HeadlessTippy from "@tippyjs/react/headless"; // HeadlessTippy cho tùy chỉnh hoàn toàn
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useGetAllBoards } from "../../../Hooks";
import Loading from "../../Loading";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate, useParams } from "react-router-dom";

export default function Stared() {
  const navigate = useNavigate();
  const { id: workspaceId } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (e, boardId) => {
    e.stopPropagation();
    navigate(`/workspace/${workspaceId}/board/${boardId}`);
  };

  const { boardData, isLoading, isFetching } = useGetAllBoards();

  const starredBoard = useMemo(() => boardData?.data.filter((board) => board.isFavorite), [boardData]);

  return (
    <div className="relative inline-block">
      <HeadlessTippy
        interactive={true}
        visible={isOpen}
        onClickOutside={() => setIsOpen(false)}
        placement="bottom-start"
        render={(attrs) => (
          <>
            {isLoading || isFetching ? (
              <Loading />
            ) : (
              <div
                className="w-[300px] bg-white border border-solid border-gray-500 rounded-md shadow-md max-h-80 p-3 flex flex-col gap-2"
                tabIndex="-1"
                {...attrs}
              >
                {starredBoard?.length ? (
                  starredBoard.map((board, index) => (
                    <div
                      key={index}
                      className="px-2 py-2 text-gray-700 rounded-md cursor-pointer hover:bg-slate-200"
                      onClick={(e) => handleItemClick(e, board.id)}
                    >
                      <div className="flex items-center gap-2 text-base justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-10 rounded-sm h-8"
                            style={{
                              backgroundColor: board.backgroundColor,
                              backgroundImage: board.coverUrl ? `url(${board.coverUrl})` : "none",
                              backgroundSize: "cover",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center center",
                            }}
                          />
                          <div className="text-xs  flex flex-col justify-between">
                            <div className="font-bold">{board.title}</div>
                            <div>{board?.workspace?.title || "Workspace Name"}</div>
                          </div>
                        </div>
                        <div className="text-yellow-400 flex justify-center">
                          <StarIcon fontSize="small" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col gap-3 p-2">
                    <img src="/NoStarredBoardImg.svg" alt="No starred Boards" />
                    <div className="text-center text-sm">Star important boards to access them quickly and easily.</div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm flex items-center font-semibold mx-1 text-[#44546f] hover:bg-slate-200 px-2 py-1 rounded-[4px] active:bg-slate-200"
        >
          Starred
          <ExpandMoreIcon sx={{ color: "#44546f" }} />
        </button>
      </HeadlessTippy>
    </div>
  );
}
