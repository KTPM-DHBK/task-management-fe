import {
  Close as CloseIcon,
  FeaturedPlayList as FeaturedPlayListIcon,
  Subject as SubjectIcon,
  FormatListBulleted as FormatListBulletedIcon,
  RemoveRedEyeOutlined as RemoveRedEyeOutlinedIcon,
  Person4Outlined as Person4OutlinedIcon,
  CheckBoxOutlined as CheckBoxOutlinedIcon,
  Add as AddIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import PersonRemoveAlt1OutlinedIcon from "@mui/icons-material/PersonRemoveAlt1Outlined";
import { useParams } from "react-router-dom";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ClickAwayListener } from "@mui/material";

import { ButtonBoardCard } from "../ButtonBoardCard";
import MemberMenu from "../MemberMenuOfBoard";
import ToDoMenu from "../ToDoMenuOfBoard";
import { listBtnCard } from "./constans/list.constans";
import { useListBoardContext } from "../../Pages/ListBoard/ListBoardContext";
import ItemPerson from "../ItemPerson";
import { useStorage } from "../../Contexts";
import AddLabelInCard from "./AddLabelInCard";
import CreateLabel from "./CreateLabel";
import UploadFile from "./Attachment/UploadFile";
import Attachment from "./Attachment";
import CalendarPopper from "./CalendarPopper";
import { BoardComments } from "./ShowComment";
import { AddTagInCard, getAllTagByIdBoard, RemoveTagInCard } from "../../Services/API/ApiBoard/apiBoard";
import BackgroundPhoto from "./BackgroundPhoto";
import { JoinToCard, RemoveUserToCard, updateCard } from "../../Services/API/ApiCard";
import UploadPoper from "./Attachment/UploadPoper";
import WriteComment from "./WriteComment";
import { EQueryKeys } from "../../constants";
import { useGetCardById } from "../../Hooks";
import Loading from "../Loading";
import { formatDate } from "./WriteComment/helpers/formatDate";
import { createTag, updateTag } from "../../Services/API/APITags";
import { apiAssignFile, apiUploadMultiFile } from "../../Services/API/ApiUpload/apiUpload";

