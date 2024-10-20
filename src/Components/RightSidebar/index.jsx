import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider } from "@mui/material";
import classNames from "classnames/bind";
import styles from "./RightSidebar.module.scss";
import MenuItem from "./MenuItem";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ListIcon from "@mui/icons-material/List";
import InventoryIcon from "@mui/icons-material/Inventory";
import SettingsIcon from "@mui/icons-material/Settings";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import LabelIcon from "@mui/icons-material/Label";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ShareIcon from "@mui/icons-material/Share";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SettingMenu from "./SettingMenu";

const cx = classNames.bind(styles);

const sizeIcon = 20;

export default function RightSidebar({ isOpen, onClose }) {
  const items = {
    headerTitle: "Menu",
    data: [
      {
        title: "About this board",
        icon: <ErrorOutlineIcon sx={{ fontSize: sizeIcon }} />,
      },
      {
        title: "Activity",
        icon: <ListIcon sx={{ fontSize: sizeIcon }} />,
      },
      {
        title: "Archived Items",
        icon: <InventoryIcon sx={{ fontSize: sizeIcon }} />,
        divide: true,
      },
      {
        title: "Settings",
        icon: <SettingsIcon sx={{ fontSize: sizeIcon }} />,
        children: {
          headerTitle: "Settings",
          data: [{ title: "Workspace" }, { title: "Permisison" }, { title: "Cover" }, { title: "Collection" }],
          component: <SettingMenu />,
        },
      },
      {
        title: "Power-Ups",
        icon: <RocketLaunchIcon sx={{ fontSize: sizeIcon }} />,
      },
      {
        title: "Labels",
        icon: <LabelIcon sx={{ fontSize: sizeIcon }} />,
        divide: true,
      },
      {
        title: "Watch",
        icon: <RemoveRedEyeIcon sx={{ fontSize: sizeIcon }} />,
      },
      {
        title: "Coppy board",
        icon: <ContentCopyIcon sx={{ fontSize: sizeIcon }} />,
      },
      {
        title: "Email to board",
        icon: <MailOutlineIcon sx={{ fontSize: sizeIcon }} />,
      },
      {
        title: "Print,export and share",
        icon: <ShareIcon sx={{ fontSize: sizeIcon }} />,
      },
      {
        title: "Leave this board",
        icon: <LogoutIcon sx={{ fontSize: sizeIcon }} />,
        onClick: () => setDeleteDialog(true),
      },
    ],
  };

  const [menuItems, setMenuItems] = useState([items]);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleClose = (e) => {
    if (onClose) {
      onClose(e);

      //* Nếu người dùng vào menu con nhưng chưa back thì reset lại menu ban đầu
      if (menuItems.length > 1) {
        setTimeout(() => {
          setMenuItems([items]);
        }, 400);
      }
    }
  };

  const handleBack = () => {
    if (menuItems.length > 1) {
      setMenuItems((prev) => {
        const newState = [...prev];
        const length = newState.length;
        newState.splice(length - 1, 1);
        return newState;
      });
    }
  };

  const renderItems = () => {
    const component = menuItems[menuItems.length - 1].component;
    if (component) return component;
    return menuItems[menuItems.length - 1].data?.map((item, index) => {
      const isParent = item.children ? true : false;
      const handleChange = () => {
        if (isParent) {
          return setMenuItems((prev) => [...prev, item.children]);
        }
        if (item.onClick) return item.onClick();
      };
      return (
        <div key={index}>
          <MenuItem onChange={handleChange} icon={item?.icon}>
            {item.title}
          </MenuItem>
          {item.divide && (
            <div className="py-1">
              <Divider component={"div"} />
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className={cx(["drawer", "absolute top-0 right-0 z-[999]"], { open: isOpen })}>
      <div className={cx(["w-[339px] flex bg-white border-l border-solid border-gray-300 flex-col h-full"])}>
        <div className="px-3">
          <div className="flex items-center justify-between">
            {menuItems.length > 1 && (
              <button
                onClick={handleBack}
                className="w-8 h-8 flex items-center justify-center hover:bg-[var(--hover-background)] rounded-md"
              >
                <ChevronLeftIcon sx={{ fontSize: 24 }} />
              </button>
            )}
            <h3 className="flex-1 text-center my-[18px] mx-8 text-base font-semibold text-[var(--text-color)]">
              {menuItems[menuItems.length - 1]?.headerTitle}
            </h3>
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-[var(--hover-background)]"
            >
              <CloseIcon sx={{ fontSize: "20px", color: "var(--text-color)" }} />
            </button>
          </div>

          <Divider component={"div"} />
        </div>

        <div className="px-3 pt-3 pb-2 flex flex-col gap-1">{renderItems()}</div>
      </div>

      <Dialog
        open={deleteDialog}
        onClose={() => {
          setDeleteDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Close board?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can find and reopen closed boards at the bottom of your boards page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialog(false);
            }}
          >
            Disagree
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setDeleteDialog(false);
            }}
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
