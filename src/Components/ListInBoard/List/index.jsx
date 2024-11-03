import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import React from "react";

import { CreateItem } from "../../../Components/CreateItem";
import { AddIcon, TemplateCardIcon } from "../../../Components/Icons";
import ConvertHiDotsVertical from "../../../Components/HiDotsVertical";
import ItemList from "../../../Components/ItemList";
import TippyDetail from "../../TippyDetail";
import { useListBoardContext } from "../../../Pages/ListBoard/ListBoardContext";
import { useDroppable } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";

function List({ item = [], id }) {
  const { setNodeRef } = useDroppable({ id });

  const cards = item.cards || [];

  let { nameTitle, activeMonitor, activeIndex, handleChange, handleShowAddCard, handleAddCard, handleChangeTitleCard } =
    useListBoardContext();
  return (
    <SortableContext id={id} items={cards} strategy={rectSortingStrategy}>
      <div ref={setNodeRef} className="px-[8px]">
        <div className="flex flex-col w-[248px] max-h-[75vh] bg-gray-100 rounded-[12px] p-1 transition-opacity duration-300  ">
          <div className="flex p-1 items-center bg-gray-100">
            <input
              type="text"
              value={item.title}
              onChange={(e) => handleChange(e, item.id)}
              className="flex-1 min-w-0 mr-2 bg-gray-100 rounded-[8px] text-[16px] font-[500] px-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#fff6 #00000026",
            }}
            className="flex-1 p-1"
          >
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
                <div className=" rounded-[4px] p-2 hover:bg-gray-300 transition-opacity duration-300">
                  <AddIcon width={16} height={16} />
                </div>
                <div className="text-[16px] font-medium">Add card</div>
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
    </SortableContext>
  );
}

export default React.memo(List);