export const BoardCard = () => {
  const {
    handleShowBoardCard,
    dataList,
    position,
    setPosition,
    content,
    setContent,
    isSaving,
    handleDeleteComment,
    setEditorInstance,
    boardId,
    setDataCard,
  } = useListBoardContext();
  const { idBoard } = useParams();

  const cardId = localStorage.getItem("cardId");
  const { data: dataCard } = useGetCardById(cardId);
  const queryClient = useQueryClient();

  const { userData } = useStorage();
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
  const [updatedBtnCard, setUpdatedBtnCard] = useState(listBtnCard);
  const [listColorLabel, setListColorLabel] = useState([]);
  const [membersInCard, setMembersInCard] = useState(dataCard?.members || []);
  const [listToDo, setListToDo] = useState([]);
  const [chooseColorLabel, setChooseColorLabel] = useState({});
  const [tag, setTag] = useState({});
  const [inputTitleLabel, setInputTitleLabel] = useState("");
  const [inputTitleToDo, setInputTitleToDo] = useState("What to do");
  const [inputTitleToDoItem, setInputTitleToDoItem] = useState("");
  const [numberShow, setNumberShow] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCreateLabel, setIsCreateLabel] = useState(false);
  const [isUpdateLabel, setIsUpdateLabel] = useState(false);
  const [isShowMenuBtnCard, setIsShowMenuBtnCard] = useState(false);
  const [isJoin, setIsJoin] = useState(false);

  const [checkCompleteEndDate, setCheckCompleteEndDate] = useState(false);
  const [checkOverdue] = useState(false);
  const [endDateCheck, setEndDateCheck] = useState(formatDate(dataCard?.endDate));

  const [chooseColorBackground, setChooseColorBackground] = useState(dataCard?.coverUrl || "");

  const [openAttach, setOpenAttach] = useState(false);
  const handleOpenAttach = () => setOpenAttach(true);
  const handleCloseAttach = () => setOpenAttach(false);
  const [postUploadedFiles, setPostUploadedFiles] = useState(dataCard?.files || []);

  const listComment = dataCard?.comments?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleFollowing = () => {
    setIsFollowing(!isFollowing);
  };

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

  const handleChooseColorBackground = useCallback(async (item) => {
    setChooseColorBackground(item);
  }, []);

  useEffect(() => {
    const isUserJoined = dataCard?.members.some((member) => member?.user.avatarUrl === userData.avatarUrl);
    const newBtnCard = listBtnCard.map((btn) => {
      if (btn.nameBtn === "Join" && isUserJoined) {
        setIsJoin(true);
        setIsFollowing(true);
        return {
          ...btn,
          nameBtn: "Leave",
          Icon: <PersonRemoveAlt1OutlinedIcon className="ml-1 mr-2" fontSize="small" />,
        };
      }
      return btn;
    });

    setUpdatedBtnCard(newBtnCard);
  }, [dataCard, userData]);

  const ShowCreateToDoItem = (Item) => {
    setListToDo((prev) => {
      return prev.map((item) => {
        if (item.id === Item.id) {
          const isCreateItem = !item.isCreateItem;
          return {
            ...item,
            isCreateItem: isCreateItem,
          };
        }
        return item;
      });
    });
  };

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

  const handleCreateNewToDoList = (nameItem, dataCopy = null) => {
    const dataToDo = {
      id: listToDo.length + 1,
      title: nameItem,
      todoItem: [],
      percent: 0,
    };
    setListToDo((prev) => {
      if (prev.some((item) => item.id === dataToDo.id)) {
        // const itemLabel = prev.find((item) => item.id === dataToDo.id);
        // if (itemLabel.title !== dataToDo.title) {
        //   return prev.map((item) => (item.id === dataToDo.id ? { ...item, title: dataToDo.title } : item));
        // }
        return prev;
      } else {
        return [...prev, dataToDo];
      }
    });
    handleCloseShowMenuBtnCard();
  };

  const handleRemoveToDoList = (item) => {
    setListToDo((prev) => {
      return prev.filter((i) => i.id !== item.id);
    });
  };

  const handleShowMenuBtnCard = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ top: rect.bottom + 8, left: rect.left });
    handleCloseShowMenuBtnCard();
  };

  const handleCloseShowMenuBtnCard = () => {
    setIsShowMenuBtnCard(!isShowMenuBtnCard);
    if (isCreateLabel) setIsCreateLabel(!isCreateLabel);
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

  const handleCheckDoneToDoItem = (Item, todoItemList) => {
    setListToDo((prev) => {
      return prev.map((todo) => {
        if (todo.id === Item.id) {
          const updatedCheckDone = !todoItemList.checkDone;
          const updatedTodoItems = todo.todoItem.map((todoItem) => {
            if (todoItem.id === todoItemList.id) {
              return {
                ...todoItem,
                checkDone: updatedCheckDone,
              };
            }
            return todoItem;
          });

          const checkDoneCount = updatedTodoItems.filter((i) => i.checkDone).length;
          const percent = Math.round((100 * checkDoneCount) / updatedTodoItems.length) || 0;
          return {
            ...todo,
            todoItem: updatedTodoItems,
            percent,
          };
        }
        return todo;
      });
    });
  };

  const handleAddToDoItem = (nameItem, item) => {
    if (nameItem !== "") {
      const updatedList = listToDo.map((i) => {
        if (i.id === item.id) {
          const newDataItem = {
            id: i.todoItem.length + 1,
            title: nameItem,
            checkDone: false,
          };
          return {
            ...i,
            todoItem: [...i.todoItem, newDataItem],
          };
        }
        return i;
      });
      setListToDo(updatedList);
      setInputTitleToDoItem("");
      ShowCreateToDoItem(item);
    }
  };

  const handleChooseColor = (item) => {
    setChooseColorLabel(item);
  };

  const handleChangeInputLabel = (e) => {
    setInputTitleLabel(e.target.value);
  };

  const handleChangeInputTodo = (e) => {
    setInputTitleToDo(e.target.value);
  };

  const handleChangeInputTodoItem = (e) => {
    setInputTitleToDoItem(e.target.value);
  };

  const handleJoinIntoCard = async (item) => {
    try {
      const isUserJoined = membersInCard?.some((member) => member?.user?.id === item.id);
      const newBtnCard = updatedBtnCard.map((btn) => {
        if (btn.nameBtn === "Leave" && isUserJoined) {
          return {
            ...btn,
            nameBtn: "Join",
            Icon: <PersonAddAltIcon className="ml-1 mr-2" fontSize="small" />,
          };
        } else if (btn.nameBtn === "Join" && !isUserJoined) {
          return {
            ...btn,
            nameBtn: "Leave",
            Icon: <PersonRemoveAlt1OutlinedIcon className="ml-1 mr-2" fontSize="small" />,
          };
        }
        return btn;
      });
      if (isUserJoined) {
        const res = await RemoveUserToCard(dataCard.id, item.id);
        res && setMembersInCard((prev) => prev.filter((p) => p?.user?.id !== item.id));
      } else {
        const res = await JoinToCard(dataCard.id, item.id);
        res && setMembersInCard([...membersInCard, { user: item }]);
      }

      setUpdatedBtnCard(newBtnCard);
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

  const handleClickBtn = (e, item) => {
    setNumberShow(item.id);
    if (item.id === 1) {
      setIsJoin(!isJoin);
      setIsFollowing(!isJoin);
      handleJoinIntoCard(userData);
    } else if ([2, 3, 4, 5, 6, 7, 10].includes(item.id)) {
      handleShowMenuBtnCard(e);
    }
  };

  const handleClickAway = () => {
    handleShowBoardCard(dataCard);
  };

  const loading = !dataCard;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1]">
      <ClickAwayListener onClickAway={handleClickAway}>
        <div
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#fff6 #00000026",
            overflowY: "auto",
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="max-h-[80vh] overflow-y-auto overflow-x-hidden absolute flex flex-col justify-between w-[700px] bg-white rounded-lg font-medium text-xs z-[100]"
        >
          {loading && <Loading className="absolute" />}
          {chooseColorBackground && (
            <div
              style={{
                backgroundImage: chooseColorBackground.startsWith("http") ? `url(${chooseColorBackground})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: chooseColorBackground.startsWith("#") ? chooseColorBackground : "",
              }}
              className={`w-full min-h-[150px] rounded-t-l-[8px]`}
            />
          )}
          <div className="flex justify-between font-medium text-[12px] p-2 z-500">
            <div className="flex-1 p-2">
              <div className="flex p-2">
                <div>
                  <FeaturedPlayListIcon fontSize="small" />
                </div>
                <div className="flex-1 ml-4">
                  <div className="text-[16px] mb-2">{dataCard?.title || "No Title"}</div>
                  <div className="flex items-center text-[12px] mb-6">
                    <span className="mr-2 font-normal">in the list</span>
                    <div className="cursor-pointer text-[12px] px-1 bg-gray-300 rounded-[2px] font-bold">
                      {dataList?.title || "No Title"}
                    </div>
                    {isFollowing && <RemoveRedEyeOutlinedIcon className="ml-2" style={{ fontSize: "16px" }} />}
                  </div>
                  <div className="flex items-center flex-wrap">
                    {membersInCard && membersInCard?.length !== 0 && (
                      <ItemPerson membersInCard={membersInCard} handleShowMenuBtnCard={handleShowMenuBtnCard} />
                    )}
                    {labelOfCard?.length > 0 && (
                      <div className="mr-2 mb-2">
                        <div className="flex items-center text-[12px] mb-2">
                          <span className="mr-2">Label</span>
                        </div>
                        <div className="flex items-center flex-wrap">
                          {labelOfCard.map((item) => (
                            <div
                              key={item.id}
                              style={{
                                backgroundColor: item.color,
                              }}
                              className={`flex items-center justify-center rounded-[4px] min-w-[32px] h-[32px] px-3 py-2 mb-2 mr-1 font-bold text-white text-[12px] `}
                            >
                              {item.name}
                            </div>
                          ))}
                          <div
                            onClick={ShowDetailNewLabel}
                            className="flex items-center justify-center rounded-[50%] w-[32px] h-[32px] px-3 mb-2 mr-1 font-bold text-[12px] bg-gray-200 hover:bg-gray-300"
                          >
                            <AddIcon style={{ fontSize: "20px" }} />
                          </div>
                        </div>
                      </div>
                    )}
                    {endDateCheck != null && (
                      <div className="mr-2 mb-2">
                        <div className="flex items-center text-[12px] mb-2">
                          <span className="mr-2">Expiration date</span>
                        </div>
                        <li className="flex items-center cursor-pointer">
                          <input
                            checked={checkCompleteEndDate}
                            onChange={() => setCheckCompleteEndDate(!checkCompleteEndDate)}
                            type="checkbox"
                            className="w-5 h-5 cursor-pointer"
                          />
                          <span
                            onClick={() => setCheckCompleteEndDate(!checkCompleteEndDate)}
                            className="flex items-center w-full"
                          >
                            <div
                              className={`flex items-center justify-between rounded-[4px] mx-2 p-1 ${checkCompleteEndDate ? "bg-green-200" : checkOverdue ? "bg-red-300" : "bg-gray-300"} hover:opacity-90 cursor-pointer`}
                            >
                              <div className="">{endDateCheck}</div>
                              {checkCompleteEndDate && (
                                <div className="bg-green-500 p-[2px] text-[10px] rounded-[4px] ml-2">complete</div>
                              )}
                              <KeyboardArrowDownIcon fontSize="small" />
                            </div>
                          </span>
                        </li>
                      </div>
                    )}
                    <div className="mr-2 mb-2">
                      <div className="flex items-center text-[12px] mb-2">
                        <span className="mr-2">Notification</span>
                      </div>
                      <ButtonBoardCard
                        onHandleEvent={handleFollowing}
                        isFollowing={isFollowing}
                        isActive={true}
                        nameBtn={"Following"}
                        className={"w-[120px] justify-center bg-gray-200 hover:bg-gray-300"}
                      >
                        <RemoveRedEyeOutlinedIcon className="ml-1 mr-2" fontSize="small" />
                      </ButtonBoardCard>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex p-2">
                <div>
                  <SubjectIcon fontSize="small" />
                </div>
                <div className="flex-1 ml-4">
                  <div className="text-[16px] mb-2">Describe</div>
                  <div className="bg-gray-200 hover:bg-gray-300 cursor-pointer w-full text-[14px] mb-2 p-2 pb-6 rounded-[4px]">
                    <div>Add more detailed description...</div>
                  </div>
                </div>
              </div>
              {/* SHOW ATTACHMENT */}
              <div className="px-2">
                <div className="flex items-center justify-between ">
                  <div className="flex items-center">
                    <AttachmentIcon />
                    <p className="ml-3">Attachment</p>
                  </div>
                  <div>
                    <button onClick={handleOpenAttach} className="px-4 py-1 bg-gray-300 rounded-sm">
                      Add
                    </button>
                    {openAttach && (
                      <div>
                        <UploadPoper handleFileChange={handleFileChange} handleCloseAttach={handleCloseAttach} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-2 ml-6">
                  <Attachment
                    loading={loading}
                    postUploadedFiles={postUploadedFiles}
                    setPostUploadedFiles={setPostUploadedFiles}
                  />
                </div>
              </div>
              {/* WHAT TO DO HIEN THI LEN UI */}
              {listToDo &&
                listToDo.map((item, index) => (
                  <div key={index}>
                    <div className="flex p-2">
                      <div>
                        <CheckBoxOutlinedIcon fontSize="small" />
                      </div>
                      <div className="flex-1 ml-4">
                        <div className="flex justify-between">
                          <div className="text-[16px] mb-2">{item.title}</div>
                          <ButtonBoardCard
                            onHandleEvent={() => handleRemoveToDoList(item)}
                            isActive={true}
                            nameBtn={"Erase"}
                            className={"w-[60px] justify-center bg-gray-200 hover:bg-gray-300"}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center p-2">
                      <div className="w-[12px] mr-1">{item.percent || 0}%</div>
                      <div className="relative ml-4 flex-1 w-full bg-gray-200 h-[8px] rounded-[4px]">
                        <span
                          style={{ width: `${item.percent}%` }}
                          className={`absolute left-0 top-0 bg-blue-500 max-w-full h-[8px] rounded-[4px] index-50`}
                        ></span>
                      </div>
                    </div>
                    <ul>
                      {item.todoItem.map((dataItem, index) => (
                        <li key={index} className="flex items-center my-2 cursor-pointer">
                          <input
                            checked={dataItem.checkDone}
                            onChange={() => handleCheckDoneToDoItem(item, dataItem)}
                            type="checkbox"
                            className="w-5 h-5 mx-2 cursor-pointer"
                          />
                          <span className="flex items-center w-full">
                            <div
                              onClick={() => handleCheckDoneToDoItem(item, dataItem)}
                              className={`flex-1 hover:bg-gray-300 h-[34px] p-2 rounded-[4px] transition-all duration-50`}
                            >
                              <font>{dataItem.title}</font>
                            </div>
                          </span>
                        </li>
                      ))}
                      <div className="mb-8 ml-2">
                        {!item.isCreateItem ? (
                          <ButtonBoardCard
                            onHandleEvent={() => ShowCreateToDoItem(item)}
                            isActive={true}
                            nameBtn={"Add an item"}
                            className={"w-[120px] justify-center bg-gray-200 hover:bg-gray-300"}
                          />
                        ) : (
                          <div>
                            <div className="border-2 border-gray-500 rounded-[2px] mb-4">
                              <input
                                type="text"
                                placeholder="Add an item"
                                value={inputTitleToDoItem}
                                onChange={(e) => handleChangeInputTodoItem(e)}
                                className="w-full bg-white rounded-[2px] text-base font-[200] px-2 py-1 cursor-pointer  focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <ButtonBoardCard
                                  onHandleEvent={() => handleAddToDoItem(inputTitleToDoItem, item)}
                                  isActive={true}
                                  nameBtn={"More"}
                                  className={"w-[80px] justify-center bg-blue-500 text-white hover:bg-blue-600"}
                                />
                                <ButtonBoardCard
                                  onHandleEvent={() => ShowCreateToDoItem(item)}
                                  isActive={true}
                                  nameBtn={"Cancel"}
                                  className={"w-[80px] ml-2 justify-center bg-gray-100 hover:bg-gray-300"}
                                />
                              </div>
                              <div className="flex items-center">
                                <ButtonBoardCard
                                  onHandleEvent={ShowCreateToDoItem}
                                  isActive={true}
                                  nameBtn={"Assign"}
                                  className={"w-[80px] justify-center hover:bg-gray-200"}
                                >
                                  <Person4OutlinedIcon
                                    style={{
                                      fontSize: "18px",
                                      marginRight: "4px",
                                    }}
                                  />
                                </ButtonBoardCard>
                                <ButtonBoardCard
                                  onHandleEvent={ShowCreateToDoItem}
                                  isActive={true}
                                  nameBtn={"Expiration day"}
                                  className={"w-[140px] ml-2 justify-center hover:bg-gray-200"}
                                >
                                  <AccessTimeIcon
                                    style={{
                                      fontSize: "18px",
                                      marginRight: "4px",
                                    }}
                                  />
                                </ButtonBoardCard>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ul>
                  </div>
                ))}

              <div className="flex p-2">
                <div>
                  <FormatListBulletedIcon fontSize="small" />
                </div>
                <div className="flex-1 ml-4">
                  <div className="flex justify-between">
                    <div className="text-[16px] mb-2">Work</div>
                    <ButtonBoardCard
                      isActive={true}
                      nameBtn={"Show details"}
                      className={"w-[100px] justify-center bg-gray-200 hover:bg-gray-300"}
                    />
                  </div>
                  <div className="flex items-center text-[12px] mb-2"></div>
                  <div className="flex items-center text-[12px] mb-2"></div>
                </div>
              </div>
              {/* POST COMMENTS */}
              <div className="flex w-full">
                <WriteComment
                  setEditorInstance={setEditorInstance}
                  setContent={setContent}
                  loading={loading}
                  handleFileChange={handleFileChange}
                  content={content}
                  isSaving={isSaving}
                />
              </div>
              {/* SHOW COMMENT */}
              {listComment?.map((item) => (
                <BoardComments
                  item={item}
                  key={item.id}
                  formatDate={formatDate}
                  handleDeleteComment={handleDeleteComment}
                />
              ))}
            </div>
            <div className="min-w-[180px]">
              <div className="relative flex flex-col items-center mx-2 mt-16 mb-4">
                {updatedBtnCard?.map((item, index) => (
                  <ButtonBoardCard onHandleEvent={(e) => handleClickBtn(e, item)} key={index} nameBtn={item.nameBtn}>
                    {item.Icon}
                  </ButtonBoardCard>
                ))}
              </div>
              <div className="flex items-center text-[12px] mb-2"></div>
              <div className="flex items-center text-[12px] mb-2"></div>
            </div>
          </div>
          <CloseIcon
            onClick={() => handleShowBoardCard(dataCard)}
            className="cursor-pointer absolute right-3 top-3 p-1 rounded-[4px] hover:bg-gray-100 "
          />
        </div>
      </ClickAwayListener>
      {isShowMenuBtnCard && numberShow === 2 && (
        <MemberMenu
          onAddMember={handleAddMember}
          membersInCard={membersInCard}
          setMembersInCard={setMembersInCard}
          handleCloseShowMenuBtnCard={handleCloseShowMenuBtnCard}
        />
      )}
      {isShowMenuBtnCard && numberShow === 3 && (
        <>
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
        </>
      )}
      {isShowMenuBtnCard && numberShow === 4 && (
        <ToDoMenu
          position={position}
          inputTitleToDo={inputTitleToDo}
          handleChangeInputTodo={handleChangeInputTodo}
          handleCreateNewToDoList={handleCreateNewToDoList}
          handleCloseShowMenuBtnCard={handleCloseShowMenuBtnCard}
        />
      )}
      {isShowMenuBtnCard && numberShow === 5 && (
        <CalendarPopper
          position={position}
          handleCloseShowMenuBtnCard={handleCloseShowMenuBtnCard}
          setEndDateCheck={setEndDateCheck}
          dataCard={dataCard}
        />
      )}
      {isShowMenuBtnCard && numberShow === 6 && (
        <UploadFile
          position={position}
          handleFileChange={handleFileChange}
          handleCloseShowMenuBtnCard={handleCloseShowMenuBtnCard}
        />
      )}
      {isShowMenuBtnCard && numberShow === 7 && (
        <BackgroundPhoto
          position={position}
          handleCloseShowMenuBtnCard={handleCloseBtnPhoto}
          ShowDetailNewLabel={ShowDetailNewLabel}
          background={chooseColorBackground}
          chooseBackground={handleChooseColorBackground}
          postUploadedFiles={postUploadedFiles}
          setPostUploadedFiles={setPostUploadedFiles}
          handleUploadFile={handleFileChange}
        />
      )}
    </div>
  );
};
