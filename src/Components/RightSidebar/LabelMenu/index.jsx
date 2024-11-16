import { Button, CircularProgress, Divider, Slide, TextField } from "@mui/material";
import HeadlessTippy from "@tippyjs/react/headless";
import LabelEditor from "./LabelEditor";
import { useEffect, useState } from "react";
import { createTag, getTags } from "../../../Services/API/APITags";
import { useParams } from "react-router-dom";
import LabelItem from "./LabelItem";
import { toast } from "react-toastify";

export default function LabelMenu() {
  const [tags, setTags] = useState([]);

  const [creatorPopper, setCreatorPopper] = useState(false);
  const handleOpenCloseCreator = () => setCreatorPopper(!creatorPopper);
  const { idBoard } = useParams();
  const [isFetching, setIsFetching] = useState(true);

  const handleCreateTag = (data) => {
    setCreatorPopper(false);
    createTag({ boardId: Number(idBoard), name: data.title, color: data.choosedColor })
      .then((res) => {
        toast.success("Create tag successfully");
        setTags((prev) => [...prev, res]);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Create tag unsuccessfully");
      });
  };

  useEffect(() => {
    getTags(idBoard)
      .then((res) => {
        if (res.data) setTags(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsFetching(false));
  }, [idBoard]);

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
        {isFetching && (
          <div className="flex justify-center mt-3 mb-2">
            <CircularProgress size={20} />
          </div>
        )}
        {tags.length > 0 && (
          <>
            <span className="mt-3 mb-2 text-xs font-semibold text-[var(--dark-slate-blue)]">Labels</span>

            <ul className="pt-1 pb-2">
              {tags.map((tag, index) => (
                <LabelItem key={index} data={tag} setTags={setTags} />
              ))}
            </ul>
          </>
        )}
        <HeadlessTippy
          onClickOutside={handleOpenCloseCreator}
          interactive
          visible={creatorPopper}
          render={() => <LabelEditor onSubmit={handleCreateTag} onClose={handleOpenCloseCreator} />}
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
