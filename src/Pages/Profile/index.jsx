import { Button, Divider, TextField } from '@mui/material';
import React from 'react';
import PublicIcon from '@mui/icons-material/Public';

const tabItemStyles =
  'text-sm w-fit text-[var(--dark-slate-blue)] font-bold pt-2 pb-[9px] cursor-pointer hover:text-[var(--primary)] mr-4';
export default function Profile() {
  return (
    <div>
      <div>
        <div className="max-w-[875px] pl-[48px] pr-8 py-[26px] flex">
          <div className="py-5 flex">
            <div className="flex justify-center items-center w-12 h-12 rounded-full mr-4">
              <img
                alt=""
                className="w-full h-full object-cover rounded-full"
                src="https://trello-members.s3.amazonaws.com/6411cb0b756e170127733b34/3cb3638a4c4bac4f4213caa087029bb6/170.png"
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[var(--text-color)] text-xl font-semibold">Nhân Bùi</h2>
              <span className="text-[#44546f] text-xs">@nhanbui32</span>
            </div>
          </div>
        </div>
      </div>

      <ul className="mx-12 border-b-2 border-gray-200 border-solid flex">
        <li className={tabItemStyles}>Profile and visibility</li>
        <li className={tabItemStyles}>Activity</li>
        <li className={tabItemStyles}>Cards</li>
        <li className={tabItemStyles}>Settings</li>
      </ul>

      <div className="max-w-[900px] p-8 m-auto">
        <div className="max-w-[530px] m-auto flex flex-col">
          <img className="mt-[18px] mb-12" src="https://trello.com/assets/eff3d701a9c3a71105ea.svg" alt="" />

          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-color)] mb-[10px]">
              Manage your personal information
            </h1>
            <p className="bg-[var(--hover-background)] p-4 mb-2 text-sm text-[var(--dark-slate-blue)]">
              This is an Atlassian account. Edit your personal information and visibility settings through your{' '}
              <a
                className="text-[var(--primary)]"
                href="https://id.atlassian.com/manage-profile"
                target="_blank"
                rel="noopener noreferrer"
              >
                Atlassian profile
              </a>
              . To learn more, view our{' '}
              <a
                className="text-[var(--primary)]"
                href="https://www.atlassian.com/legal/cloud-terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>{' '}
              or{' '}
              <a
                className="text-[var(--primary)]"
                href="https://www.atlassian.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>

          <h3 className="mb-2 mt-10 text-[20px] font-semibold text-[var(--text-color)]">About</h3>
          <Divider component={'div'} />

          <div className="flex flex-col ">
            <div className="flex my-3 justify-between">
              <label className="pt-4 text-sm text-[var(--text-color)] font-semibold">Username</label>
              <div className="pt-4 flex items-center text-[var(--dark-slate-blue)]">
                <PublicIcon color="#44546f" sx={{ width: '16px', height: '16px', mr: 0.5 }} />
                <div className="text-xs">Always public</div>
              </div>
            </div>
            <TextField
              sx={{
                '& .MuiInputBase-input': {
                  paddingY: '8px',
                  paddingX: '12px',
                  fontSize: 14,
                },
              }}
            />
          </div>

          <div className="flex flex-col ">
            <div className="flex my-3 justify-between">
              <label className="pt-4 text-sm text-[var(--text-color)] font-semibold">Bio</label>
              <div className="pt-4 flex items-center text-[var(--dark-slate-blue)]">
                <PublicIcon color="#44546f" sx={{ width: '16px', height: '16px', mr: 0.5 }} />
                <div className="text-xs">Always public</div>
              </div>
            </div>
            <textarea className="border border-gray-500 border-solid" />
          </div>

          <Button
            variant="contained"
            sx={{
              mt: 4,
              textTransform: 'none',
              height: '32px',
              paddingY: '6px',
              paddingX: '12px',
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}