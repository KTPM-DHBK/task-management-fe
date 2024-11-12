import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import React from "react";

import { CreateItem } from "../../../Components/CreateItem";
import { AddIcon, TemplateCardIcon } from "../../../Components/Icons";
import ConvertHiDotsVertical from "../../../Components/HiDotsVertical";
import ItemList from "../../../Components/ItemList";
import TippyDetail from "../../TippyDetail";
import { useListBoardContext } from "../../../Pages/ListBoard/ListBoardContext";

import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UpdateList } from "../../../Services/API/ApiListOfBoard";

function List({ item = {}, id }) {
  const cards = item.cards || [];

  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: id,
    data: { ...item, type: "column" },
  });
  const dndKitColumStyles = {
    transform: CSS.Translate.toString(transform),
    height: "100%",
  };

  let {
    boardId,
    nameTitle,
    activeMonitor,
    activeIndex,
    handleChange,
    handleShowAddCard,
    handleAddCard,
    handleChangeTitleCard,
  } = useListBoardContext();

  const handleClickOutside = async (event) => {
    if (event.target.value) {
      const dataList = {
        title: event.target.value.trim(),
        description: item?.description,
        boardId: boardId,
      };
      try {
        await UpdateList(boardId, id, dataList);
      } catch (error) {
        console.error("Failed to create list:", error);
      }
    }
  };
  return (
    <div ref={setNodeRef} style={dndKitColumStyles} {...attributes}>
      <div {...listeners} className="px-[8px]">
        <div className="flex flex-col w-[248px] max-h-[75vh] bg-gray-100 rounded-[12px] p-1 transition-opacity duration-300  ">
          <div className="flex p-1 items-center bg-gray-100">
            <input
              type="text"
              value={item.title}
              onChange={(e) => handleChange(e, item.id)}
              onBlur={(e) => handleClickOutside(e)}
              className="flex-1 min-w-0 mr-2 bg-gray-100 rounded-[8px] text-[14px] font-[600] px-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {activeMonitor.includes(item.id) && <RemoveRedEyeOutlinedIcon className="p-1" />}
            <ConvertHiDotsVertical
              tippyName="Operation"
              data={item}
              className={
                "cursor-pointer p-2 group-hover:opacity-100 hover:bg-gray-300 rounded-[8px] transition-opacity duration-300"
              }
            />
          </div>
          {/* List board */}
          <SortableContext strategy={verticalListSortingStrategy} items={cards}>
            <div className="flex-1 p-1">
              {cards?.map((card, index) => {
                return (
                  <ItemList
                    id={card.id}
                    key={card.id}
                    dataList={item}
                    dataCard={card}
                    imageSrc
                    isDescriptionIcon
                    Attachments={[1]}
                  />
                );
              })}
            </div>
          </SortableContext>

          {item.isShowAddCard && activeIndex === item.id && (
            <CreateItem
              idList={item.id}
              nameBtn={"Add card"}
              descriptionCard={nameTitle}
              placeHolderText={"Enter title or paste link"}
              onAdd={handleAddCard}
              onShow={() => handleShowAddCard(item.id)}
              onChangeTitle={handleChangeTitleCard}
            />
          )}

          {!item.isShowAddCard && (
            <div className="flex p-1 items-center pt-[8px]">
              <div
                onClick={() => handleShowAddCard(item.id)}
                className="flex flex-1 items-center rounded-[8px] hover:bg-gray-300 cursor-pointer"
              >
                <div className="p-2 transition-opacity duration-300">
                  <AddIcon width={16} height={16} />
                </div>
                <div className="text-[14px] font-medium">Add card</div>
              </div>
              <TippyDetail title={"Create from template..."}>
                <div>
                  <TemplateCardIcon
                    width={32}
                    height={32}
                    className={
                      "cursor-pointer p-2 group-hover:opacity-100 hover:bg-gray-300 rounded-[8px] transition-opacity duration-300"
                    }
                  />
                </div>
              </TippyDetail>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(List);
