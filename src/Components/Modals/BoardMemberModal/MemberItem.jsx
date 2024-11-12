import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import { Autocomplete, Button, CircularProgress, TextField } from "@mui/material";
import { memo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { removeMember } from "../../../Services/API/ApiBoard/apiBoard";
import { stringAvatar } from "../../../Utils/color";

const options = ["Member", "Admin"];

function MemberItem({ data, onDeleted, isAdmin = true, disabelRemove = false }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { idBoard } = useParams();

  const [value, setValue] = useState(options[0]);
  const [inputValue, setInputValue] = useState("");

  const handleRemoveMember = () => {
    setIsDeleting(true);
    removeMember(data.id, idBoard)
      .then((res) => {
        toast.success("Removed member");
        if (onDeleted) return onDeleted(data.id);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Remove member unsuccessfully");
      })
      .finally(() => {
        setIsDeleting(false);
        setConfirmDelete(false);
      });
  };

  return (
    <ListItem disableGutters>
      <ListItemButton>
        <>
          <Avatar
            {...stringAvatar(data?.name)}
            alt={data?.name}
            src={data?.avatarUrl}
            sx={{
              width: 32,
              height: 32,
              marginRight: 1,
              fontSize: "16px",
            }}
          />
          <ListItemText sx={{ color: "#172b4d" }} primary={data?.email} />
          {isAdmin && (
            <>
              {confirmDelete || (
                <Autocomplete
                  disableClearable
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  id="controllable-states-demo"
                  options={options}
                  sx={{
                    width: 150,
                    marginRight: 2,
                    "& .MuiAutocomplete": {
                      paddingY: 0,
                    },
                    "& .MuiOutlinedInput-root": {
                      paddingY: 0,
                    },
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              )}
              {!confirmDelete ? (
                <Button
                  disabled={disabelRemove}
                  onClick={() => setConfirmDelete(true)}
                  variant="contained"
                  color="error"
                  sx={{ textTransform: "none", paddingY: 0.5 }}
                >
                  Remove
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    onClick={() => setConfirmDelete(false)}
                    variant="outlined"
                    sx={{ textTransform: "none", paddingY: 0.5 }}
                  >
                    Cancle
                  </Button>
                  <Button
                    onClick={handleRemoveMember}
                    startIcon={isDeleting && <CircularProgress size={18} color="#fff" />}
                    variant="contained"
                    color="error"
                    sx={{ textTransform: "none", paddingY: 0.5 }}
                  >
                    Confirm
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      </ListItemButton>
    </ListItem>
  );
}

MemberItem.propTypes = {
  data: PropTypes.object,
  onDeleted: PropTypes.func,
  isAdmin: PropTypes.bool,
  disabelRemove: PropTypes.bool,
};

export default memo(MemberItem);
