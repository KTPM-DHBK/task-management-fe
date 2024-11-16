import { Dialog } from "@mui/material";
import React from "react";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ClosedBoardItem from "./ClosedBoardItem";
import PropTypes from "prop-types";
import { reOpenBoard } from "../../../../Services/API/ApiBoard/apiBoard";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { EQueryKeys } from "../../../../constants";

function ClosedBoarDialog({
  open,
  onClose,
  boards = [],
  workspaceName = "",
  setArchivedBoards
}) {
  const queryClient = useQueryClient();

  const handleClose = () => {
    if (onClose) return onClose();
  };

  const handleReopenBoard = (data) => {
    reOpenBoard(data.id)
      .then((res) => {
        toast.success("Reopen board successfully");
        if (boards.length === 1) onClose();
        setArchivedBoards((prev) => {
          return [...prev].filter((board) => board.id !== data.id);
        });
        queryClient.invalidateQueries({
          queryKey: [EQueryKeys.GET_WORKSPACE_BY_ID]
        });
      })
      .catch((err) => {
        toast.error("Re-open board unsuccessfully");
      });
  };

  const handleDestroyBoard = (data) => {
    setArchivedBoards((prev) => {
      return [...prev].filter((item) => item.id !== data.id);
    });
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
            marginTop: 5
          },
          "& .MuiDialog-container": {
            alignItems: "unset",
            WebkitAlignItems: "unset"
          }
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
                sx={{
                  width: 24,
                  height: 24,
                  marginRight: 1,
                  marginLeft: 0.5,
                  color: "var(--text-color)"
                }}
              />
              <h2 className="text-xl text-[var(--text-color)] font-semibold">
                Closed Boards
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="w-9 h-9 flex items-center justify-center"
            >
              <CloseOutlinedIcon sx={{ width: 24, height: 24 }} />
            </button>
          </div>

          <div className="px-3 pb-3">
            {boards.map((item, index) => (
              <ClosedBoardItem
                onReopen={handleReopenBoard}
                onDestroy={handleDestroyBoard}
                data={item}
                key={index}
                workspaceName={workspaceName}
              />
            ))}
          </div>
        </div>
      </Dialog>
    </div>
  );
}

ClosedBoarDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  boards: PropTypes.array,
  workspaceName: PropTypes.string
};
export default ClosedBoarDialog;
