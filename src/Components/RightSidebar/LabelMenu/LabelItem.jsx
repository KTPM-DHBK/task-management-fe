import React, { memo, useState } from "react";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import HeadlessTippy from "@tippyjs/react/headless";
import LabelEditor from "./LabelEditor";
import { useParams } from "react-router-dom";
import { deleteTag, updateTag } from "../../../Services/API/APITags";
import { toast } from "react-toastify";
import { contrastTextColor } from "../../../Utils/color";

function LabelItem({ data, setTags }) {
  const [edit, setEdit] = useState(false);
  const handleOpenCloseEdit = () => setEdit(!edit);

  const { idBoard } = useParams();
  const handleUpdateLabel = ({ choosedColor, title }) => {
    setTags((prev) => {
      const newTags = prev.map((tag) => {
        if (tag.id === data.id) {
          tag.color = choosedColor;
          tag.name = title;
        }
        return tag;
      });
      return newTags;
    });
    setEdit(false);

    updateTag({ boardId: idBoard, name: title, color: choosedColor, tagId: data.id })
      .then((res) => {})
      .catch((err) => {
        setTags((prev) => {
          const newTags = prev.map((tag) => {
            if (tag.id === data.id) return data;
            return tag;
          });
          return newTags;
        });
      });
  };

  const handleDelete = () => {
    setTags((prev) => {
      const newTags = prev.filter((tag) => tag.id !== data.id);
      return newTags;
    });
    setEdit(false);
    deleteTag(idBoard, data.id)
      .then((res) => {})
      .catch((err) => {
        setTags((prev) => {
          const newTags = [...prev].push(data);
          return newTags;
        });
        toast.error("Can't delete tag");
      });
  };

  const textColor = contrastTextColor(data.color);

  return (
    <li className="mb-1">
      <div className="flex h-8 gap-1">
        <span
          onClick={handleOpenCloseEdit}
          style={{ backgroundColor: data?.color || "#1F845A", color: textColor }}
          className="flex-1 leading-8 px-3 rounded cursor-pointer hover:opacity-[0.9]"
        >
          {data?.name}
        </span>
        <HeadlessTippy
          interactive
          visible={edit}
          onClickOutside={handleOpenCloseEdit}
          placement="left-start"
          render={() => (
            <LabelEditor
              onSubmit={handleUpdateLabel}
              onClose={handleOpenCloseEdit}
              onDelete={handleDelete}
              color={data?.color}
              nameTag={data?.name}
            />
          )}
        >
          <button
            onClick={handleOpenCloseEdit}
            className="w-8 h-8 rounded hover:bg-[var(--hover-background)] flex items-center justify-center"
          >
            <ModeEditOutlineOutlinedIcon fontSize="inherit" />
          </button>
        </HeadlessTippy>
      </div>
    </li>
  );
}
export default memo(LabelItem);
