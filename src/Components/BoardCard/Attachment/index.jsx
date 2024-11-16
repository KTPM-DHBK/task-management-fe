import React, { useState, useRef, useEffect, useMemo } from "react";
import ItemAttachment from "./ItemAttachment";
import { useListBoardContext } from "../../../Pages/ListBoard/ListBoardContext";

const Attachment = () => {
  const { postUploadedFiles } = useListBoardContext();
  const [showImage, setShowImage] = useState(false);
  const [openMore, setOpenMore] = useState(null);
  const moreRef = useRef(null);

  const handleOpenMore = (id) => setOpenMore(openMore === id ? null : id);
  const handleCloseMore = () => setOpenMore(null);

  // Handle click outside to close MorePoper
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".more-poper") &&
        !event.target.closest(".more-button")
      ) {
        setOpenMore(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle show and hide images
  const handleShowImage = () => setShowImage(true);
  const handleHideImage = () => setShowImage(false);

  const fileToShow = useMemo(
    () => (showImage ? postUploadedFiles : postUploadedFiles.slice(0, 4)),
    [showImage, postUploadedFiles]
  );
  const listFile = postUploadedFiles.length;
  const quantityFile = useMemo(() => listFile - 4, [listFile]);

  return (
    <>
      {fileToShow.map((item) => (
        <ItemAttachment
          item={item}
          key={item.id}
          moreRef={moreRef}
          openMore={openMore}
          handleOpenMore={handleOpenMore}
          handleCloseMore={handleCloseMore}
        />
      ))}
      {listFile > 4 && (
        <>
          {showImage ? (
            <button
              onClick={handleHideImage}
              className="px-4 py-1 bg-gray-300 rounded-sm"
            >
              Show fewer attachments
            </button>
          ) : (
            <button
              onClick={handleShowImage}
              className="px-4 py-1 bg-gray-300 rounded-sm"
            >
              View all attachments ({quantityFile} {"hidden"})
            </button>
          )}
        </>
      )}
    </>
  );
};

export default Attachment;
