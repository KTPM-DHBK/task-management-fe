import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useCallback, useEffect, useState } from "react";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import InventoryIcon from "@mui/icons-material/Inventory";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar } from "@mui/material";

import { listBtnCard } from "./constans";
import { AttachmentIcon, DescriptionIcon } from "../../Components/Icons";
import { ButtonBoardCard } from "../ButtonBoardCard";
import { useListBoardContext } from "../../Pages/ListBoard/ListBoardContext";
import { deleteCard, JoinToCard, RemoveUserToCard, updateCard } from "../../Services/API/ApiCard";
import AddLabelInCard from "../BoardCard/AddLabelInCard";
import CreateLabel from "../BoardCard/CreateLabel";
import { AddTagInCard, getAllTagByIdBoard, RemoveTagInCard } from "../../Services/API/ApiBoard/apiBoard";
import BackgroundPhoto from "../BoardCard/BackgroundPhoto";
import CalendarPopper from "../BoardCard/CalendarPopper";
import { useGetCardById } from "../../Hooks";
import { useParams } from "react-router-dom";
import { createTag, updateTag } from "../../Services/API/APITags";
import { stringAvatar } from "../../Utils/color";
import { apiAssignFile, apiUploadMultiFile } from "../../Services/API/ApiUpload/apiUpload";
import MemberMenu from "../MemberMenuOfBoard";
import { useStorage } from "../../Contexts";
import { EQueryKeys } from "../../constants";

