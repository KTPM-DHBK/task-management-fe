import { Button, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CenterModel } from "../styles";
import { useForm } from "react-hook-form";
import { SearchMember } from "../../SearchMember/SearchMember";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { workspaceServices } from "../../../Services";
import { EQueryKeys, EMemberRole } from "../../../constants";
import { defaultInviteMemberValues } from "./InviteMember.constant";
import { useParams } from "react-router-dom";

export const InviteMemberModal = ({ open, handleClose }) => {
  const queryClient = new QueryClient();
  const { id: workspaceId } = useParams();
  const { handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: defaultInviteMemberValues
  });

  const mutation = useMutation({
    mutationFn: (userId) =>
      workspaceServices.addWorkspaceMember(
        userId,
        workspaceId,
        EMemberRole.MEMBER
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [EQueryKeys.GET_WORKSPACE_BY_USER]
      });
    },
    onSettled: () => {
      handleClose();
      reset(defaultInviteMemberValues);
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data.members);
  };

  const handleChange = (_, newValue) => {
    if (!newValue) {
      setValue("members", "");
      return;
    }
    setValue("members", newValue?.id);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
      }}
    >
      <form
        className={`bg-white p-8 flex flex-col gap-4 ${CenterModel} w-1/4 rounded-xl`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-between items-center">
          <div className="font-bold text-2xl">Invite to Workspace</div>
          <div
            onClick={() => handleClose()}
            className="hover:cursor-pointer hover:bg-slate-200 rounded-full p-1"
          >
            <CloseIcon />
          </div>
        </div>
        <SearchMember onChange={handleChange} multiple={false} />
        {watch("members") ? (
          <Button variant="contained" type="submit">
            Add
          </Button>
        ) : null}
      </form>
    </Modal>
  );
};