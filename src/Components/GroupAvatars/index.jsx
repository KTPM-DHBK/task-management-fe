import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { memo } from "react";
import PropTypes from "prop-types";
import { stringAvatar } from "../../Utils/color";

function GroupAvatars({ users = [] }) {
  users = users.filter((item) => item.user !== null);
  return (
    <AvatarGroup
      max={5}
      sx={{
        "& .MuiAvatar-root": {
          width: 28,
          height: 28,
          cursor: "pointer",
          fontSize: "14px",
          "&:hover": {
            opacity: 0.9,
          },
        },
      }}
    >
      {users.map((user, index) => (
        <Avatar key={index} {...stringAvatar(user.user?.name)} alt={user.user?.name} src={user.user?.avatarUrl || ""} />
      ))}
    </AvatarGroup>
  );
}

GroupAvatars.propTypes = {
  users: PropTypes.array,
};
export default memo(GroupAvatars);