export const EditCardModal = ({ isFollowing = false, isArchived = false }) => {
  const {
    handleShowBoardCard,
    handleShowBoardEdit,
    setToggleCardEditModal,
    setDataCard,
    toggleCardEditModal,
    dataList,
    position,
    boardId,
  } = useListBoardContext();
  const { userData } = useStorage();
  const queryClient = useQueryClient();
  const cardId = localStorage.getItem("cardId");
  const { data: dataCard } = useGetCardById(cardId);
  const { idBoard } = useParams();
  const [tag, setTag] = useState({});
  const [labelOfCard, setLabelOfCard] = useState(
    () =>
      dataCard?.tagCards
        ?.filter((tagCard) => tagCard?.tag)
        .map(({ tag }) => ({
          id: tag.id,
          updatedAt: tag.updatedAt || null,
          color: tag.color,
          name: tag.name,
          boardId: idBoard,
        })) || [],
  );
  const [listColorLabel, setListColorLabel] = useState([]);
  const [postUploadedFiles, setPostUploadedFiles] = useState(dataCard?.files || []);
  const [membersInCard, setMembersInCard] = useState(dataCard?.members || []);

  const [inputTitle, setInputTitle] = useState(dataCard?.title);
  const [isShowMenuBtnCard, setIsShowMenuBtnCard] = useState(false);
  const [isCreateLabel, setIsCreateLabel] = useState(false);
  const [numberShow, setNumberShow] = useState(null);
  const [positionBtn, setPositionBtn] = useState({ top: 0, left: 0 });
  const [isUpdateLabel, setIsUpdateLabel] = useState(false);
  const [inputTitleLabel, setInputTitleLabel] = useState("");
  const [chooseColorLabel, setChooseColorLabel] = useState("");
  const [chooseColorBackground, setChooseColorBackground] = useState(dataCard?.coverUrl || "");
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

  useEffect(() => {
    const getAllLabelOfBoard = async () => {
      try {
        const res = await getAllTagByIdBoard(idBoard);
        setListColorLabel(res?.data.data || []);
      } catch (err) {
        console.error("Error all label data: ", err);
      }
    };
    getAllLabelOfBoard();
  }, [idBoard]);

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
      if (toggleCardEditModal) {
        setToggleCardEditModal((prev) => !prev);
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
      setLabelOfCard((prevCountLabel) => {
        if (prevCountLabel.some((i) => i.id === item.id)) {
          removeTagAsync();
          return prevCountLabel.filter((i) => i.id !== item.id);
        } else {
          addTagAsync();
          return [...prevCountLabel, item];
        }
      });
    },
    [dataCard, boardId],
  );

  const ShowDetailNewLabel = useCallback(() => {
    setIsCreateLabel(!isCreateLabel);
    if (isUpdateLabel) {
      setIsUpdateLabel(!isUpdateLabel);
    }
  }, [isCreateLabel, isUpdateLabel]);

  const ShowUpdateLabel = useCallback(
    (item) => {
      item = { ...item, colorCode: item.color };
      ShowDetailNewLabel();
      setIsUpdateLabel(!isUpdateLabel);
      setChooseColorLabel(item);
      setTag(item);
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

  const handleCreateNewLabel = async (dataColor, titleLabel = "") => {
    try {
      ShowDetailNewLabel();
      setInputTitleLabel("");
      const tag = await createTag({
        boardId: Number(boardId),
        name: titleLabel,
        color: dataColor?.colorCode,
      });
      tag && setListColorLabel([...listColorLabel, tag]);
      tag && (await AddTagInCard(boardId, dataCard?.id, tag.id));
    } catch (err) {
      console.error("Error add data tag in card detail: ", err);
    }
  };

  const handleUpdateLabel = async (tag, dataColor, titleLabel = "") => {
    try {
      ShowDetailNewLabel();
      setInputTitleLabel("");
      const resTag = await updateTag({
        boardId: Number(boardId),
        name: titleLabel,
        color: dataColor?.colorCode,
        tagId: tag.id,
      });
      if (resTag) {
        setListColorLabel((prevList) =>
          prevList.map((item) =>
            item.id === tag.id ? { ...item, name: titleLabel, color: dataColor?.colorCode } : item,
          ),
        );
      }
    } catch (error) {
      console.error("Error update data tag in card detail: ", error);
    }
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

  const handlePostFiles = useCallback(
    async (id, allUrls) => {
      try {
        const response = await apiAssignFile(id, allUrls);
        setPostUploadedFiles([...response.data.files]);
        return response.data.files;
      } catch (error) {
        console.error("Failed to get uploaded files:", error);
      }
    },
    [setPostUploadedFiles],
  );

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files.length) return;
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const validFiles = [];
    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.name} is too large to upload.`);
      } else {
        validFiles.push(file);
      }
    });
    if (!validFiles.length) return;
    const loadToastId = toast.loading("Uploading...");

    try {
      // Tải lên các file song song
      const uploadPromises = validFiles.map((file) => {
        const formData = new FormData();
        formData.append("files", file);
        return apiUploadMultiFile(formData);
      });

      const responses = await Promise.all(uploadPromises);
      toast.dismiss(loadToastId);
      toast.success("Upload successful!");

      // Lấy dữ liệu file đã tải lên
      const uploadedFilesData = responses.flatMap((response) => response.data);
      const uploadedUrls = uploadedFilesData.map((file) => file.url);

      // Gọi API để đính kèm (gửi) các URL len dữ liệu thẻ (card)
      await handlePostFiles(dataCard.id, uploadedUrls);
      return uploadedFilesData;
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.dismiss(loadToastId);
      toast.error("Failed to upload files.");
    }
  };

  const handleJoinIntoCard = async (item) => {
    try {
      const isUserJoined = membersInCard?.some((member) => member?.user?.id === item.id);
      if (isUserJoined) {
        const res = await RemoveUserToCard(dataCard.id, item.id);
        res && setMembersInCard((prev) => prev.filter((p) => p?.user?.id !== item.id));
      } else {
        const res = await JoinToCard(dataCard.id, item.id);
        res && setMembersInCard([...membersInCard, { user: item }]);
      }
      queryClient.invalidateQueries([EQueryKeys.GET_MEMBER_BY_BOARD]);
    } catch (error) {
      console.error("Error handling join member to card:", error);
    }
  };

  const handleAddMember = async (item) => {
    try {
      if (item?.user.id === userData.id) {
        handleJoinIntoCard(item?.user);
        return;
      }
      const res = await JoinToCard(dataCard.id, item?.user.id);
      res && setMembersInCard([...membersInCard, { user: item?.user }]);
      queryClient.invalidateQueries([EQueryKeys.GET_MEMBER_BY_BOARD]);
    } catch (error) {
      console.error("Error handling member:", error);
    }
  };

  const handleClickBtn = (e, item) => {
    setNumberShow(item.id);
    switch (item.id) {
      case 1:
        handleShowBoardCard(dataCard);
        break;
      case 2:
      case 3:
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
          className=" flex justify-between w-[240px] bg-white rounded-[8px] font-medium text-[12px] z-500"
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
                {labelOfCard?.length > 0 &&
                  labelOfCard?.map((tagCard) =>
                    tagCard?.color ? (
                      <div
                        key={tagCard.id}
                        style={{
                          backgroundColor: tagCard.color,
                        }}
                        className={`hover:opacity-90 mr-1 mb-1 h-[8px] w-[40px] rounded-[4px] transition-all duration-50`}
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
                <div className="flex flex-1 items-center flex-wrap pb-2">
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
                    <div key={index} className="flex items-center flex-wrap pb-2">
                      <Avatar
                        {...stringAvatar(member.user?.name)}
                        alt={member.user?.name}
                        src={member.user?.avatarUrl || ""}
                        sx={{ width: 24, height: 24, marginLeft: "8px" }}
                      />
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
              position={position}
              labelOfCard={labelOfCard}
              listColorLabel={listColorLabel}
              handleAddLabel={handleAddLabel}
              ShowUpdateLabel={ShowUpdateLabel}
              ShowDetailNewLabel={ShowDetailNewLabel}
              handleCloseShowMenuBtnCard={handleCloseShowMenuBtnCard}
            />
          )}
          {isCreateLabel && (
            <CreateLabel
              position={position}
              tag={tag}
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
      {isShowMenuBtnCard && numberShow === 3 && (
        <div onClick={(e) => e.stopPropagation()}>
          <MemberMenu
            onAddMember={handleAddMember}
            membersInCard={membersInCard}
            setMembersInCard={setMembersInCard}
            handleCloseShowMenuBtnCard={handleCloseShowMenuBtnCard}
          />
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
            postUploadedFiles={postUploadedFiles}
            setPostUploadedFiles={setPostUploadedFiles}
            handleUploadFile={handleFileChange}
          />
        </div>
      )}
      {isShowMenuBtnCard && numberShow === 5 && (
        <div onClick={(e) => e.stopPropagation()}>
          <CalendarPopper
            position={position}
            handleCloseShowMenuBtnCard={handleCloseShowMenuBtnCard}
            setEndDateCheck={setEndDateCheck}
            dataCard={dataCard}
          />
        </div>
      )}
    </div>
  );
};
