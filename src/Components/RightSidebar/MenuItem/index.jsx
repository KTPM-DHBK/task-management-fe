import React from "react";
import PropTypes from "prop-types";

const defFunc = () => {};
function MenuItem({ icon, children, onChange = defFunc, disable = false }) {
  return (
    <div
      style={{
        opacity: disable ? 0.5 : 1,
        cursor: disable ? "default" : "pointer",
      }}
      onClick={onChange}
      className="select-none h-8 cursor-pointer px-3 flex items-center gap-2 hover:bg-[#091E420F] rounded-md text-[var(--text-color)]"
    >
      {icon && <div className="w-5 h-5 flex items-center justify-center">{icon}</div>}
      <div className="text-sm">{children}</div>
    </div>
  );
}

MenuItem.propTypes = {
  icon: PropTypes.node,
  children: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  disable: PropTypes.bool,
};

export default React.memo(MenuItem);
