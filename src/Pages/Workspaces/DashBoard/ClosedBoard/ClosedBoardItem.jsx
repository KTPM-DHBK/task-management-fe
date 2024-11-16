import { Button, CircularProgress } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import NorthEastOutlinedIcon from "@mui/icons-material/NorthEastOutlined";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { destroyBoard } from "../../../../Services/API/ApiBoard/apiBoard";
import { toast } from "react-toastify";

export default function ClosedBoardItem({ data = {}, workspaceName = "", onReopen, onDestroy }) {
  const [loading, setLoading] = useState(false);

  const handleReopen = () => {
    if (onReopen) return onReopen(data);
  };
  const handleDestroy = () => {
    setLoading(true);
    destroyBoard(data.id)
      .then(() => {
        toast.success("Destroy board successfully");
        if (onDestroy) onDestroy(data);
      })
      .catch((err) => {
        toast.error("Destroy board unsuccessfully");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex justify-between py-2 items-center">
      <div className="flex gap-3 items-center">
        <div
          alt=""
          className="w-10 h-8 rounded-sm"
          style={{
            backgroundImage: `url(${data.coverUrl})`,
          }}
        />
        <div className="flex flex-col text-sm">
          <Link className="text-[var(--primary)]">
            {data.title}
            <NorthEastOutlinedIcon fontSize="small" sx={{ color: "var(--dark-slate-blue)" }} />
          </Link>
          <span className="text-[var(--dark-slate-blue)]">{workspaceName}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleReopen} sx={{ textTransform: "none", py: 0.5 }} variant="contained">
          Reopen
        </Button>
        <Button
          onClick={handleDestroy}
          startIcon={loading ? <CircularProgress color="#fff" size={18} /> : <DeleteOutlinedIcon fontSize="small" />}
          sx={{ textTransform: "none", py: 0.5 }}
          variant="contained"
          color="error"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
