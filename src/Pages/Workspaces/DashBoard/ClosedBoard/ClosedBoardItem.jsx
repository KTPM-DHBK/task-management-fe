import { Button } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import NorthEastOutlinedIcon from "@mui/icons-material/NorthEastOutlined";
import React from "react";
import { Link } from "react-router-dom";

export default function ClosedBoardItem() {
  return (
    <div className="flex justify-between py-2 items-center">
      <div className="flex gap-3 items-center">
        <img
          src="https://d2k1ftgv7pobq7.cloudfront.net/images/backgrounds/gradients/ocean.svg"
          alt=""
          className="w-10 h-8 rounded-sm"
        />
        <div className="flex flex-col text-sm">
          <Link className="text-[var(--primary)]">
            Test board
            <NorthEastOutlinedIcon fontSize="small" sx={{ color: "var(--dark-slate-blue)" }} />
          </Link>
          <span className="text-[var(--dark-slate-blue)]">BKDN</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button sx={{ textTransform: "none", py: 0.5 }} variant="contained">
          Reopen
        </Button>
        <Button
          startIcon={<DeleteOutlinedIcon fontSize="small" />}
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
