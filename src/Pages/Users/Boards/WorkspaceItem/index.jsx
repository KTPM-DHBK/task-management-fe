import React from "react";
import { CreateNewBoard } from "../../../../Components/Modals/CreateNewBoard/CreateNewBoard";
import { Board } from "../../../../Components/Board/Board";
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';

const WorkspaceItem = ({ wspItem, handleClose, open, handleOpen }) => {
  return (
    <div>
      <div className="flex items-center justify-between my-4">
        <div className="flex items-center">
          <div className="flex items-center justify-center bg-orange-400 rounded-md w-9 h-9">
            <p>{wspItem?.title[0]}</p>
          </div>
          <p className="ml-2 font-bold">{wspItem?.title}</p>
        </div>
        <div className="flex items-center">
          <button className="px-[10px] py-[6px] mr-2 flex items-center bg-gray-200 rounded-sm">
            <PeopleIcon sx={{fontSize: '22px', marginRight: '4px'}}/>
            Member
          </button>
          <button className="px-[10px] py-[6px] mr-2 flex items-center bg-gray-200 rounded-sm">
            <SettingsIcon sx={{fontSize: '22px', marginRight: '4px'}}/>
            Settings
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wspItem?.boards?.map((board, index) => {
          return <Board key={index} board={board} />;
        })}
        <button
          onClick={handleOpen}
          className="flex items-center justify-center w-[12rem] h-[110px] rounded-lg bg-slate-200 hover:brightness-95 hover:cursor-pointer"
        >
          <p className="text-sm text-textColor">Create new board</p>
        </button>
        <CreateNewBoard open={open} handleClose={handleClose} />
      </div>
    </div>
  );
};

export default WorkspaceItem;
