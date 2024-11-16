import { Check, Close } from "@mui/icons-material";
import Wrapper from "../../Wrapper";
import { Button, Divider, TextField } from "@mui/material";
import { useState } from "react";
import { colors } from "./constant";
import { contrastTextColor } from "../../../Utils/color";

export default function LabelEditor({ onClose, onSubmit, color, nameTag, onDelete }) {
  const [choosedColor, setChoosedColor] = useState(color || "");
  const [title, setTitle] = useState(nameTag || "");

  const handleClose = (e) => {
    if (!color && !nameTag) {
      setTitle("");
      setChoosedColor("");
    } else {
      setTitle(nameTag);
      setChoosedColor(color);
    }
    if (onClose) return onClose(e);
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ choosedColor, title });
      if (!color || !nameTag) {
        setChoosedColor("");
        setTitle("");
      }
    }
  };

  const handleDelete = () => {
    if (onDelete) return onDelete();
  };

  const textColor = contrastTextColor(choosedColor);
  return (
    <Wrapper>
      <div className="w-[304px]">
        <div className="relative py-1 px-2  items-center text-center">
          <h2 className="font-semibold text-[var(--text-color)] text-sm flex-1 h-10 leading-10">Labels</h2>
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 w-8 h-8 rounded-md hover:bg-[var(--hover-background)]"
          >
            <Close fontSize="small" />
          </button>
        </div>
        <div className="p-8 bg-[#F7F8F9]">
          <div
            style={{
              backgroundColor: choosedColor || "#091E420F",
              transition: "all 0.2s ease",
              color: textColor,
            }}
            className="h-8 w-full px-3 rounded leading-8 font-semibold"
          >
            {title}
          </div>
        </div>
        <div className="px-3 pb-3 max-h-[587px]">
          <h3 className="text-xs mt-3 mb-2 text-[var(--text-color)] font-semibold">Title</h3>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              height: "100%",
              width: "100%",
              "& .MuiInputBase-input": {
                paddingY: "6px",
                paddingLeft: "12px",
                paddingRight: "18px",
                fontSize: "14px",
              },
            }}
          />

          <h3 className="text-xs mt-3 mb-2 text-[var(--text-color)] font-semibold">Select a color</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5,1fr)",
              gap: 6,
              margin: "0 -4px",
              marginBottom: 16,
            }}
          >
            {colors.map((color, index) => (
              <button
                onClick={() => setChoosedColor(color.colorCode)}
                style={{
                  backgroundColor: color.colorCode,
                }}
                key={index}
                className={`w-[50px] h-8  rounded`}
              >
                {choosedColor === color.colorCode && <Check fontSize="small" sx={{ color: "#fff" }} />}
              </button>
            ))}
          </div>

          <Button
            onClick={() => setChoosedColor("")}
            disabled={!choosedColor}
            title="Labels without a color selected will only appear on the card back"
            startIcon={<Close fontSize="small" />}
            sx={{
              width: "100%",
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
            Remove color
          </Button>

          <Divider element="div" sx={{ marginY: 2 }} />
          <div className="flex justify-between">
            <Button
              onClick={handleSubmit}
              disabled={!choosedColor || (choosedColor === color && title === nameTag)}
              variant="contained"
              sx={{ textTransform: "none", paddingY: 0.5 }}
            >
              {color ? "Save" : "Create"}
            </Button>
            {onDelete && (
              <Button
                onClick={handleDelete}
                variant="contained"
                color="error"
                sx={{ textTransform: "none", paddingY: 0.5 }}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
