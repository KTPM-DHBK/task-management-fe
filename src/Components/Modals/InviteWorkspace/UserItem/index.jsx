import { Avatar, Button, CircularProgress } from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { useState } from "react";
import PropTypes from "prop-types";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { addMemberIntoBoard } from "../../../../Services/API/ApiBoard/apiBoard";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function UserItem({ onClick, data, onAdded }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const { idBoard } = useParams();

  const handleClick = () => {
    if (onClick) return onClick(data);
  };

  const handleAddMember = () => {
    if (isAdded === false) {
      setIsAdding(true);
      addMemberIntoBoard(data.id, idBoard)
        .then(() => {
          toast.success("Add member successfully");
          if (onAdded) return onAdded(data);
        })
        .catch(() => {
          toast.error("Add member unsuccessfully");
        })
        .finally(() => {
          setIsAdding(false);
          setIsAdded(true);
        });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="py-2 px-2   flex gap-2 items-center hover:bg-[#091E424F] rounded-[4px] cursor-pointer justify-between"
    >
      <div className="flex gap-2 items-center">
        <Avatar sx={{ bgcolor: grey[500], width: 32, height: 32 }}>
          {data?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        <div className="flex flex-col justify-center">
          <div className="text-[#172B4D] text-sm">{data?.name}</div>
          <span className="text-[#44546F] text-xs">{data?.email}</span>
        </div>
      </div>
      {data?.isExisted ? (
        <div>
          <span className="font-semibold mr-2">Joined</span>
          <CheckBoxIcon sx={{ color: "#51ce70" }} />
        </div>
      ) : (
        <div>
          <Button
            disabled={isAdded}
            onClick={handleAddMember}
            startIcon={isAdding && <CircularProgress size={18} color="#fff" />}
            variant="contained"
            sx={{ textTransform: "none", paddingY: 0.2 }}
          >
            {isAdded ? "Added" : "Add"}
          </Button>
        </div>
      )}
    </div>
  );
}

UserItem.propTypes = {
  onClick: PropTypes.func,
  data: PropTypes.object
};

export default UserItem;
