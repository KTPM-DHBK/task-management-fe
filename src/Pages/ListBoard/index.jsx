import { HiDotsVertical } from "react-icons/hi";
import { useParams } from "react-router-dom";
import React, { useState } from "react";
import { ClickAwayListener, Popper } from "@mui/material";

import { ArrowDown } from "../../Components/Icons";
import { BoardCard } from "../../Components/BoardCard";
import { EditCard } from "../../Components/EditCard";
import Sidebar from "../../Components/Sidebar";
import BoardInSidebar from "../../Components/BoardInSidebar";
import HeaderBoard from "../../Components/HeaderBoard";
import ListInBoard from "../../Components/ListInBoard";
import ListBoardProvider from "./ListBoardContext";
import { useListBoardContext } from "./ListBoardContext";
import NavbarTable from "../../Components/HiDotsVertical/NavbarTable";

function ListBoard() {
  const { idWorkSpace, idBoard } = useParams();
  return (
    <ListBoardProvider boardId={idBoard} idWorkSpace={idWorkSpace}>
      <ListBoardContent />
    </ListBoardProvider>
  );
}

function ListBoardContent() {
  const { dataBoard, dataWorkspace, handleClosedNavBar, isShowBoardCard, isShowBoardEdit } = useListBoardContext();

  const [anchorEl, setAnchorEl] = useState(null);
  const [titleName, settitleName] = useState("Sort by alphabetical order");
  const [activeCollectTable, setActiveCollectTable] = useState(0);
  const [isChooseMoveList, setIsChooseMoveList] = useState(false);

  const styles = {
    position: "absolute",
    top: 0,
    right: 0,
    left: -10,
    zIndex: 1,
    border: "1px solid",
    p: 1,
    bgcolor: "background.paper",
  };

  const handleClickHidot = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickAway = () => {
    setAnchorEl(false);
  };

  const handleActive = (index, title) => {
    setActiveCollectTable(index);
    settitleName(title);
    handleClickHidot();
    setIsChooseMoveList(!isChooseMoveList);
  };

  const toggleCollape = () => {
    setIsChooseMoveList(!isChooseMoveList);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  return (
    <>
      <div
        style={{
          height: "calc(100vh - 56.8px)",
        }}
        className="w-[100wh] flex"
      >
        <Sidebar>
          <>
            <div className={`pl-4 py-4 flex items-center`}>
              <div className="rounded-[4px] px-3 font-bold text-white text-[20px] bg-gradient-to-b from-green-400 to-blue-500">
                B
              </div>
              <div className="flex-1 ml-2 text-[18px] font-medium">{dataWorkspace.title}</div>
              <div onClick={handleClosedNavBar} className="mr-4 p-2 rounded-[4px] hover:bg-gray-300 cursor-pointer">
                <ArrowDown width={16} height={16} className={"rotate-90 text-gray-100"} />
              </div>
            </div>
            <div className="group flex items-center">
              <div className="flex-1 text-[16px] font-medium py-2 pl-4 ">Your tables</div>
              <ClickAwayListener onClickAway={handleClickAway}>
                <div className="relative">
                  <div
                    aria-describedby={id}
                    className=" cursor-pointer p-2 mr-2 opacity-0 group-hover:opacity-100 hover:bg-gray-300 rounded-[4px] transition-opacity duration-300"
                    onClick={handleClickHidot}
                  >
                    <HiDotsVertical size={16} className="text-gray-700 rotate-90" />
                  </div>
                  <Popper id={id} open={open} anchorEl={anchorEl}>
                    <div style={styles}>
                      <NavbarTable
                        titleName={titleName}
                        isChooseMoveList={isChooseMoveList}
                        activeCollectTable={activeCollectTable}
                        toggleCollape={toggleCollape}
                        handleLeaveBoard={handleClickHidot}
                        handleActive={handleActive}
                      />
                    </div>
                  </Popper>
                </div>
              </ClickAwayListener>
            </div>
            <BoardInSidebar />
          </>
        </Sidebar>
        {/* list board */}
        <div
          className="flex-grow flex flex-col overflow-x-hidden"
          style={{
            backgroundColor:
              !dataBoard.coverUrl && dataBoard.backgroundColor ? dataBoard.backgroundColor : "transparent",
            backgroundImage: dataBoard.coverUrl
              ? `url(${dataBoard.coverUrl})`
              : dataBoard.backgroundColor
                ? "none"
                : `url(https://trello.com/assets/707f35bc691220846678.svg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <HeaderBoard />
          <ListInBoard />
        </div>
      </div>
      {isShowBoardCard && <BoardCard />}
      {isShowBoardEdit && <EditCard />}
    </>
  );
}

export default ListBoard;
