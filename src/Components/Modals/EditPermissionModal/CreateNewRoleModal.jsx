import { Button, Modal, TextField } from "@mui/material";
import { CenterModel } from "../styles";
import { useState } from "react";
import { createBoardRole } from "../../../Services/API/apiBoardPermission";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

export const CreateNewRoleModal = ({ open, handleClose }) => {
  const queryClient = useQueryClient();
  const [roleName, setRoleName] = useState("");
  const { idBoard } = useParams();

  const handleCreateNewRole = async (e) => {
    e.preventDefault();
    if (!roleName || !idBoard) {
      toast.error("Role name is required");
      return;
    }
    createBoardRole(idBoard, roleName)
      .then((res) => {
        console.log(res);
        queryClient.invalidateQueries("boardRole");
        toast.success("Role created successfully");
      })
      .catch(() => {
        toast.error("Error creating role");
      })
      .finally(() => {
        handleClose();
      });
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
      }}
    >
      <form
        className={`w-1/8 flex flex-col gap-2 p-4 rounded-md bg-white ${CenterModel}`}
        onSubmit={handleCreateNewRole}
      >
        <div className="font-semibold text-xl">Create new role</div>
        <div className="flex items-center gap-4">
          <div className="font-bold">Name</div>
          <TextField
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            size="small"
          />
        </div>
        <div className="self-end">
          <Button type="submit" variant="contained" size="medium">
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};
