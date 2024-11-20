import React, { useState } from "react";
import { Slide } from "@mui/material";
import BackgroundColorItem from "./BackgroundColorItem";
import { useCallback } from "react";
import { useListBoardContext } from "../../../Pages/ListBoard/ListBoardContext";
import { updateBoard } from "../../../Services/API/ApiBoard/apiBoard";
import { toast } from "react-toastify";
import { EQueryKeys } from "../../../constants";
import { useQueryClient } from "@tanstack/react-query";

const colors = [
  "https://trello.com/assets/707f35bc691220846678.svg",
  "https://trello.com/assets/d106776cb297f000b1f4.svg",
  "https://trello.com/assets/8ab3b35f3a786bb6cdac.svg",
  "https://trello.com/assets/a7c521b94eb153008f2d.svg",
  "https://trello.com/assets/aec98becb6d15a5fc95e.svg",
  "https://trello.com/assets/b75536d1afb40980ca57.svg",
  "https://trello.com/assets/92e67a71aaaa98dea5ad.svg",
  "https://trello.com/assets/941e9fef7b1b1129b904.svg",
  "https://trello.com/assets/1cbae06b1a428ad6234a.svg",
];

export default function ChangeBackgroundMenu() {
  const { dataBoard } = useListBoardContext();

  const queryClient = useQueryClient();
  const [backgroundColor, setBackgroundColor] = useState(dataBoard.coverUrl || "");

  const handleChooseColor = useCallback((colorUrl) => {
    setBackgroundColor(colorUrl);
    // setDataBoard((prev) => {
    //   return {
    //     ...prev,
    //     coverUrl: colorUrl,
    //   };
    // });
    updateBoard(dataBoard.id, { coverUrl: colorUrl })
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: [EQueryKeys.GET_BOARD_BY_ID],
        });
      })
      .catch(() => {
        toast.error("Update background color unsuccessfully");
      });
    // eslint-disable-next-line
  }, []);

  return (
    <Slide in={true} direction="left">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        {colors.map((color, index) => (
          <BackgroundColorItem
            choosed={backgroundColor === color}
            key={index}
            onClick={handleChooseColor}
            color={color}
          />
        ))}
      </div>
    </Slide>
  );
}
