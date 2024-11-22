import { Box, Modal, Zoom } from "@mui/material";
import { Link } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CloseIcon from "@mui/icons-material/Close";

export const PreviewImageModal = ({ open, handleCloseImageClick }) => {
  const { watch } = useFormContext();

  return (
    <Modal open={open} onClose={handleCloseImageClick}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <div className="z-50 w-[80%] h-[80%] text-center bg-black bg-opacity-50 overflow-y-auto">
          <Zoom>
            <img
              src={watch("selectedImgUrl")}
              alt="attachment"
              className="rounded-[4px] p-4 cursor-pointer object-cover w-full h-full"
            />
          </Zoom>
        </div>
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center mt-3 text-center">
            <Link
              className="p-2 mr-3 rounded-md cursor-pointer hover:bg-gray-800"
              to={watch("selectedImgUrl")}
              target="_blank"
            >
              <ArrowOutwardIcon
                sx={{
                  cursor: "pointer",
                  width: "18px",
                  height: "18px",
                  color: "white"
                }}
              />
              <span className="text-[16px] text-white ml-2">
                Open in new tab
              </span>
            </Link>
            <button
              onClick={handleCloseImageClick}
              className="flex items-center p-2 text-white rounded-md hover:bg-gray-800"
            >
              <CloseIcon
                sx={{ color: "white", fontSize: "16px", cursor: "pointer" }}
              />
              <span className="text-[16px] text-white ml-2">Close</span>
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};
