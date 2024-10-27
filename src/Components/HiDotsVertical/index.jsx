import React, { useCallback, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import CloseIcon from "@mui/icons-material/Close";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import ItemMenu from "../ItemMenu";
import { CreateList } from "../../Services/API/ApiListOfBoard";
import { createCardByIdList } from "../../Services/API/ApiCard";
import DropItemChoose from "../DropItemChoose";
import { collectTypeSort, itemChooseToMove, nameOperations } from "./constans";
import NavbarTable from "./NavbarTable";
import NavbarBoard from "./NavbarBoard";
import { useListBoardContext } from "../../Pages/ListBoard/ListBoardContext";

const ConvertHiDotsVertical = ({ tippyName, data, className, type }) => {
  let { dataBoard, setListCount, handleShowAddCard, handleActiveMonitor, handleCopyList, listCount } =
    useListBoardContext();
  // const [allCardInList, setAllCardInList] = useState([]);
  const [showHiDotsVertical, setShowHiDotsVertical] = useState(null);
  const [isLeaveBoard, setIsLeaveBoard] = useState(false);
  const [isChooseMoveList, setIsChooseMoveList] = useState(false);
  const [activeCollectTable, setActiveCollectTable] = useState(0);
  const [activeCollectOperation, setActiveCollectOperation] = useState(null);
  const [titleName, settitleName] = useState("Sort by alphabetical order");
  const [nameList, setNameList] = useState(data && data.title);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const toggleCollape = () => {
    setShowHiDotsVertical(!showHiDotsVertical);
    if (isLeaveBoard) {
      setIsLeaveBoard(!isLeaveBoard);
    }
    if (isChooseMoveList) {
      setIsChooseMoveList(!isChooseMoveList);
    }
  };

  const handleLeaveBoard = () => {
    setIsLeaveBoard(!isLeaveBoard);
    if (isChooseMoveList) {
      setIsChooseMoveList(!isChooseMoveList);
    }
  };

  const handleChooseMoveList = useCallback(
    (e) => {
      setIsChooseMoveList(!isChooseMoveList);
      const rect = e.currentTarget.getBoundingClientRect();
      setPosition({ top: rect.bottom + 8, left: rect.left });
    },
    [isChooseMoveList],
  );

  const handleAddCopyList = async () => {
    const dataList = {
      title: nameList.trim(),
      description: data.description,
      boardId: dataBoard.id,
    };
    const dataCopyList = {
      ...data,
      title: nameList.trim(),
    };
    try {
      const list = await CreateList(dataList);
      data.cards.map(async (card) => {
        const dataCard = {
          title: card.title,
          description: card.description || "",
          coverUrl: card.coverUrl || "",
          priority: card.priority || "",
          tagId: card.tagId || "",
          listId: list.id,
        };
        await createCardByIdList(dataCard);
      });

      handleCopyList(dataCopyList);
    } catch (error) {
      console.error("Failed to create copy list:", error);
    }
    handleLeaveBoard();
  };

  const handleSortCard = (index, idList) => {
    setActiveCollectOperation(index);
    handleLeaveBoard();
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

    const updatedListCount = listCount.map((list) => (list.id === idList ? { ...list, cards: listCards } : list));
    setListCount(updatedListCount);
  };

  const handleShow = (index, idList) => {
    toggleCollape();
    setActiveCollectOperation(index);
    handleLeaveBoard();

    switch (index) {
      case 0:
        handleShowAddCard(idList);
        break;
      case 3:
        handleMoveAllCard(idList);
        break;
      case 5:
        handleActiveMonitor(data.id);
        break;
      default:
        break;
    }
  };

  const handleActive = (index, title) => {
    setActiveCollectTable(index);
    settitleName(title);
  };

  const handleMoveAllCard = async (idList) => {};

  return (
    <div>
      {tippyName ? (
        <Tippy
          content={<span className="text-[12px] max-w-[150px]">{tippyName}</span>}
          arrow={false}
          placement="bottom"
        >
          <div className={className} onClick={toggleCollape}>
            <HiDotsVertical size={16} className="text-gray-700 rotate-90" />
          </div>
        </Tippy>
      ) : (
        <div className={className} onClick={toggleCollape}>
          <HiDotsVertical size={16} className="text-gray-700 rotate-90" />
        </div>
      )}
      <>
        {type === "navbarTable" && showHiDotsVertical && (
          <NavbarTable
            titleName={titleName}
            isLeaveBoard={isLeaveBoard}
            activeCollectTable={activeCollectTable}
            toggleCollape={toggleCollape}
            handleLeaveBoard={handleLeaveBoard}
            handleActive={handleActive}
          />
        )}

        {type === "navbarBoard" && showHiDotsVertical && (
          <NavbarBoard isLeaveBoard={isLeaveBoard} handleLeaveBoard={handleLeaveBoard} toggleCollape={toggleCollape} />
        )}

        {type === "operation" && showHiDotsVertical && (
          <>
            <div className="absolute w-[250px] bg-white rounded-[8px] py-2 font-medium text-[12px] z-50 shadow-[0_3px_10px_rgba(0,0,0,0.3)]">
              <div className="p-2 mx-8 text-center">Operation</div>
              {nameOperations.map((name, index) => (
                <div
                  onClick={() => handleShow(index, data.id)}
                  key={index}
                  className="p-2 transition duration-200 bg-white rounded cursor-pointer hover:bg-gray-100"
                >
                  {name}
                </div>
              ))}
              <CloseIcon
                onClick={toggleCollape}
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
            onLeaveBoard={handleLeaveBoard}
            onToggleCollape={toggleCollape}
            onHandleCopyList={handleAddCopyList}
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
            onLeaveBoard={handleLeaveBoard}
            onToggleCollape={toggleCollape}
            onHandleCopyList={handleAddCopyList}
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
            onLeaveBoard={handleLeaveBoard}
            onToggleCollape={toggleCollape}
          >
            {listCount.map((item, index) => (
              <div
                onClick={item.title === nameList ? undefined : () => handleShow(index, item.id)}
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
            onLeaveBoard={handleLeaveBoard}
            onToggleCollape={toggleCollape}
          >
            {collectTypeSort.map((nameType, index) => (
              <div
                onClick={() => handleSortCard(index, data.id)}
                key={index}
                className="p-2 transition duration-200 bg-white rounded cursor-pointer hover:bg-gray-100"
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
            onLeaveBoard={handleLeaveBoard}
            onToggleCollape={toggleCollape}
          >
            <div className="w-full px-4">
              <p className="whitespace-normal">Are you sure you want to save all selected tags?</p>
            </div>
          </ItemMenu>
        )}
      </>
    </div>
  );
};

export default React.memo(ConvertHiDotsVertical);
