import { Button, Divider, Slide, TextField } from "@mui/material";
import HeadlessTippy from "@tippyjs/react/headless";
import LabelEditor from "./LabelEditor";
import { useState } from "react";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

export default function LabelMenu() {
  const [creatorPopper, setCreatorPopper] = useState(false);

  const handleOpenCloseCreator = () => setCreatorPopper(!creatorPopper);
  return (
    <Slide in={true} direction="left">
      <div className="flex flex-col">
        <TextField
          sx={{
            height: "100%",
            "& .MuiInputBase-input": {
              paddingY: "6px",
              paddingLeft: "12px",
              paddingRight: "18px",
              fontSize: "14px",
            },
          }}
          placeholder="Search labels..."
        />
        <span className="mt-3 mb-2 text-xs font-semibold text-[var(--dark-slate-blue)]">Labels</span>
        <ul className="pt-1 pb-2">
          <li className="mb-1">
            <div className="flex h-8 gap-1">
              <span
                style={{ backgroundColor: "#1F845A" }}
                className="flex-1 leading-8 px-3 rounded cursor-pointer hover:opacity-[0.9]"
              >
                Backend
              </span>
              <button className="w-8 h-8 rounded hover:bg-[var(--hover-background)] flex items-center justify-center">
                <ModeEditOutlineOutlinedIcon fontSize="inherit" />
              </button>
            </div>
          </li>
          <li className="mb-1">
            <div className="flex h-8 gap-1">
              <span
                style={{ backgroundColor: "#1F845A" }}
                className="flex-1 leading-8 px-3 rounded cursor-pointer hover:opacity-[0.9]"
              >
                Backend
              </span>
              <button className="w-8 h-8 rounded hover:bg-[var(--hover-background)] flex items-center justify-center">
                <ModeEditOutlineOutlinedIcon fontSize="inherit" />
              </button>
            </div>
          </li>
        </ul>
        <HeadlessTippy
          onClickOutside={handleOpenCloseCreator}
          interactive
          visible={creatorPopper}
          render={() => <LabelEditor onClose={handleOpenCloseCreator} />}
          placement="left"
        >
          <Button
            onClick={handleOpenCloseCreator}
            sx={{
              bgcolor: "var(--hover-background)",
              color: "var(--text-color)",
              textTransform: "none",
              paddingY: "4px",
              paddingX: "12px",
              marginY: 0.5,
              "&:hover": {
                bgcolor: "#091E4224",
              },
            }}
          >
            Create a new label
          </Button>
        </HeadlessTippy>
        <Divider element="div" sx={{ marginY: 1 }} />

        <Button
          sx={{
            bgcolor: "var(--hover-background)",
            color: "var(--text-color)",
            textTransform: "none",
            paddingY: "4px",
            paddingX: "12px",
            marginY: 0.5,
            "&:hover": {
              bgcolor: "#091E4224",
            },
          }}
        >
          Enable colorblind friendly mode
        </Button>
      </div>
    </Slide>
  );
}
