import { memo, useState } from "react";
import { Slide } from "@mui/material";
import { EditPermissionModal } from "../../Modals/EditPermissionModal";
import BoardMemberModal from "../../Modals/BoardMemberModal";

const styles = {
  permissionHeader: "text-[var(--text-color)] text-[14px] font-semibold py-2 px-3",
  menuItem: "text-sm px-4 py-2 rounded-md hover:bg-slate-100 hover:cursor-pointer"
};

function SettingMenu() {
  const [openRoleManangement, setOpenRoleManangement] = useState(false);
  const [openMemberManagement, setOpenMemberManagement] = useState(false);

  return (
    <>
      <Slide in={true} direction="left">
        <div className="flex flex-col">
          <h1 className={styles.permissionHeader}>Worksapce</h1>
          <div className={styles.menuItem}>BKDN</div>
          <div className="mt-3">
            <h1 className={styles.permissionHeader}>Permissions</h1>
          </div>
          <div className={styles.menuItem}>Commenting</div>
          <div className={styles.menuItem} onClick={() => setOpenRoleManangement(true)}>
            Roles Management
          </div>
          <div className={styles.menuItem} onClick={() => setOpenMemberManagement(true)}>
            Members Management
          </div>
          <div className={styles.menuItem}>Workspace editing</div>

          <div className="mt-3">
            <h1 className={styles.permissionHeader}>Covers</h1>
          </div>

          <div className={styles.menuItem}>Card covers enabled</div>
          <div className="mt-3">
            <h1 className={styles.permissionHeader}>Collections</h1>
          </div>
        </div>
      </Slide>
      {openRoleManangement && (
        <EditPermissionModal
          open={openRoleManangement}
          handleClose={() => setOpenRoleManangement(false)}
        />
      )}
      {openMemberManagement && (
        <BoardMemberModal
          open={openMemberManagement}
          onClose={() => setOpenMemberManagement(false)}
        />
      )}
    </>
  );
}

export default memo(SettingMenu);
