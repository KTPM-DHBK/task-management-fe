import { Dialog } from "@mui/material";
import React from "react";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ClosedBoardItem from "./ClosedBoardItem";
export default function ClosedBoarDialog({ open, onClose }) {
  const handleClose = () => {
    if (onClose) return onClose();
  };
  return (
    <div>
      <Dialog
        sx={{
          "& .MuiDialog-paper": {
            margin: 0,
            maxWidth: 768,
            width: 768,
            height: "fit-content",
            marginTop: 5,
          },
          "& .MuiDialog-container": {
            alignItems: "unset",
            WebkitAlignItems: "unset",
          },
        }}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="w-full">
          <div className="flex justify-between p-3">
            <div className="flex items-center">
              <Inventory2OutlinedIcon
                sx={{ width: 24, height: 24, marginRight: 1, marginLeft: 0.5, color: "var(--text-color)" }}
              />
              <h2 className="text-xl text-[var(--text-color)] font-semibold">Closed Boards</h2>
            </div>
            <button onClick={handleClose} className="w-9 h-9 flex items-center justify-center">
              <CloseOutlinedIcon sx={{ width: 24, height: 24 }} />
            </button>
          </div>

          <div className="px-3 pb-3">
            <ClosedBoardItem />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
