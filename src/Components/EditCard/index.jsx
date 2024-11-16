import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useCallback, useEffect, useState } from "react";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import InventoryIcon from "@mui/icons-material/Inventory";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { listBtnCard } from "./constans";
import { listColorLabel } from "../BoardCard/constans/list.constans";
import { AttachmentIcon, DescriptionIcon } from "../../Components/Icons";
import { ButtonBoardCard } from "../ButtonBoardCard";
import { useListBoardContext } from "../../Pages/ListBoard/ListBoardContext";
import { deleteCard, updateCard } from "../../Services/API/ApiCard";
import AddLabelInCard from "../BoardCard/AddLabelInCard";
import CreateLabel from "../BoardCard/CreateLabel";
import { AddTagInCard, RemoveTagInCard } from "../../Services/API/ApiBoard/apiBoard";
import BackgroundPhoto from "../BoardCard/BackgroundPhoto";
import CalendarPopper from "../BoardCard/CalendarPopper";

export const EditCard = ({ isFollowing = false, isArchived = false }) => {
  const {
    handleShowBoardCard,
    handleShowBoardEdit,
    setIsShowBoardEdit,
    setDataCard,
    isShowBoardEdit,
    dataCard,
    dataList,
    position,
    boardId,
  } = useListBoardContext();
  const [listLabel, setListLabel] = useState(() => {
    var tagsCard = dataCard?.tagCards
      ?.map((tagCard) => {
        if (!tagCard || !tagCard.tag) {
          return null;
        }
        return {
          id: tagCard.tag.id,
          updatedAt: tagCard.tag.updatedAt || null,
          createdAt: tagCard.tag.createdAt,
          deletedAt: tagCard.tag.deletedAt,
          color: tagCard.tag.color,
          name: tagCard.tag.name,
          boardId: tagCard.tag.boardId,
        };
      })
      .filter(Boolean);
    return tagsCard || [];
  });
  const [inputTitle, setInputTitle] = useState(dataCard?.title);
  const [isShowMenuBtnCard, setIsShowMenuBtnCard] = useState(false);
  const [isCreateLabel, setIsCreateLabel] = useState(false);
  const [numberShow, setNumberShow] = useState(null);
  const [positionBtn, setPositionBtn] = useState({ top: 0, left: 0 });
  const [countLabel, setCountLabel] = useState(listLabel);
  const [isUpdateLabel, setIsUpdateLabel] = useState(false);
  const [inputTitleLabel, setInputTitleLabel] = useState("");
  const [chooseColorLabel, setChooseColorLabel] = useState(listColorLabel[0]);
  const [chooseColorBackground, setChooseColorBackground] = useState(() => {
    return dataCard.coverUrl;
  });
  const [checkOverdue, setCheckOverdue] = useState(false);
  const [checkCompleteEndDate, setCheckCompleteEndDate] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [endDateCheck, setEndDateCheck] = useState(() => {
    if (!dataCard || dataCard.endDate == null) return null;
    const endDate = new Date(dataCard.endDate);
    const currentDate = new Date();
    // overdue time
    const isOverdue = endDate < currentDate;
    setCheckOverdue(isOverdue);
    const day = endDate.getUTCDate().toString().padStart(2, "0");
    const month = (endDate.getUTCMonth() + 1).toString().padStart(2, "0");
    const formattedDate = `${day}thg${month}`;
    return formattedDate;
  });

  useEffect(() => {
    if (endDateCheck != null) {
      let result = endDateCheck.match(/(\d{2}thg\d{2})/);
      if (result) {
        setEndDateCheck(result[0]);
      }
    }
  }, [endDateCheck]);

  const handleChange = (e) => {
    setInputTitle(e.target.value);
  };

  const handleSaveTitleCard = async () => {
    try {
      const data = {
        title: inputTitle,
        description: dataCard.description,
        coverUrl: dataCard.coverUrl,
        priority: dataCard.priority,
        tagId: dataCard.tagId,
        startDate: dataCard.startDate,
        endDate: dataCard.endDate,
        listId: dataList.id,
      };
      const res = await updateCard(dataCard.id, data);
      setDataCard((prev) => {
        return { ...prev, title: inputTitle };
      });
      if (isShowBoardEdit) {
        setIsShowBoardEdit(!isShowBoardEdit);
      }
      return res;
    } catch (error) {
      console.error("Error setup background in card detail: ", error);
    }
  };

  const handleCloseShowMenuBtnCard = () => {
    setIsShowMenuBtnCard(!isShowMenuBtnCard);
    if (isCreateLabel) setIsCreateLabel(!isCreateLabel);
  };

  const handleShowMenuBtnCard = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPositionBtn({ top: rect.bottom + 8, left: rect.left });
    handleCloseShowMenuBtnCard();
  };

  const handleAddLabel = useCallback(
    (item) => {
      const addTagAsync = async () => {
        try {
          await AddTagInCard(boardId, dataCard?.id, item.id);
        } catch (err) {
          console.error("Error add data tag in card detail: ", err);
        }
      };
      const removeTagAsync = async () => {
        try {
          await RemoveTagInCard(boardId, dataCard?.id, item.id);
        } catch (err) {
          console.error("Error remove data tag in card detail: ", err);
        }
      };
      setCountLabel((prevCountLabel) => {
        if (prevCountLabel.some((i) => i.id === item.id)) {
          removeTagAsync();
          return prevCountLabel.filter((i) => i.id !== item.id);
        } else {
          addTagAsync();
          return [...prevCountLabel, item];
        }
      });
      setDataCard((prevDataCard) => ({
        ...prevDataCard,
        tagCards: [...(prevDataCard.tagCards || []), countLabel],
      }));
    },
    [dataCard, boardId, countLabel, setDataCard],
  );

  const ShowDetailNewLabel = useCallback(() => {
    setIsCreateLabel(!isCreateLabel);
    if (isUpdateLabel) {
      setIsUpdateLabel(!isUpdateLabel);
    }
  }, [isCreateLabel, isUpdateLabel]);

  const ShowUpdateLabel = useCallback(
    (item) => {
      ShowDetailNewLabel();
      setIsUpdateLabel(!isUpdateLabel);
      setChooseColorLabel(item);
      setInputTitleLabel(item.name);
    },
    [isUpdateLabel, ShowDetailNewLabel],
  );

  const handleChangeInputLabel = (e) => {
    setInputTitleLabel(e.target.value);
  };

  const handleChooseColor = (item) => {
    setChooseColorLabel(item);
  };

  const handleCreateNewLabel = (dataColor, titleLabel = "") => {
    const dataLabel = {
      ...dataColor,
      name: titleLabel,
    };
    setListLabel((prev) => {
      if (prev.some((item) => item.id === dataLabel.id)) {
        const itemLabel = prev.find((item) => item.id === dataLabel.id);
        if (itemLabel.name !== dataLabel.name || itemLabel.color !== dataLabel.color) {
          return prev.map((item) =>
            item.id === dataLabel.id ? { ...item, color: dataLabel.color, name: dataLabel.name } : item,
          );
        }
        return prev;
      } else {
        return [...prev, dataLabel];
      }
    });
    ShowDetailNewLabel();
    setInputTitleLabel("");
    handleAddLabel(dataLabel);
  };

  const handleUpdateLabel = (dataColor, titleLabel = "") => {
    const dataLabel = {
      ...dataColor,
      name: titleLabel,
    };
    setListLabel((prev) => {
      if (prev.some((item) => item.id === dataLabel.id)) {
        const itemLabel = prev.find((item) => item.id === dataLabel.id);
        if (itemLabel.name !== dataLabel.name || itemLabel.color !== dataLabel.color) {
          return prev.map((item) =>
            item.id === dataLabel.id ? { ...item, color: dataLabel.color, name: dataLabel.name } : item,
          );
        }
        return prev;
      } else {
        return [...prev, dataLabel];
      }
    });
    ShowDetailNewLabel();
    setInputTitleLabel("");
  };

  const handleCloseBtnPhoto = async () => {
    handleCloseShowMenuBtnCard();
    try {
      const data = {
        title: dataCard.title,
        description: dataCard.description,
        coverUrl: chooseColorBackground,
        priority: dataCard.priority,
        tagId: dataCard.tagId,
        startDate: dataCard.startDate,
        endDate: dataCard.endDate,
        listId: dataList.id,
      };
      const res = await updateCard(dataCard.id, data);
      setDataCard((prev) => {
        return { ...prev, coverUrl: chooseColorBackground };
      });
      return res;
    } catch (error) {
      console.error("Error setup background in card detail: ", error);
    }
  };

  const handleChooseColorBackground = useCallback(async (item) => {
    setChooseColorBackground(item);
  }, []);

  const handleStorageToCard = async () => {
    try {
      const res = await deleteCard(dataCard.id);
      if (res.removed === 1) {
        setDataCard(res);
      }
    } catch (error) {
      console.log("Error: Unable to store data on the card", error);
    }
  };

  const handleClickBtn = (e, item) => {
    setNumberShow(item.id);
    switch (item.id) {
      case 1:
        handleShowBoardCard(dataList, dataCard);
        break;
      case 2:
      case 4:
      case 5:
        handleShowMenuBtnCard(e);
        break;
      case 8:
        handleStorageToCard();
        handleShowBoardEdit(e, dataList, dataCard);
        break;
      default:
        break;
    }
  };
  return (
    <div
      onClick={(e) => handleShowBoardEdit(e, dataList, dataCard)}
      className="absolute top-0 left-0 flex w-full h-full bg-black bg-opacity-50 overflow-auto z-[999]"
    >
      <div style={{ top: position.top - 120, left: position.left - 200 }} className="absolute mt-20 mb-10">
        <div
          onClick={(e) => e.stopPropagation()}
          className=" flex justify-between min-w-[240px] bg-white rounded-[8px] font-medium text-[12px] z-500"
        >
          <div className="flex flex-col justify-center w-full min-h-[40px]">
            {chooseColorBackground && (
              <div
                style={{
                  backgroundImage: chooseColorBackground.startsWith("http") ? `url(${chooseColorBackground})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundColor: chooseColorBackground.startsWith("#") ? chooseColorBackground : "",
                }}
                className={`w-full h-[100px] rounded-t-[8px]`}
              />
            )}

            <div className="flex flex-col px-2 pb-2">
              <div className="flex items-center flex-wrap mt-2">
                {countLabel?.length > 0 &&
                  countLabel?.map((tagCard) =>
                    tagCard?.color ? (
                      <div
                        key={tagCard.id}
                        className={`hover:opacity-90 ${tagCard.color} mr-1 mb-1 h-[8px] w-[40px] rounded-[4px] transition-all duration-50`}
                      />
                    ) : null,
                  )}
              </div>
              <input
                type="text"
                value={inputTitle}
                onChange={(e) => handleChange(e)}
                className="flex-1 rounded-[8px] py-1 text-[14px] font-[400] cursor-pointer whitespace-normal"
              />
              <div className="flex items-center justify-between w-full flex-wrap">
                <div className="flex items-center flex-wrap pb-2">
                  {endDateCheck != null && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <div
                        onClick={() => setCheckCompleteEndDate(!checkCompleteEndDate)}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className={`flex items-center text-[12px] ${checkCompleteEndDate ? "bg-green-300" : checkOverdue ? "bg-red-100" : "bg-gray-300"} cursor-pointer rounded-[4px] p-1  hover:opacity-90 relative`}
                      >
                        <div className=" flex items-center justify-center w-[20px] h-[20px]">
                          {isHovered ? (
                            <input
                              checked={checkCompleteEndDate}
                              onChange={() => setCheckCompleteEndDate(!checkCompleteEndDate)}
                              type="checkbox"
                              className="w-[12px] h-[12px] cursor-pointer"
                            />
                          ) : (
                            <AccessTimeIcon style={{ fontSize: "16px" }} />
                          )}
                        </div>
                        <div>{endDateCheck}</div>
                      </div>
                    </div>
                  )}
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
                        <div className="text-[12px] font-[400] text-black-500 py-[4px]">
                          {dataCard?.comments?.length}
                        </div>
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
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex flex-col max-w-[80px] mt-2"
        >
          <ButtonBoardCard
            isActive={true}
            nameBtn={"Save"}
            className={"text-white font-[500] justify-center bg-blue-500 hover:bg-blue-400 mb-1"}
            onHandleEvent={handleSaveTitleCard}
          />
        </div>
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{ top: position.top - 40, left: position.left + 50 }}
        className="absolute flex flex-col"
      >
        {listBtnCard.map((item, index) => (
          <ButtonBoardCard
            key={index}
            onHandleEvent={(e) => handleClickBtn(e, item)}
            isActive={true}
            nameBtn={item.nameBtn}
            className={"bg-white hover:bg-gray-300 mb-1"}
          >
            {item.Icon}
          </ButtonBoardCard>
        ))}
      </div>

      {isShowMenuBtnCard && numberShow === 2 && (
        <div onClick={(e) => e.stopPropagation()}>
          {!isCreateLabel && (
            <AddLabelInCard
              position={positionBtn}
              countLabel={countLabel}
              listLabel={listLabel}
              handleAddLabel={handleAddLabel}
              ShowUpdateLabel={ShowUpdateLabel}
              ShowDetailNewLabel={ShowDetailNewLabel}
              handleCloseShowMenuBtnCard={handleCloseShowMenuBtnCard}
            />
          )}
          {isCreateLabel && (
            <CreateLabel
              position={positionBtn}
              isUpdateLabel={isUpdateLabel}
              handleCloseShowMenuBtnCard={handleCloseShowMenuBtnCard}
              ShowDetailNewLabel={ShowDetailNewLabel}
              chooseColorLabel={chooseColorLabel}
              handleChangeInputLabel={handleChangeInputLabel}
              inputTitleLabel={inputTitleLabel}
              handleChooseColor={handleChooseColor}
              handleCreateNewLabel={handleCreateNewLabel}
              onUpdateLabel={handleUpdateLabel}
            />
          )}
        </div>
      )}

      {isShowMenuBtnCard && numberShow === 4 && (
        <div onClick={(e) => e.stopPropagation()}>
          <BackgroundPhoto
            position={positionBtn}
            handleCloseShowMenuBtnCard={handleCloseBtnPhoto}
            ShowDetailNewLabel={ShowDetailNewLabel}
            background={chooseColorBackground}
            chooseBackground={handleChooseColorBackground}
          />
        </div>
      )}

      {isShowMenuBtnCard && numberShow === 5 && (
        <div onClick={(e) => e.stopPropagation()}>
          <CalendarPopper
            position={position}
            handleCloseShowMenuBtnCard={handleCloseShowMenuBtnCard}
            endDate={setEndDateCheck}
          />
        </div>
      )}
    </div>
  );
};
