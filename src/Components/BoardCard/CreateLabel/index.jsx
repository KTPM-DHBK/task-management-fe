import React, { useEffect, useState } from "react";
import { Divider } from "@mui/material";

import ItemMenu from "../../ItemMenu";
import { ButtonBoardCard } from "../../ButtonBoardCard";
import { getAllTagByIdBoard } from "../../../Services/API/ApiBoard/apiBoard";
import { useListBoardContext } from "../../../Pages/ListBoard/ListBoardContext";

function CreateLabel({
  position,
  isUpdateLabel,
  handleCloseShowMenuBtnCard,
  ShowDetailNewLabel,
  chooseColorLabel,
  handleChangeInputLabel,
  inputTitleLabel,
  handleChooseColor,
  handleCreateNewLabel,
  onUpdateLabel,
}) {
  const { dataBoard } = useListBoardContext();
  const [listColorLabel, setListColorLabel] = useState([]);
  useEffect(() => {
    const getAllLabelOfBoard = async () => {
      try {
        const res = await getAllTagByIdBoard(dataBoard?.id);
        setListColorLabel(res?.data.data || []);
      } catch (err) {
        console.error("Error all label data: ", err);
      }
    };
    getAllLabelOfBoard();
  }, [dataBoard]);

  return (
    <div style={{ top: position.top - 100, left: position.left }} className="absolute">
      <ItemMenu title={"Label"} onClose={handleCloseShowMenuBtnCard} onBack={ShowDetailNewLabel}>
        <div className="flex items-center justify-center bg-gray-100 h-[60px]">
          {chooseColorLabel ? (
            <div
              style={{
                backgroundColor: chooseColorLabel.color,
              }}
              className={`w-[80%] h-[32px] p-2 rounded-[4px]`}
            >
              <font>{inputTitleLabel}</font>
            </div>
          ) : (
            <div
              className={`${listColorLabel.length > 0 ? listColorLabel[0].color : "bg-gray-100"} w-[80%] h-[32px] p-2 rounded-[4px]`}
            >
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
              onChange={handleChangeInputLabel}
              className="w-full bg-white rounded-[2px] text-base font-[200] px-2 py-1 cursor-pointer  focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-2">
            <div className="py-2 bg-white">Select a color</div>
            <ul className="flex items-center justify-center flex-wrap">
              {Array.isArray(listColorLabel)
                ? listColorLabel?.map((item, index) => (
                    <li
                      onClick={() => handleChooseColor(item)}
                      key={index}
                      style={{
                        backgroundColor: item.color,
                      }}
                      className={`w-12 h-8 rounded-[4px] mr-1 mb-1 ${chooseColorLabel.id === item.id && "border-[3px] border-gray-500 shadow-[0_3px_10px_rgba(0,0,0,0.3)]"}`}
                    ></li>
                  ))
                : null}
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
                onHandleEvent={() => onUpdateLabel(chooseColorLabel, inputTitleLabel)}
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
  );
}

export default React.memo(CreateLabel);
