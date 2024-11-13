import { Button, CircularProgress, Slide, TextField } from "@mui/material";
import ArchivedItem from "./ArchivedItem";
import { useEffect, useState } from "react";
import { getArchivedCards } from "../../../Services/API/ApiCard";

export default function Archived() {
  const [archivedCards, setArchivedCards] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    getArchivedCards(151)
      .then((res) => {
        setArchivedCards(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsFetching(false));
  }, []);

  return (
    <Slide in={true} direction="left">
      <div>
        <div className="flex items-center justify-between h-8">
          <div>
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
              placeholder="Search archive..."
            />
          </div>
          <Button
            variant="contained"
            sx={{
              fontSize: 14,
              textTransform: "none",
              bgcolor: "#091E420F",
              color: "var(--text-color)",
              height: 32,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#091E4224", // Màu nền khi hover
                boxShadow: "none",
              },
            }}
          >
            Switch to list
          </Button>
        </div>
        <div className="px-3">
          {isFetching && (
            <div className="flex justify-center py-3">
              <CircularProgress size={24} />
            </div>
          )}

          {archivedCards.length === 0 && !isFetching && (
            <div className="mt-3">
              <div className="py-6 px-3 text-sm flex items-center justify-center rounded-lg bg-[#091E420F]">
                <span>No result</span>
              </div>
            </div>
          )}
          <div className="flex flex-col">
            {archivedCards.map((card, index) => (
              <ArchivedItem key={index} data={card} />
            ))}
          </div>
        </div>
      </div>
    </Slide>
  );
}
