import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import PropTypes from "prop-types";
import { memo } from "react";

function BackgroundColorItem({ choosed, color, onClick }) {
  const colorItemStyles = {
    height: 94,
    marginBottom: 4,
    backgroundImage: `url(${color})`,
    borderRadius: 6,
    display: "block",
    cursor: "pointer",
    width: "100%",
    position: "relative",
  };

  const handleClick = (e) => {
    if (onClick) return onClick(color);
  };

  return (
    <div onClick={handleClick} style={colorItemStyles}>
      {choosed && (
        <div
          style={{
            transform: "translate(-50%,-50%)",
          }}
          className="absolute top-[50%] left-[50%]"
        >
          <CheckIcon sx={{ color: "#fff", width: 24, height: 24 }} />
        </div>
      )}
    </div>
  );
}

BackgroundColorItem.propTypes = {
  choosed: PropTypes.bool,
  color: PropTypes.string,
};

export default memo(BackgroundColorItem);
