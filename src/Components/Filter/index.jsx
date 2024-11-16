import { ClickAwayListener } from "@mui/material";
import { memo, useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import BookmarksOutlinedIcon from "@mui/icons-material/BookmarksOutlined";

import { useListBoardContext } from "../../Pages/ListBoard/ListBoardContext";
import { expirations } from "./constans";

function Filter({ onClose }) {
  const { listCount, setListCount } = useListBoardContext();
  const [list] = useState(listCount);
  const [countMember, setCountMember] = useState([]);
  const [countLabel, setCountLabel] = useState([]);
  const [choosedLabel, setChoosedLabel] = useState([]);
  const [choosedMember, setChoosedMember] = useState([]);
  const [choosedNoMember, setChoosedNoMember] = useState(false);
  const [choosedDate, setChoosedDate] = useState([]);
  const [choosedNoLabel, setChoosedNoLabel] = useState(false);

  const handleClickAway = () => {
    onClose();
  };

  const handleClickNoMember = () => {
    setChoosedNoMember(!choosedNoMember);
  };

  useEffect(() => {
    if (choosedNoMember) {
      const updateList = list.map((item) => {
        const updatedCards = item?.cards?.filter((card) => {
          return card?.members?.length === 0;
        });
        return { ...item, cards: updatedCards };
      });

      setListCount(updateList);
    } else {
      setListCount(list);
    }
  }, [setListCount, list, choosedNoMember]);

  const handleAddDate = (item) => {
    setChoosedDate((prev) => {
      const itemExists = prev.findIndex((p) => p.id === item.id) !== -1;
      return itemExists
        ? prev.filter((p) => p.id !== item.id)
        : [...prev, item];
    });
  };

  useEffect(() => {
    const today = new Date();

    const updateList =
      choosedDate.length === 0
        ? list
        : list.map((listItem) => {
            const filteredCards = listItem.cards?.filter((card) =>
              choosedDate.some((date) => {
                if (date.id === 1) {
                  return card?.endDate === null;
                }
                if (date.id === 2) {
                  return card?.endDate && new Date(card.endDate) < today;
                }
                if (date.id === 3) {
                  return card?.endDate === null;
                }
                if (date.id === 4) {
                  return card?.endDate && new Date(card.endDate) >= today;
                }
                return date;
              })
            );
            return { ...listItem, cards: filteredCards };
          });

    setListCount(updateList);
  }, [choosedDate, list, setListCount]);

  const handleClickNoLabel = () => {
    setChoosedNoLabel(!choosedNoLabel);
  };

  useEffect(() => {
    if (choosedNoLabel) {
      const updateList = list.map((item) => {
        const updatedCards = item?.cards?.filter((card) => {
          return card?.tagCards?.length === 0;
        });
        return { ...item, cards: updatedCards };
      });

      setListCount(updateList);
    } else {
      setListCount(list);
    }
  }, [setListCount, list, choosedNoLabel]);

  const handleAddLabel = (item) => {
    setChoosedLabel((prev) => {
      const itemExists = prev.findIndex((p) => p.id === item.id) !== -1;
      return itemExists
        ? prev.filter((p) => p.id !== item.id)
        : [...prev, item];
    });
  };

  useEffect(() => {
    const updateList =
      choosedLabel.length === 0
        ? list
        : list.map((listItem) => {
            const filteredCards = listItem.cards?.filter((card) =>
              choosedLabel.some((label) =>
                card?.tagCards?.some(
                  (cardLabel) => cardLabel?.tag?.id === label.id
                )
              )
            );
            return { ...listItem, cards: filteredCards };
          });

    setListCount(updateList);
  }, [choosedLabel, list, setListCount]);

  const handleAddMember = (item) => {
    setChoosedMember((prev) => {
      const itemExists = prev.findIndex((p) => p.id === item.id) !== -1;
      return itemExists
        ? prev.filter((p) => p.id !== item.id)
        : [...prev, item];
    });
  };

  useEffect(() => {
    const updateList =
      choosedMember.length === 0
        ? list
        : list.map((listItem) => {
            const filteredCards = listItem?.cards?.filter((card) =>
              choosedMember.some((member) =>
                card?.members?.some(
                  (cardMember) => cardMember?.user?.id === member.id
                )
              )
            );
            return { ...listItem, cards: filteredCards };
          });

    setListCount(updateList);
  }, [choosedMember, list, setListCount]);

  useEffect(() => {
    const handleGetData = () => {
      list.forEach((list) => {
        list?.cards?.forEach((card) => {
          const members = card?.members;
          if (members.length > 0) {
            members.forEach((member) => {
              setCountMember((prev) => {
                const userExists =
                  prev.findIndex((p) => p.id === member?.user?.id) !== -1;
                if (!userExists) {
                  return [...prev, member?.user];
                }
                return prev;
              });
            });
          }

          const labels = card?.tagCards;
          if (labels) {
            labels.forEach((label) => {
              setCountLabel((prev) => {
                const labelExists =
                  prev.findIndex((p) => p.id === label?.tag?.id) !== -1;
                if (!labelExists) {
                  return [...prev, label?.tag];
                }
                return prev;
              });
            });
          }
        });
      });
    };
    handleGetData();
  }, [list]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className="absolute w-[250px] bg-white rounded-[8px] py-2 font-[600] text-[14px] text-[#44546f] z-50 shadow-[0_3px_10px_rgba(0,0,0,0.3)]">
        <div className="text-center p-2 mx-8">Filter</div>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          <div className="mx-3 ">
            <div className="py-2 font-[600] text-[12px]">Keywords</div>
            <div className="border-[1px] border-gray-500 rounded-[2px]">
              <input
                type="text"
                placeholder="Enter keyword..."
                className="w-full bg-white rounded-[2px] font-[400] text-[14px] px-2 py-1 cursor-pointer  focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="font-[400] text-[11px]">
              Search for tags, members, labels, and more.
            </div>

            <div className="py-2 font-[600] text-[12px]">Members</div>
            <div className="flex flex-col">
              <div className="flex items-center py-2 pl-2 cursor-pointer">
                <input
                  checked={choosedNoMember}
                  onChange={handleClickNoMember}
                  type="checkbox"
                  className="w-4 h-4 mr-2 cursor-pointer"
                />
                <span
                  onClick={handleClickNoMember}
                  className="flex items-center w-full"
                >
                  <div className="flex items-center flex-wrap mx-1">
                    <div className="flex items-center justify-center rounded-[50%] w-[24px] h-[24px] px-3 mr-[2px] font-medium text-[10px] bg-gray-200">
                      <PersonOutlineOutlinedIcon
                        style={{
                          width: "16px",
                          height: "16px",
                          color: "#44546f"
                        }}
                      />
                    </div>
                  </div>
                  <div className="font-[400] text-[14px]">No member</div>
                </span>
              </div>
              {countMember?.length > 0 &&
                countMember?.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center py-2 pl-2 cursor-pointer"
                  >
                    <input
                      checked={choosedMember.some((i) => i.id === member.id)}
                      onChange={() => handleAddMember(member)}
                      type="checkbox"
                      className="w-4 h-4 mr-2 cursor-pointer"
                    />
                    <span
                      onClick={() => handleAddMember(member)}
                      className="flex items-center w-full"
                    >
                      <div className="flex items-center flex-wrap mx-1">
                        <div className="flex items-center justify-center rounded-[50%] w-[24px] h-[24px] px-3 mr-[2px] font-medium text-white text-[10px] bg-gradient-to-b from-green-400 to-blue-500">
                          PM
                        </div>
                      </div>
                      <div className="font-[400] text-[14px]">
                        {member?.name}
                      </div>
                    </span>
                  </div>
                ))}
            </div>

            <div className="py-2 font-[600] text-[12px]">Expiration date</div>
            <div className="flex flex-col">
              {expirations.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center py-2 pl-2 cursor-pointer"
                >
                  <input
                    checked={choosedDate.some((i) => i.id === item.id)}
                    onChange={() => handleAddDate(item)}
                    type="checkbox"
                    className="w-4 h-4 mr-2 cursor-pointer"
                  />
                  <span
                    onClick={() => handleAddDate(item)}
                    className="flex items-center w-full"
                  >
                    <div className="flex items-center flex-wrap mx-1">
                      {item.Icon ? (
                        <div
                          className={`flex items-center justify-center rounded-[50%] w-[24px] h-[24px] px-3 mr-[2px] font-medium text-white text-[10px] ${item.color ? item.color : "bg-gray-200"}`}
                        >
                          {item.Icon}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="font-[400] text-[14px]">{item.name}</div>
                  </span>
                </div>
              ))}
            </div>

            <div className="py-2 font-[600] text-[12px]">Label</div>
            <div className="flex flex-col">
              <div className="flex items-center py-2 pl-2 cursor-pointer">
                <input
                  checked={choosedNoLabel}
                  onChange={handleClickNoLabel}
                  type="checkbox"
                  className="w-4 h-4 mr-2 cursor-pointer"
                />
                <span
                  onClick={handleClickNoLabel}
                  className="flex items-center w-full"
                >
                  <div className="flex items-center flex-wrap mx-1">
                    <div className="flex items-center justify-center rounded-[50%] w-[24px] h-[24px] px-3 mr-[2px] font-medium text-[10px] bg-gray-200">
                      <BookmarksOutlinedIcon
                        style={{ width: "16px", height: "16px" }}
                      />
                    </div>
                  </div>
                  <div className="font-[400] text-[14px]">No label</div>
                </span>
              </div>

              {countLabel?.length > 0 &&
                countLabel?.map((label) => (
                  <div
                    key={label?.id}
                    className="flex items-center py-2 pl-2 cursor-pointer"
                  >
                    <input
                      checked={choosedLabel.some((i) => i.id === label.id)}
                      onChange={() => handleAddLabel(label)}
                      type="checkbox"
                      className="w-4 h-4 mr-2 cursor-pointer"
                    />
                    <span className="flex items-center w-full">
                      <div
                        onClick={() => handleAddLabel(label)}
                        style={{
                          backgroundColor: label?.color,
                          color: "#ffffff"
                        }}
                        className={`flex-1 flex items-center hover:opacity-90 h-[34px] p-2 rounded-[4px] transition-all duration-50`}
                      >
                        <font>{label?.name}</font>
                      </div>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <CloseIcon
          className="cursor-pointer absolute right-3 top-3 p-1 rounded-[4px] hover:bg-gray-100"
          onClick={onClose}
        />
      </div>
    </ClickAwayListener>
  );
}

export default memo(Filter);
