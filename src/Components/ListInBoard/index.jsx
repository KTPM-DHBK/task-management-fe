import React from "react";

import { CreateItem } from "../../Components/CreateItem";
import { AddIcon } from "../../Components/Icons";
import { useListBoardContext } from "../../Pages/ListBoard/ListBoardContext";
import List from "./List";
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { arrayMove, insertAtIndex, removeAtIndex } from "../../Utils/array";

function ListInBoard() {
  let { nameTitle, isShowAddList, listCount, setListCount, handleShowAddList, handleAddList, handleChangeTitleCard } =
    useListBoardContext();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragOver = ({ over, active }) => {
    const overId = over?.id;

    if (!overId) {
      return;
    }

    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId;

    if (!overContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      setListCount((items) => {
        let newState = [...items];

        const activeIndex = active.data.current.sortable.index;
        const overIndex = over.data.current?.sortable.index || 0;
        const activeCard = listCount.find((item) => item.id === activeContainer)?.cards[activeIndex];
        newState = moveBetweenContainers(newState, activeContainer, activeIndex, overContainer, overIndex, activeCard);
        return newState;
      });
    }
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) {
      return;
    }

    if (active.id !== over.id) {
      const activeContainer = active.data.current.sortable.containerId;
      const overContainer = over.data.current?.sortable.containerId || over.id;
      const activeIndex = active.data.current.sortable.index;
      const overIndex = over.data.current?.sortable.index || 0;

      setListCount((prev) => {
        let newItems = [...prev];
        if (activeContainer === overContainer) {
          const activeList = listCount.find((list) => list.id === activeContainer);
          activeList.cards = arrayMove(activeList.cards, activeIndex, overIndex);
        } else {
          const activeCard = listCount.find((item) => item.id === activeContainer)?.cards[activeIndex];
          newItems = moveBetweenContainers(
            newItems,
            activeContainer,
            activeIndex,
            overContainer,
            overIndex,
            activeCard,
          );
        }

        return newItems;
      });
    }
  };

  const moveBetweenContainers = (items, activeContainer, activeIndex, overContainer, overIndex, item) => {
    const activeList = items.find((item) => item.id === activeContainer);
    const overList = items.find((item) => item.id === overContainer);

    activeList.cards = removeAtIndex(activeList.cards, activeIndex);
    overList.cards = insertAtIndex(overList.cards, overIndex, item);

    return items;
  };

  return (
    <div className="relative h-[90vh]">
      <div
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#fff6 #00000026",
        }}
        className="absolute h-full top-0 left-0 right-0 mb-2 pb-2 overflow-x-auto overflow-y-hidden whitespace-nowrap"
      >
        <div className="my-4 px-[4px] flex">
          <div className="flex flex-nowrap">
            <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
              <div style={{ display: "flex" }}>
                {listCount.map((item, index) => {
                  return <List id={item.id} key={index} item={item} />;
                })}
              </div>
            </DndContext>

            <div className="px-[8px]">
              <div
                onClick={!isShowAddList ? handleShowAddList : null}
                className={`flex items-center w-[248px] rounded-[12px] bg-gray-100 p-[6px] ${!isShowAddList ? "hover:bg-gray-300" : ""} cursor-pointer`}
              >
                {!isShowAddList ? (
                  <>
                    <div className="rounded-[4px] p-2 hover:bg-gray-300 transition-opacity duration-300">
                      <AddIcon width={16} height={16} />
                    </div>
                    <div className="text-[16px] font-medium">Add another list</div>
                  </>
                ) : (
                  <div className="w-full">
                    <CreateItem
                      isList={true}
                      nameBtn={"Add list"}
                      descriptionCard={nameTitle}
                      placeHolderText={"Enter list name..."}
                      onAdd={handleAddList}
                      onShow={handleShowAddList}
                      onChangeTitle={handleChangeTitleCard}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ListInBoard);
