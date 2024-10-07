import { Switch } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from 'react';
import NotificationsItem from './NotificationItem';

const NotificationsTab = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white mt-2 shadow-lg rounded-xl w-[400px] border-[1px] border-solid border-slate-200 max-h-[623px]"
    >
      <div className="mt-10 mx-[10px] pb-5 border-b-1">
        <div className="flex justify-between border-b-[1px] border-solid border-slate-200">
          <h2 className="text-[20px] text-[var(--text-color)] font-semibold">Notifications</h2>
          <div>
            <span className="text-[12px] text-[var(--light-gray)]">Only show unread</span>
            <Switch
              defaultChecked
              sx={{
                '& .css-jsexje-MuiSwitch-thumb': {
                  backgroundColor: '#fff',
                },
              }}
            />
            <MoreVertIcon className="text-[var(--light-gray)]" />
          </div>
        </div>
        <div className="py-2 pl-3 pr-4 flex justify-end">
          <span className="text-[var(--light-gray)] text-[12px]">Mark all as read</span>
        </div>
      </div>
      <div className="bg-[var(--light-blue)] rounded-b-xl">
        <div className="py-2 max-h-[500px] overflow-y-scroll">
          <NotificationsItem />
          <NotificationsItem />
          <NotificationsItem />
          <NotificationsItem />
          <NotificationsItem />
        </div>
      </div>
    </div>
  );
});

export default NotificationsTab;