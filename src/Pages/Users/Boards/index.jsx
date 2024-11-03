import { useGetBoardWorkspace, useGetWorkspaceByUser } from "../../../Hooks";
import Loading from "../../../Components/Loading";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useState } from "react";
import WorkspaceItem from "./WorkspaceItem";

const UserBoards = () => {
  const [open, setOpen] = useState(false);
  const { workspaceBoard } = useGetBoardWorkspace();
  const { isLoading: isLoadingWorkspace } = useGetWorkspaceByUser();

  // const { workspaceDetails } = useGetWorkspaceById(workspaceInfo[0].id);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {isLoadingWorkspace && <Loading />}
      <div>
        <div className="flex items-center mb-2 text-textColor">
          <AccessTimeIcon />
          <span className="ml-2 text-xl font-bold">YOUR WORKSPACES</span>
        </div>
        {workspaceBoard?.map((wspItem) => {
          return (
            <div className="mt-6 mb-8">
              <WorkspaceItem
                key={wspItem.id}
                wspItem={wspItem}
                handleOpen={handleOpen}
                handleClose={handleClose}
                open={open}
              />{" "}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default UserBoards;
