import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { CircularProgress } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

const ItemMenu = ({ title, description, nameBtn, onBack, onClose, onClickConfirm, children, loading = false }) => {
  return (
    <div className="absolute w-[250px] bg-white rounded-[8px] py-2 font-medium text-[12px] z-50 shadow-[0_3px_10px_rgba(0,0,0,0.3)]">
      <div className="text-center p-2 mx-8">{title}</div>
      {description && <div className="mx-4">{description}</div>}
      {children}
      {nameBtn && (
        <div
          onClick={onClickConfirm}
          className="cursor-pointer text-center m-2 px-3 py-1 rounded-[4px] bg-gray-600 hover:bg-gray-700 transition-bg duration-300 flex justify-center gap-3"
        >
          <span className="font-medium text-white">{nameBtn}</span>
          {loading && (
            <div className="flex">
              <CircularProgress size={18} />
            </div>
          )}
        </div>
      )}
      <KeyboardArrowLeftIcon
        onClick={onBack}
        fontSize="medium"
        className="absolute left-3 top-3 rounded-[4px] hover:bg-gray-100 cursor-pointer"
      />
      <CloseIcon
        onClick={onClose}
        className="cursor-pointer absolute right-3 top-3 p-1 rounded-[4px] hover:bg-gray-100 "
      />
    </div>
  );
};

ItemMenu.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  nameBtn: PropTypes.string,
  onBack: PropTypes.func,
  onClose: PropTypes.func,
  onClickConfirm: PropTypes.func,
  children: PropTypes.any,
  loading: PropTypes.bool,
};

export default React.memo(ItemMenu);
