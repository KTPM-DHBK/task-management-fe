import { Button, CircularProgress } from "@mui/material";
import ItemList from "../../ItemList";
import HeadlessTippy from "@tippyjs/react/headless";
import { Close } from "@mui/icons-material";
import { memo, useState } from "react";
import { deleteCard } from "../../../Services/API/ApiCard";
import { toast } from "react-toastify";

function ArchivedItem({ data }) {
  const [popperDelete, setPopperDelete] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const handleDeleteCard = () => {
    setIsFetching(true);
    deleteCard(1)
      .then((res) => {
        toast.success("Delete card successfully");
      })
      .catch((err) => {
        toast.error("Delete card unsuccessfully");
      })
      .finally(() => {
        setIsFetching(false);
        setPopperDelete(false);
      });
  };

  return (
    <div className="mb-3">
      <ItemList
        id={data.id}
        isAttachment
        isArchived
        dataCard={
          data || {
            id: 1,
            title: "Card",
          }
        }
      />

      <div className="flex gap-3 font-semibold text-[var(--dark-slate-blue)]">
        <span className="hover:text-[var(--primary)] cursor-pointer hover:underline">Send to board</span>
        <HeadlessTippy
          onClickOutside={() => setPopperDelete(false)}
          visible={popperDelete}
          interactive
          placement="bottom"
          offset={[20, 0]}
          render={() => (
            <div style={{ boxShadow: "var(--ds-shadow-overlay)" }} className="w-[304px] bg-white rounded-md mt-2">
              <div className="flex items-center py-1 px-2 ">
                <h2 className="flex-1 text-center text-sm text-[#44546f] font-semibold">Delete card?</h2>
                <button
                  onClick={() => setPopperDelete(false)}
                  className="w-8 h-8 text-[#44546f] rounded-md hover:bg-[var(--hover-background)]"
                >
                  <Close />
                </button>
              </div>

              <div className="px-3 pb-3 flex flex-col">
                <div className="text-[#44546f] font-semibold text-xs">
                  All actions will be removed from the activity feed and you won’t be able to re-open the card. There is
                  no undo.
                </div>

                <Button
                  startIcon={isFetching && <CircularProgress size={20} color="#fff" />}
                  onClick={handleDeleteCard}
                  variant="contained"
                  color="error"
                  sx={{ textTransform: "none", marginTop: "8px" }}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        >
          <span
            onClick={() => setPopperDelete(true)}
            className="hover:text-[var(--primary)] cursor-pointer hover:underline"
          >
            Delete
          </span>
        </HeadlessTippy>
      </div>
    </div>
  );
}

export default memo(ArchivedItem);
