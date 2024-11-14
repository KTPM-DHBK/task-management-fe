import { Avatar } from "@mui/material";
import React from "react";
import { stringAvatar } from "../../../Utils/color";

export default function ActivityItem({ data = {} }) {
  const actionName = data.action?.split("_").join(" ")?.toLowerCase();
  return (
    <div className="flex gap-3 py-2">
      <Avatar
        {...stringAvatar(data?.user?.name || "")}
        alt={""}
        src={data?.user?.avatarUrl || ""}
        sx={{
          width: 32,
          height: 32,
        }}
      />

      <div className="fex-1">
        <div className="text-sm text-[var(--text-color)]">
          <span>
            <span className="font-semibold">{data?.user?.name}</span>
          </span>{" "}
          {actionName} on{" "}
          <a className="text-[var(--primary)] cursor-pointer hover:underline" href="/">
            {data.card?.title}
          </a>
        </div>
        <div className="text-xs text-[var(--text-color)] hover:underline cursor-pointer">{data.time}</div>
      </div>
    </div>
  );
}
