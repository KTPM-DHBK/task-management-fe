import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField
} from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { removeMember } from "../../../Services/API/ApiBoard/apiBoard";
import { stringAvatar } from "../../../Utils/color";
import { useGetBoardRole } from "../../../Hooks/useBoardPermission";
import Loading from "../../Loading";
import { useStorage } from "../../../Contexts";

function MemberItem({ data, onDeleted, isAdmin = true }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [role, setRole] = useState(null);

  const { idBoard } = useParams();
  const { dataBoardRole, isLoading } = useGetBoardRole(idBoard);
  const { userData } = useStorage();

  const roleOptions = useMemo(
    () =>
      dataBoardRole?.map((role) => ({ label: role.name, value: role.id })) ||
      [],
    [dataBoardRole]
  );

  useEffect(() => {
    if (!data) return;
    setRole({ label: data.role.name, value: data.role.id });
  }, [data]);

  const handleRemoveMember = () => {
    setIsDeleting(true);
    removeMember(data.id, idBoard)
      .then(() => {
        toast.success("Removed member");
        if (onDeleted) return onDeleted(data.id);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Remove member unsuccessfully");
      })
      .finally(() => {
        setIsDeleting(false);
        setConfirmDelete(false);
      });
  };

  if (isLoading || !dataBoardRole || !userData) return <Loading />;

  return (
    <ListItem disableGutters>
      <div className="flex gap-2 w-full hover:bg-slate-100 p-2 rounded-md items-center">
        <div className="flex-1 flex">
          <Avatar
            {...stringAvatar(data?.name)}
            alt={data?.name}
            src={data?.avatarUrl}
            sx={{
              width: 32,
              height: 32,
              marginRight: 1,
              fontSize: "16px"
            }}
          />
          <ListItemText sx={{ color: "#172b4d" }} primary={data?.email} />
        </div>
        {isAdmin && (
          <div className="flex-1 flex">
            <Autocomplete
              fullWidth
              disableClearable
              value={role}
              onChange={(_, newValue) => setRole(newValue)}
              getOptionLabel={(option) => option.label}
              getOptionKey={(option) => option.value}
              options={roleOptions}
              size="small"
              renderInput={(params) => <TextField {...params} />}
              style={{ display: confirmDelete ? "none" : "block" }}
            />
            <Button
              disabled={userData.id === data.id}
              onClick={() => setConfirmDelete(!confirmDelete)}
              variant="contained"
              color="error"
              sx={{ textTransform: "none", paddingY: 0.5, marginLeft: 1 }}
            >
              {confirmDelete ? "Cancel" : "Remove"}
            </Button>
            {confirmDelete && (
              <Button
                onClick={handleRemoveMember}
                startIcon={
                  isDeleting && <CircularProgress size={18} color="#fff" />
                }
                variant="contained"
                color="error"
                sx={{ textTransform: "none", paddingY: 0.5 }}
              >
                Confirm
              </Button>
            )}
          </div>
        )}
      </div>
    </ListItem>
  );
}

MemberItem.propTypes = {
  data: PropTypes.object,
  onDeleted: PropTypes.func,
  isAdmin: PropTypes.bool
};

export default memo(MemberItem);
