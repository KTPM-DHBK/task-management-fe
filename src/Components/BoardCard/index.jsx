import {
  Close as CloseIcon,
  FeaturedPlayList as FeaturedPlayListIcon,
  Subject as SubjectIcon,
  FormatListBulleted as FormatListBulletedIcon,
  RemoveRedEyeOutlined as RemoveRedEyeOutlinedIcon,
  PersonAddAlt as PersonAddAltIcon,
  Person4Outlined as Person4OutlinedIcon,
  Label as LabelIcon,
  CheckBoxOutlined as CheckBoxOutlinedIcon,
  AccessTimeOutlined as AccessTimeOutlinedIcon,
  AttachmentOutlined as AttachmentOutlinedIcon,
  InsertPhoto as InsertPhotoIcon,
  Crop169 as Crop169Icon,
  ArrowForwardOutlined as ArrowForwardOutlinedIcon,
  ContentCopyOutlined as ContentCopyOutlinedIcon,
  SaveAsOutlined as SaveAsOutlinedIcon,
  BackupTableOutlined as BackupTableOutlinedIcon,
  ShareOutlined as ShareOutlinedIcon,
  Add as AddIcon,
  ModeEdit as ModeEditIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { Divider } from "@mui/material";

import { ButtonBoardCard } from "../ButtonBoardCard";
import ItemMenu from "../ItemMenu";
import MemberMenu from "../MemberMenuOfBoard";
import ToDoMenu from "../ToDoMenuOfBoard";
import Calendar from "../Calendar";

export const BoardCard = ({ data, onShowBoardCard }) => {
  const listBtnCard = [
    {
      id: 1,
      nameBtn: "Join",
      Icon: <PersonAddAltIcon className="mr-2 ml-1" fontSize="small" />,
    },
    {
      id: 2,
      nameBtn: "Member",
      Icon: <Person4OutlinedIcon className="mr-2 ml-1" fontSize="small" />,
    },
    {
      id: 3,
      nameBtn: "Label",
      Icon: <LabelIcon className="mr-2 ml-1" fontSize="small" />,
    },
    {
      id: 4,
      nameBtn: "What to do",
      Icon: <CheckBoxOutlinedIcon className="mr-2 ml-1" fontSize="small" />,
    },
    {
      id: 5,
      nameBtn: "Day",
      Icon: <AccessTimeOutlinedIcon className="mr-2 ml-1" fontSize="small" />,
    },
    {
      id: 6,
      nameBtn: "Attached",
      Icon: <AttachmentOutlinedIcon className="mr-2 ml-1" fontSize="small" />,
    },
    {
      id: 7,
      nameBtn: "Cover photo",
      Icon: <InsertPhotoIcon className="mr-2 ml-1" fontSize="small" />,
    },
    {
      id: 8,
      nameBtn: "Custom Fields",
      Icon: <Crop169Icon className="mr-2 ml-1" fontSize="small" />,
    },
    {
      id: 9,
      nameBtn: "Move",
      Icon: <ArrowForwardOutlinedIcon className="mr-2 ml-1" fontSize="small" />,
    },
    {
      id: 10,
      nameBtn: "Copy",
      Icon: <ContentCopyOutlinedIcon className="mr-2 ml-1" fontSize="small" />,
    },
    {
      id: 11,
      nameBtn: "Create a template",
      Icon: <SaveAsOutlinedIcon className="mr-2 ml-1" fontSize="small" />,
    },
    {
      id: 12,
      nameBtn: "Storage",
      Icon: <BackupTableOutlinedIcon className="mr-2 ml-1" fontSize="small" />,
    },
    {
      id: 13,
      nameBtn: "Share",
      Icon: <ShareOutlinedIcon className="mr-2 ml-1" fontSize="small" />,
    },
  ];
  const listLabelAdd = [
    {
      id: 2,
      title: "Back End",
      color: "bg-yellow-300",
    },
    {
      id: 3,
      title: "Front End",
      color: "bg-orange-300",
    },
    {
      id: 4,
      title: "",
      color: "bg-red-300",
    },
  ];
  const listColorLabel = [
    {
      id: 1,
      title: "light green",
      color: "bg-green-300",
    },
    {
      id: 2,
      title: "pale yellow",
      color: "bg-yellow-300",
    },
    {
      id: 3,
      title: "light orange",
      color: "bg-orange-300",
    },
    {
      id: 4,
      title: "light red",
      color: "bg-red-300",
    },

    {
      id: 5,
      title: "green",
      color: "bg-green-500",
    },
    {
      id: 6,
      title: "yellow",
      color: "bg-yellow-500",
    },
    {
      id: 7,
      title: "orange",
      color: "bg-orange-500",
    },
    {
      id: 8,
      title: "red",
      color: "bg-red-500",
    },

    {
      id: 9,
      title: "dark green",
      color: "bg-green-700",
    },
    {
      id: 10,
      title: "dark yellow",
      color: "bg-yellow-700",
    },
    {
      id: 11,
      title: "dark orange",
      color: "bg-orange-700",
    },
    {
      id: 12,
      title: "dark red",
      color: "bg-red-700",
    },

    {
      id: 13,
      title: "light blue",
      color: "bg-blue-300",
    },
    {
      id: 14,
      title: "light pink",
      color: "bg-pink-300",
    },
    {
      id: 15,
      title: "light black",
      color: "bg-gray-300",
    },
    {
      id: 16,
      title: "light purple",
      color: "bg-purple-300",
    },
    {
      id: 17,
      title: "blue",
      color: "bg-blue-500",
    },
    {
      id: 18,
      title: "pink",
      color: "bg-pink-500",
    },
    {
      id: 19,
      title: "black",
      color: "bg-gray-500",
    },
    {
      id: 20,
      title: "purple",
      color: "bg-purple-500",
    },
    {
      id: 21,
      title: "dark blue",
      color: "bg-blue-700",
    },
    {
      id: 22,
      title: "dark pink",
      color: "bg-pink-700",
    },
    {
      id: 23,
      title: "dark black",
      color: "bg-gray-700",
    },
    {
      id: 24,
      title: "dark purple",
      color: "bg-purple-700",
    },
  ];

  //! Sửa lại dùng form
  const [listLabel, setListLabel] = useState(listLabelAdd);
  const [listToDo, setListToDo] = useState([]);
  const [countMember, setCountMember] = useState([]);
  const [countLabel, setCountLabel] = useState([]);
  const [chooseColorLabel, setChooseColorLabel] = useState(listColorLabel[0]);
  const [inputTitleLabel, setInputTitleLabel] = useState("");
  const [inputTitleToDo, setInputTitleToDo] = useState("What to do");
  const [inputTitleToDoItem, setInputTitleToDoItem] = useState("");
  const [numberShow, setNumberShow] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCreateLabel, setIsCreateLabel] = useState(false);
  const [isUpdateLabel, setIsUpdateLabel] = useState(false);
  const [isShowMenuBtnCard, setIsShowMenuBtnCard] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isJoin, setIsJoin] = useState(false);

  const handleFollowing = () => {
    setIsFollowing(!isFollowing);
  };

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

  const ShowDetailNewLabel = () => {
    setIsCreateLabel(!isCreateLabel);
    if (isUpdateLabel) {
      setIsUpdateLabel(!isUpdateLabel);
    }
  };

  const ShowUpdateLabel = (item) => {
    ShowDetailNewLabel();
    setIsUpdateLabel(!isUpdateLabel);
    setChooseColorLabel(item);
    setInputTitleLabel(item.title);
  };

  const handleCreateNewLabel = (dataColor, titleLabel = "") => {
    const dataLabel = {
      id: dataColor.id,
      title: titleLabel,
      color: dataColor.color,
    };
    setListLabel((prev) => {
      if (prev.some((item) => item.id === dataLabel.id)) {
        const itemLabel = prev.find((item) => item.id === dataLabel.id);
        if (itemLabel.title !== dataLabel.title) {
          return prev.map((item) => (item.id === dataLabel.id ? { ...item, title: dataLabel.title } : item));
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

  const handleAddLabel = (item) => {
    setCountLabel((prevCountLabel) => {
      if (prevCountLabel.some((i) => i.id === item.id)) {
        return prevCountLabel.filter((i) => i.id !== item.id);
      } else {
        return [...prevCountLabel, item];
      }
    });
  };

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

  const handleAddMember = (id) => {
    if (countMember.includes(id)) {
      setCountMember(countMember.filter((i) => i !== id));
      listBtnCard.forEach((item) => {
        if (item.id === 1) {
          item.nameBtn = "Join";
        }
      });
    } else {
      setCountMember([...countMember, id]);
      listBtnCard.forEach((item) => {
        if (item.id === 1) {
          item.nameBtn = "Leave";
        }
      });
    }
  };

  const handleClickBtn = (e, item) => {
    setNumberShow(item.id);
    switch (item.id) {
      case 1:
        setIsJoin(!isJoin);
        setIsFollowing(!isJoin);
        handleAddMember(item.id);
        break;
      case 2:
      case 3:
      case 4:
      case 5:
        handleShowMenuBtnCard(e);
        break;
      default:
        break;
    }
  };
  return (
    <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50 overflow-auto z-50">
      <div className="mt-20 mb-10">
        <div className="relative flex justify-between min-w-[700px] bg-white rounded-[8px] p-2 font-medium text-[12px] z-500">
          <div className="flex-1 p-2">
            <div className="flex p-2">
              <div>
                <FeaturedPlayListIcon fontSize="small" />
              </div>
              <div className="ml-4 flex-1">
                <div className="text-[16px] mb-2">KTPM</div>
                <div className="flex items-center text-[12px] mb-6">
                  <span className="mr-2 font-normal">in the list</span>
                  <div className="cursor-pointer text-[12px] px-1 bg-gray-300 rounded-[2px] font-bold">
                    {data.descriptionCard}
                  </div>
                  {isFollowing && <RemoveRedEyeOutlinedIcon className="ml-2" style={{ fontSize: "16px" }} />}
                </div>
                <div className="flex items-center">
                  {countMember.length !== 0 && (
                    <div className="mr-2">
                      <div className="flex items-center text-[12px] mb-2">
                        <span className="mr-2">Member</span>
                      </div>
                      <div className="relative flex items-center justify-center">
                        {countMember.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-center rounded-[50%] w-[32px] h-[32px] px-3 mr-1 font-bold text-white text-[12px] bg-gradient-to-b from-green-400 to-blue-500"
                          >
                            PM
                          </div>
                        ))}
                        <div
                          onClick={handleShowMenuBtnCard}
                          className="flex items-center justify-center rounded-[50%] w-[32px] h-[32px] px-3 mr-1 font-bold text-[12px] bg-gray-200 hover:bg-gray-300"
                        >
                          <AddIcon style={{ fontSize: "20px" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  {countLabel.length !== 0 && (
                    <div className="mr-2">
                      <div className="flex items-center text-[12px] mb-2">
                        <span className="mr-2">Label</span>
                      </div>
                      <div className="relative flex items-center justify-center">
                        {countLabel.map((item, index) => (
                          <div
                            key={item.id}
                            className={`${item.color} flex items-center justify-center rounded-[4px] h-[32px] px-3 mr-1 font-bold text-white text-[12px] `}
                          >
                            {item.title}
                          </div>
                        ))}
                        <div
                          onClick={ShowDetailNewLabel}
                          className="flex items-center justify-center rounded-[50%] w-[32px] h-[32px] px-3 mr-1 font-bold text-[12px] bg-gray-200 hover:bg-gray-300"
                        >
                          <AddIcon style={{ fontSize: "20px" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="mr-2">
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
                      <RemoveRedEyeOutlinedIcon className="mr-2 ml-1" fontSize="small" />
                    </ButtonBoardCard>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex p-2">
              <div>
                <SubjectIcon fontSize="small" />
              </div>
              <div className="ml-4 flex-1">
                <div className="text-[16px] mb-2">Describe</div>
                <div className="bg-gray-200 hover:bg-gray-300 cursor-pointer w-full text-[14px] mb-2 p-2 pb-6 rounded-[4px]">
                  <div>Add more detailed description...</div>
                </div>
              </div>
            </div>
            {listToDo &&
              listToDo.map((item, index) => (
                <div key={index}>
                  <div className="flex p-2">
                    <div>
                      <CheckBoxOutlinedIcon fontSize="small" />
                    </div>
                    <div className="ml-4 flex-1">
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
                    <div className="ml-2 mb-8">
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
                                <Person4OutlinedIcon style={{ fontSize: "18px", marginRight: "4px" }} />
                              </ButtonBoardCard>
                              <ButtonBoardCard
                                onHandleEvent={ShowCreateToDoItem}
                                isActive={true}
                                nameBtn={"Expiration day"}
                                className={"w-[140px] ml-2 justify-center hover:bg-gray-200"}
                              >
                                <AccessTimeIcon style={{ fontSize: "18px", marginRight: "4px" }} />
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
              <div className="ml-4 flex-1">
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
          </div>
          <div className="min-w-[180px]">
            <div className="relative flex items-center flex-col mt-16 mb-4 mx-2">
              {listBtnCard.map((item, index) => (
                <ButtonBoardCard onHandleEvent={(e) => handleClickBtn(e, item)} key={index} nameBtn={item.nameBtn}>
                  {item.Icon}
                </ButtonBoardCard>
              ))}
            </div>
          </div>
          <CloseIcon
            onClick={onShowBoardCard}
            className="cursor-pointer absolute right-3 top-3 p-1 rounded-[4px] hover:bg-gray-100 "
          />
        </div>
      </div>
      {isShowMenuBtnCard && numberShow === 2 && (
        <MemberMenu position={position} handleCloseShowMenuBtnCard={handleCloseShowMenuBtnCard} />
      )}
      {isShowMenuBtnCard && numberShow === 3 && (
        <>
          {/* //! Tách component */}
          {!isCreateLabel && (
            <div
              style={{ top: position.top, left: position.left }}
              className="absolute w-[250px] bg-white rounded-[8px] py-2 font-medium text-[12px] z-50 shadow-[0_3px_10px_rgba(0,0,0,0.3)]"
            >
              <div className="text-center p-2 mx-8">Label</div>
              <div className="mx-2">
                <div className="mx-1 border-2 border-gray-500 rounded-lg">
                  <input
                    type="text"
                    // value={item.descriptionCard}
                    // onChange={(e) => handleChange(e, index)}
                    placeholder="Find the label..."
                    className="w-full bg-white rounded-lg text-base font-[200] px-2 py-1 cursor-pointer  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mt-2">
                  <div className="py-2 bg-white">Label</div>
                  <ul>
                    {listLabel.map((item, index) => (
                      <li key={index} className="flex items-center my-2 cursor-pointer">
                        <input
                          checked={countLabel.some((i) => i.id === item.id)}
                          onChange={() => handleAddLabel(item)}
                          type="checkbox"
                          className="w-5 h-5 mx-2 cursor-pointer"
                        />
                        <span className="flex items-center w-full">
                          <div
                            onClick={() => handleAddLabel(item)}
                            className={`flex-1 hover:opacity-90 ${item.color} h-[34px] p-2 rounded-[4px] transition-all duration-50`}
                          >
                            <font>{item.title}</font>
                          </div>
                          <div
                            onClick={() => ShowUpdateLabel(item)}
                            className=" hover:bg-gray-300 p-2 ml-2 rounded-[4px]"
                          >
                            <ModeEditIcon style={{ fontSize: "16px" }} />
                          </div>
                        </span>
                      </li>
                    ))}
                    <div className="mt-4">
                      <ButtonBoardCard
                        onHandleEvent={ShowDetailNewLabel}
                        nameBtn="Create new label"
                        isActive={true}
                        className={"justify-center bg-gray-200 hover:bg-gray-300"}
                      />
                    </div>
                  </ul>
                </div>
                <CloseIcon
                  onClick={handleCloseShowMenuBtnCard}
                  className="cursor-pointer absolute right-3 top-3 p-1 rounded-[4px] hover:bg-gray-100 "
                />
              </div>
            </div>
          )}
          {isCreateLabel && (
            <div style={{ top: position.top - 100, left: position.left }} className="absolute">
              <ItemMenu title={"Label"} onLeaveBoard={handleCloseShowMenuBtnCard} onToggleCollape={ShowDetailNewLabel}>
                <div className="flex items-center justify-center bg-gray-100 h-[60px]">
                  {chooseColorLabel ? (
                    <div className={`${chooseColorLabel.color} w-[80%] h-[32px] p-2 rounded-[4px]`}>
                      <font>{inputTitleLabel}</font>
                    </div>
                  ) : (
                    <div className={`${listColorLabel[0].color} w-[80%] h-[32px] p-2 rounded-[4px]`}>
                      <font>{inputTitleLabel}</font>
                    </div>
                  )}
                </div>
                <div className="mx-2">
                  <div className="py-2 bg-white">Title</div>
                  <div className="border-2 border-gray-500 rounded-[2px]">
                    <input
                      type="text"
                      value={inputTitleLabel}
                      onChange={(e) => handleChangeInputLabel(e)}
                      className="w-full bg-white rounded-[2px] text-base font-[200] px-2 py-1 cursor-pointer  focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="mt-2">
                    <div className="py-2 bg-white">Select a color</div>
                    <ul className="flex items-center justify-center flex-wrap">
                      {/* <li className="w-12 h-8 bg-red-500 rounded-[4px] mr-1 mb-1 "></li> */}
                      {listColorLabel.map((item, index) => (
                        <li
                          onClick={() => handleChooseColor(item)}
                          key={index}
                          className={`w-12 h-8 ${item.color} rounded-[4px] mr-1 mb-1 ${chooseColorLabel.id === item.id && "border-[3px] border-gray-500 shadow-[0_3px_10px_rgba(0,0,0,0.3)]"}`}
                        ></li>
                      ))}
                    </ul>
                  </div>
                  <div className="my-4">
                    <ButtonBoardCard
                      onHandleEvent={ShowDetailNewLabel}
                      nameBtn="Remove color"
                      isActive={true}
                      className={"justify-center bg-gray-200 hover:bg-gray-300"}
                    />
                  </div>
                  <Divider />
                  {!isUpdateLabel ? (
                    <div className="mt-4">
                      <ButtonBoardCard
                        onHandleEvent={() => handleCreateNewLabel(chooseColorLabel, inputTitleLabel)}
                        nameBtn="Create new"
                        isActive={true}
                        className={"w-[100px] bg-blue-500 justify-center text-white hover:opacity-90"}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-4">
                      <ButtonBoardCard
                        onHandleEvent={() => handleCreateNewLabel(chooseColorLabel, inputTitleLabel)}
                        nameBtn="Save"
                        isActive={true}
                        className={"w-[100px] bg-blue-500 justify-center text-white hover:opacity-90"}
                      />
                      <ButtonBoardCard
                        onHandleEvent={() => handleCreateNewLabel(chooseColorLabel, inputTitleLabel)}
                        nameBtn="Remove"
                        isActive={true}
                        className={"w-[100px] bg-red-500 justify-center text-white hover:opacity-90"}
                      />
                    </div>
                  )}
                </div>
              </ItemMenu>
            </div>
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
        <div
          style={{ top: position.top - 200, left: position.left }}
          className="absolute w-[250px] bg-white rounded-[8px] py-2 font-medium text-[12px] z-50 shadow-[0_3px_10px_rgba(0,0,0,0.3)]"
        >
          <div className="text-center p-2 mx-8">Day</div>
          <div className="mx-2">
            <div className="py-2 px-1">
              {/*//! Dùng thư viện  */}
              <Calendar />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Start date</label>
                <input
                  type="text"
                  value="N/T/NNNN"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Expiration date</label>
                <input
                  type="text"
                  value="18/10/2024"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300"
                />
                <input
                  type="text"
                  value="19:33"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300"
                />
              </div>
              <button className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                Set Reminder
              </button>
              <button className="w-full mt-4 bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                Save
              </button>
            </div>
            <CloseIcon
              onClick={handleCloseShowMenuBtnCard}
              className=" cursor-pointer absolute right-3 top-3 p-1 rounded-[4px] hover:bg-gray-100 "
            />
          </div>
        </div>
      )}
    </div>
  );
};
