import List from "@mui/material/List";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { CircularProgress, TextField } from "@mui/material";
import HeadlessTippy from "@tippyjs/react/headless";
import UserItem from "../InviteWorkspace/UserItem";
import { memo, useEffect, useState } from "react";
import { getAllMembersByIdBoard } from "../../../Services/API/ApiBoard/apiBoard";
import { useDebounce } from "../../../Hooks";
import { userServices } from "../../../Services";
import { useStorage } from "../../../Contexts";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";

import MemberItem from "./MemberItem";

function BoardMemberModal({ open = false, onClose }) {
  const { idBoard } = useParams();
  const handleClose = () => {
    onClose();
  };

  const [searchValue, setSearchValue] = useState("");
  const [members, setMembers] = useState([]);

  const debounceValue = useDebounce(searchValue, 500);
  const [searchResult, setSearchResult] = useState([]);
  const { userData } = useStorage();

  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveSuccess = (idUser) => {
    setMembers((prev) => {
      let newState = [...prev];
      newState = newState.filter((user) => user.id !== idUser);
      return newState;
    });
  };

  const handleAddSuccess = (userData) => {
    let newMember = { ...userData };
    delete newMember.isExisted;
    newMember.role = {
      id: 3,
      name: "member",
    };
    setMembers((prev) => [...prev, newMember]);
  };

  useEffect(() => {
    if (!debounceValue.trim()) {
      setSearchResult([]);
      return;
    }

    const fetchApi = async () => {
      setIsLoading(true);
      userServices
        .searchUser(debounceValue)
        .then((res) => res.data)
        .then((data) => {
          const users = data.data.map((user) => {
            user.isExisted = members.find((item) => item.id === user.id) ? true : false;
            return user;
          });
          setSearchResult(users);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    fetchApi();
    // eslint-disable-next-line
  }, [debounceValue]);

  useEffect(() => {
    getAllMembersByIdBoard(idBoard)
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        let members = data.map((item) => {
          item.user.role = item.role;
          return item.user;
        });
        setMembers(members);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line
  }, []);

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      sx={{
        "& .MuiDialog-paper": {
          height: "100%",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle width={"600px"} sx={{ textAlign: "center", color: "#172b4d" }}>
        Members on board
        <button
          onClick={handleClose}
          className="float-right rounded-full w-9 h-9 flex items-center justify-center hover:bg-slate-100"
        >
          <CloseIcon />
        </button>
      </DialogTitle>
      <List sx={{ pt: 0 }}>
        {members.map((item, index) => {
          const disable = item.id === userData.id;

          return <MemberItem disabelRemove={disable} onDeleted={handleRemoveSuccess} key={index} data={item} />;
        })}

        <div className="px-3">
          <div className="mb-2 ">
            <HeadlessTippy
              zIndex={999}
              placement="bottom"
              offset={[0, 0]}
              visible={searchResult.length > 0}
              interactive
              render={(props) => (
                <div className="bg-white w-[600px] p-5">
                  <div className="shadow-lg border border-solid border-slate-200 rounded-md p-5">
                    {searchResult.map((item, index) => (
                      <UserItem onAdded={handleAddSuccess} data={item} key={index} />
                    ))}
                  </div>
                </div>
              )}
            >
              <div>
                <TextField
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Email address or name"
                  sx={{
                    width: "100%",
                    "& .MuiInputBase-input": {
                      paddingY: "8px",
                      paddingX: "12px",
                      fontSize: "14px",
                      fontWeight: 400,
                    },
                  }}
                />
              </div>
            </HeadlessTippy>
            {isLoading && (
              <div className="w-full flex justify-center mt-4">
                <CircularProgress />
              </div>
            )}
          </div>
        </div>
      </List>
    </Dialog>
  );
}

BoardMemberModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default memo(BoardMemberModal);
