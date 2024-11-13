import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider } from "@mui/material";
import classNames from "classnames/bind";
import styles from "./RightSidebar.module.scss";
import MenuItem from "./MenuItem";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ListIcon from "@mui/icons-material/List";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import ShareIcon from "@mui/icons-material/Share";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SettingMenu from "./SettingMenu";
import { useNavigate, useParams } from "react-router-dom";
import Archived from "./Archived";
import { deleteBoardId, leaveBoard } from "../../Services/API/ApiBoard/apiBoard";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { EQueryKeys } from "../../constants";
import { useListBoardContext } from "../../Pages/ListBoard/ListBoardContext";
import ChangeBackgroundMenu from "./ChangeBackgroundMenu";
import { memo } from "react";
import LabelMenu from "./LabelMenu";

const cx = classNames.bind(styles);

const sizeIcon = 20;

function RightSidebar({ isOpen, onClose }) {
  const { dataBoard } = useListBoardContext();
  const isOwner = dataBoard?.role?.roleName === "admin";

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
        icon: <Inventory2OutlinedIcon sx={{ fontSize: sizeIcon }} />,
        divide: true,
        children: {
          headerTitle: "Archived",
          component: <Archived />,
        },
      },
      {
        title: "Settings",
        icon: <SettingsOutlinedIcon sx={{ fontSize: sizeIcon }} />,
        children: {
          headerTitle: "Settings",
          component: <SettingMenu />,
        },
      },

      {
        title: "Change Background",
        icon: (
          <div className="w-5 h-5 flex">
            <img alt="" className="w-full h-full object-cover rounded-sm" src={dataBoard.coverUrl} />
          </div>
        ),
        children: {
          headerTitle: "Change Background",
          component: <ChangeBackgroundMenu />,
        },
      },
      {
        title: "Power-Ups",
        icon: <RocketLaunchIcon sx={{ fontSize: sizeIcon }} />,
      },
      {
        title: "Labels",
        icon: <LabelOutlinedIcon sx={{ fontSize: sizeIcon }} />,
        children: {
          headerTitle: "Labels",
          component: <LabelMenu />,
        },
        divide: true,
      },
      {
        title: "Watch",
        icon: <RemoveRedEyeOutlinedIcon sx={{ fontSize: sizeIcon }} />,
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
        title: isOwner ? "Close board" : "Leave this board",
        icon: isOwner ? <RemoveIcon sx={{ fontSize: sizeIcon }} /> : <LogoutIcon sx={{ fontSize: sizeIcon }} />,
        onClick: () => setDeleteDialog(true),
      },
    ],
  };

  const [menuItems, setMenuItems] = useState([items]);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id: idWorkSpace, idBoard } = useParams();

  // TODO Xử lý đóng right menu
  const handleClose = (e) => {
    if (onClose) {
      onClose(e);

      // TODO Nếu người dùng vào menu con nhưng chưa back thì reset lại menu ban đầu
      if (menuItems.length > 1) {
        setTimeout(() => {
          setMenuItems([items]);
        }, 400);
      }
    }
  };

  // TODO Quay lại cấp cha của menu đa cấp
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

  //#region  render menuItem
  //TODO render ra giao diện của cấp menu hiện tại
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

  //#region Handle leave
  const handleLeaveBoard = () => {
    if (isOwner) {
      //TODO close board
      deleteBoardId(idBoard)
        .then((res) => {
          queryClient.invalidateQueries({
            queryKey: [EQueryKeys.GET_WORKSPACE_BY_ID],
          });
          toast.success("Close board successfully");
          return navigate(`/workspace/${idWorkSpace}/home`);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Close board not successfully");
        })
        .finally(() => {
          setDeleteDialog(false);
        });
    } else {
      //TODO leave board
      leaveBoard(dataBoard.id)
        .then((res) => {
          //* Gọi lại API get board từ useQuery để reload lại giao diện
          queryClient.invalidateQueries({
            queryKey: [EQueryKeys.GET_WORKSPACE_BY_ID],
          });
          //! chưa load lại được dữ liệu mới ở trang home workspace
          toast.success("Leave board successfully");
          return navigate(`/workspace/${idWorkSpace}/home`);
        })
        .catch((err) => {
          toast.error("Leave board not successfully");
        })
        .finally(() => setDeleteDialog(false));
    }
  };

  useEffect(() => {
    setMenuItems([items]);
    // eslint-disable-next-line
  }, [dataBoard]);

  return (
    <div
      className={cx(["drawer", "absolute top-0 right-0 z-[300]"], {
        open: isOpen,
      })}
    >
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

        <div className="flex flex-col gap-1 px-3 pt-3 pb-2">{renderItems()}</div>
      </div>

      {/* //TODO  Bật lên popup rời khỏi board  */}
      <Dialog
        open={deleteDialog}
        onClose={() => {
          setDeleteDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">{isOwner ? "Close board?" : "Leave board?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {isOwner
              ? `You can find and reopen closed boards at the bottom of your boards page.`
              : `You will be removed from all cards on this board.`}
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
          <Button variant="contained" color="error" onClick={handleLeaveBoard} autoFocus>
            {isOwner ? "Close" : "Leave"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default memo(RightSidebar);
