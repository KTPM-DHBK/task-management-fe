import React, { useCallback, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import CloseIcon from "@mui/icons-material/Close";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import ItemMenu from "../ItemMenu";
import { CreateList, DeleteList } from "../../Services/API/ApiListOfBoard";
import { createCardByIdList } from "../../Services/API/ApiCard";
import DropItemChoose from "../DropItemChoose";
import { collectTypeSort, itemChooseToMove, nameOperations } from "./constans";
import { useListBoardContext } from "../../Pages/ListBoard/ListBoardContext";
import { ClickAwayListener, Popper } from "@mui/material";
import { useGetBoardPermission } from "../../Hooks/useBoardPermission";

const ConvertHiDotsVertical = ({ tippyName, data, className }) => {
  const {
    boardId,
    dataBoard,
    setListCount,
    handleShowAddCard,
    handleActiveMonitor,
    handleCopyList,
    listCount
  } = useListBoardContext();
  // const [allCardInList, setAllCardInList] = useState([]);
  const [isLeaveBoard, setIsLeaveBoard] = useState(false);
  const [activeCollectOperation, setActiveCollectOperation] = useState(null);
  const [nameList, setNameList] = useState(data && data.title);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [anchorEl, setAnchorEl] = useState(null);
  const [chooseMenuOperation, setchooseMenuOperation] = useState(true);

  const { getListPermissionByUser } = useGetBoardPermission(boardId);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const handleClickHidot = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setchooseMenuOperation(true);
  };

  const handleClickAway = () => {
    setAnchorEl(false);
    setIsLeaveBoard(false);
    setchooseMenuOperation(false);
  };

  const toggleCollape = () => {
    setchooseMenuOperation(true);
    setIsLeaveBoard(!isLeaveBoard);
  };

  const handleChooseMoveList = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ top: rect.bottom + 8, left: rect.left });
  }, []);

  const handleAddCopyList = async () => {
    const dataList = {
      title: nameList.trim(),
      description: data.description,
      boardId: dataBoard.id
    };
    const dataCopyList = {
      ...data,
      title: nameList.trim()
    };
    try {
      const list = await CreateList(dataBoard?.id, dataList);
      data.cards.map(async (card) => {
        const dataCard = {
          title: card.title,
          description: card.description || "",
          coverUrl: card.coverUrl || "",
          priority: card.priority || "",
          tagId: card.tagId || "",
          listId: list.id
        };
        await createCardByIdList(dataCard);
      });

      handleCopyList(dataCopyList);
    } catch (error) {
      console.error("Failed to create copy list:", error);
    }
    handleClickAway();
  };

  const handleSortCard = (index, idList) => {
    setActiveCollectOperation(index);
    handleClickAway();
    const listCards = listCount.find((list) => list.id === idList).cards || [];
    switch (index) {
      case 0:
        listCards.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 1:
        listCards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 2:
        listCards.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    const updatedListCount = listCount.map((list) =>
      list.id === idList ? { ...list, cards: listCards } : list
    );
    setListCount(updatedListCount);
  };

  const DeleteListInBoard = async (idBoard, idList) => {
    try {
      const res = await DeleteList(idBoard, idList);
      if (res?.data.removed === 1) {
        setListCount(listCount.filter((item) => item.id !== idList));
      }
    } catch (err) {
      console.error("Error delete list in board: ", err);
    }
  };

  const handleShow = (index, idList) => {
    toggleCollape();
    setActiveCollectOperation(index);
    setchooseMenuOperation(false);
    switch (index) {
      case 0:
        handleShowAddCard(idList);
        break;
      case 3:
        handleMoveAllCard(idList);
        break;
      case 5:
        handleActiveMonitor(data.id);
        handleClickAway();
        break;
      case 6:
        DeleteListInBoard(dataBoard.id, idList);
        handleClickAway();
        break;
      default:
        break;
    }
  };

  const handleMoveAllCard = async (idList) => {};

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      {getListPermissionByUser("update") ? (
        <div className="relative">
          <Tippy
            content={
              <span className="text-[12px] max-w-[150px]">{tippyName}</span>
            }
            arrow={false}
            placement="bottom"
          >
            <div
              aria-describedby={id}
              className={className}
              onClick={handleClickHidot}
            >
              <HiDotsVertical size={16} className="text-gray-700 rotate-90" />
            </div>
          </Tippy>
          <Popper id={id} open={open} anchorEl={anchorEl}>
            <>
              {chooseMenuOperation && (
                <>
                  <div className="absolute w-[250px] bg-white rounded-[8px] py-2 font-medium text-[12px] z-50 shadow-[0_3px_10px_rgba(0,0,0,0.3)]">
                    <div className="text-center p-2 mx-8">Operation</div>
                    {nameOperations.map((name, index) => (
                      <div
                        onClick={() => handleShow(index, data.id)}
                        key={index}
                        className="cursor-pointer p-2 bg-white rounded transition duration-200 hover:bg-gray-100"
                      >
                        {name}
                      </div>
                    ))}
                    <CloseIcon
                      onClick={handleClickHidot}
                      className="cursor-pointer absolute right-3 top-3 p-1 rounded-[4px] hover:bg-gray-100 "
                    />
                  </div>
                </>
              )}
              {isLeaveBoard && activeCollectOperation === 1 && (
                <ItemMenu
                  title={nameOperations[activeCollectOperation]}
                  description={"Name"}
                  nameBtn={"Create list"}
                  onClose={handleClickAway}
                  onBack={toggleCollape}
                  onClickConfirm={handleAddCopyList}
                >
                  <div className="w-full px-4">
                    <textarea
                      value={nameList}
                      onChange={(e) => {
                        setNameList(e.target.value);
                      }}
                      className="w-full border-2 border-gray-300 rounded-[4px] p-2"
                    />
                  </div>
                </ItemMenu>
              )}
              {isLeaveBoard && activeCollectOperation === 2 && (
                <ItemMenu
                  title={nameOperations[activeCollectOperation]}
                  nameBtn={"Move"}
                  onClose={handleClickAway}
                  onBack={toggleCollape}
                  onClickConfirm={handleAddCopyList}
                >
                  {itemChooseToMove.map((item, index) => (
                    <DropItemChoose
                      key={index}
                      info={item}
                      itemChooseToMove={itemChooseToMove}
                      data={data}
                      position={position}
                      onChoose={handleChooseMoveList}
                    />
                  ))}
                </ItemMenu>
              )}
              {isLeaveBoard && activeCollectOperation === 3 && (
                <ItemMenu
                  title={nameOperations[activeCollectOperation]}
                  onClose={handleClickAway}
                  onBack={toggleCollape}
                >
                  {listCount.map((item, index) => (
                    <div
                      onClick={
                        item.title === nameList
                          ? undefined
                          : () => handleShow(index, item.id)
                      }
                      key={index}
                      className={`p-2 bg-white rounded transition duration-200 ${item.title === nameList ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100 cursor-pointer"} `}
                    >
                      {item.title}
                    </div>
                  ))}
                </ItemMenu>
              )}
              {isLeaveBoard && activeCollectOperation === 4 && (
                <ItemMenu
                  title={nameOperations[activeCollectOperation]}
                  onClose={handleClickAway}
                  onBack={toggleCollape}
                >
                  {collectTypeSort.map((nameType, index) => (
                    <div
                      onClick={() => handleSortCard(index, data.id)}
                      key={index}
                      className="p-2 bg-white rounded transition duration-200 hover:bg-gray-100 cursor-pointer"
                    >
                      {nameType}
                    </div>
                  ))}
                </ItemMenu>
              )}
              {isLeaveBoard && activeCollectOperation === 7 && (
                <ItemMenu
                  title={nameOperations[activeCollectOperation]}
                  nameBtn={"Save Tags"}
                  onClose={handleClickAway}
                  onBack={toggleCollape}
                >
                  <div className="w-full px-4">
                    <p className="whitespace-normal">
                      Are you sure you want to save all selected tags?
                    </p>
                  </div>
                </ItemMenu>
              )}
            </>
          </Popper>
        </div>
      ) : (
        <div></div>
      )}
    </ClickAwayListener>
  );
};

export default React.memo(ConvertHiDotsVertical);
