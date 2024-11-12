import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ItemMenu from "../../ItemMenu";
import { useState } from "react";
import BoardMemberModal from "../../Modals/BoardMemberModal";
import { useListBoardContext } from "../../../Pages/ListBoard/ListBoardContext";
import { deleteBoardId, leaveBoard } from "../../../Services/API/ApiBoard/apiBoard";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { EQueryKeys } from "../../../constants";
import { toast } from "react-toastify";

function NavbarBoard({ isChooseMoveList, handleLeaveBoard, toggleCollape }) {
  const [memberPopup, setMemberPopup] = useState(false);
  const { dataBoard } = useListBoardContext();
  const { idBoard, idWorkSpace } = useParams();
  const [leaving, setLeaving] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isAdmin = dataBoard.role?.roleName === "admin";
  const handleCloseOrLeave = () => {
    setLeaving(true);
    if (isAdmin) {
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
          setLeaving(false);
        });
    } else {
      //TODO leave board
      leaveBoard(idBoard)
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
        .finally(() => setLeaving(false));
    }
  };

  return (
    <>
      <div className="absolute w-[250px] bg-white rounded-[8px] py-2 font-medium text-[12px] z-50 shadow-[0_3px_10px_rgba(0,0,0,0.3)]">
        <div className="text-center p-2 mx-8">{dataBoard.title}</div>
        <div
          className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={toggleCollape}
        >
          <div>{dataBoard?.role?.roleName === "admin" ? "Close board" : "Leave board"}</div>
          <ChevronRightIcon fontSize="small" />
        </div>
        <div
          onClick={() => setMemberPopup(true)}
          className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          <div className="">Members manager</div>
        </div>
        <CloseIcon
          onClick={handleLeaveBoard}
          className="cursor-pointer absolute right-3 top-3 p-1 rounded-[4px] hover:bg-gray-100 "
        />
      </div>
      {isChooseMoveList && (
        <ItemMenu
          title={dataBoard.role?.roleName === "admin" ? "Close this board" : "Do you want to leave the board?"}
          description={
            dataBoard.role?.roleName === "admin"
              ? "You can find and reopen closed boards at the bottom of your boards page."
              : "You will be removed from all cards in this table"
          }
          nameBtn={dataBoard.role?.roleName === "admin" ? "Close" : "Leave"}
          onClose={handleLeaveBoard}
          onBack={toggleCollape}
          onClickConfirm={handleCloseOrLeave}
          loading={leaving}
        />
      )}

      <BoardMemberModal
        onClose={() => {
          setMemberPopup(false);
        }}
        open={memberPopup}
      />
    </>
  );
}

export default NavbarBoard;
