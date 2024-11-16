import {
  Autocomplete,
  Button,
  Checkbox,
  Modal,
  Switch,
  TextField
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { capitalize } from "lodash";

import Loading from "../../Loading";
import { CenterModel } from "../styles";
import { CreateNewRoleModal } from "./CreateNewRoleModal";
import { PERMISSIONS } from "../../../constants/permission";
import { useGetBoardRole } from "../../../Hooks/useBoardPermission";
import { updateBoardPermission } from "../../../Services/API/apiBoardPermission";
import { EQueryKeys } from "../../../constants";

export const EditPermissionModal = ({ open: defaultOpen, handleClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [checkedAll, setCheckedAll] = useState({
    board: false,
    list: false,
    card: false,
    comment: false,
    tag: false
  });
  const [openCreateRoleModal, setOpenCreateRoleModal] = useState(false);

  const { handleSubmit, getValues, watch, setValue, control } = useForm();
  const { idBoard } = useParams();
  const queryClient = useQueryClient();

  const { dataBoardRole, isLoading: isLoadingRole } = useGetBoardRole(idBoard);

  const RoleOptions = useMemo(() => {
    if (!dataBoardRole) return [];
    const roles = [{ value: "newRole", label: "Create New Role" }];
    dataBoardRole.forEach((role) => {
      roles.push({
        value: role.id,
        label: role.name
      });
    });
    return roles;
  }, [dataBoardRole]);

  const PermissionGridConstants = useMemo(() => {
    return PERMISSIONS.reduce((acc, permission) => {
      if (!acc.find((p) => p.title === permission.module)) {
        acc.push({
          title: permission.module,
          children: []
        });
      }
      const index = acc.findIndex((p) => p.title === permission.module);
      acc[index].children.push({
        id: permission.id,
        title: permission.displayName
      });
      return acc;
    }, []);
  }, []);

  const watchRole = watch("role");
  const watchPermissionByRole = watch("permissions");

  const onSubmit = async (data, e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = data.permissions.map((permission) => ({
      roleId: data.role.value,
      permissionId: permission
    }));
    updateBoardPermission(idBoard, payload)
      .then(() => {
        queryClient.invalidateQueries([EQueryKeys.GET_BOARD_PERMISSION]);
        toast.success("Permission updated successfully");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error updating permission");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChange = (permission, value) => {
    if (!watch("role")) {
      toast.error("Please select a role first");
      return;
    }
    const formValues = getValues("permissions") || [];
    const updatedPermissions = value
      ? [...formValues, permission.id].filter(Boolean)
      : formValues.filter((p) => p !== permission.id);
    const uniquePermissions = [...new Set(updatedPermissions)];
    setValue("permissions", uniquePermissions);
  };

  const handleCheckedAll = (module, value) => {
    setCheckedAll((prev) => ({
      ...prev,
      [module]: value
    }));
    const modulePermission = PERMISSIONS.filter(
      (permission) => permission.module === module
    ).map((child) => child.id);

    const currentPermissions = getValues("permissions") || [];

    const updatedPermissions = value
      ? [...new Set([...currentPermissions, ...modulePermission])]
      : currentPermissions.filter((perm) => !modulePermission.includes(perm));

    setValue("permissions", updatedPermissions);
  };

  useEffect(() => {
    if (watchRole?.value === "newRole") {
      setValue("role", null);
      setOpenCreateRoleModal(true);
      return;
    }

    const permissionsByRole = dataBoardRole
      ?.find((role) => role.id === watchRole?.value)
      ?.permissionRoles.map((permission) => permission.permissionId);
    setValue("permissions", permissionsByRole);
    setCheckedAll({});
    // eslint-disable-next-line
  }, [watchRole, dataBoardRole]);

  useEffect(() => {
    // Update checkedAll state based on permissions
    if (watchRole?.value === "newRole") return;
    const updatedCheckedAll = {};

    PermissionGridConstants.forEach((permission) => {
      const modulePermission = PERMISSIONS.filter(
        (perm) => perm.module === permission.title
      ).map((child) => child.id);

      const allChecked = modulePermission.every((perm) =>
        watchPermissionByRole?.includes(perm)
      );

      updatedCheckedAll[permission.title] = allChecked;
    });

    setCheckedAll(updatedCheckedAll);
    // eslint-disable-next-line
  }, [watchPermissionByRole, watchRole]);

  const loading = isLoading || isLoadingRole || !dataBoardRole;

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[1400]">
          <Loading />
        </div>
      )}
      <Modal
        open={defaultOpen}
        onClose={() => {
          handleClose();
        }}
      >
        <form
          className={`w-3/4 overflow-x-hidden flex flex-col items-center p-6 rounded-md bg-white ${CenterModel}`}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="text-2xl font-bold mb-6">Edit Role & Permission</div>
          <div className="w-full">
            <div className="flex w-full gap-4 items-center max-sm:flex-col max-sm:items-start mb-4 font-semibold">
              <div className="w-1/12">Role</div>
              <Controller
                name="role"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    fullWidth
                    size="small"
                    options={RoleOptions}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField {...params} label="Role" />
                    )}
                    onChange={(_, data) => field.onChange(data)}
                  />
                )}
              />
              <div className="w-60 h-full">
                <Button
                  variant="contained"
                  size="medium"
                  type="submit"
                  fullWidth
                >
                  Save new settings
                </Button>
              </div>
            </div>
            <div className="w-full flex flex-col gap-2 max-h-[75vh] overflow-y-scroll">
              {PermissionGridConstants.map((permission) => (
                <div
                  className="flex items-center w-full gap-4 border-b border-slate-100"
                  key={permission.title}
                >
                  <Checkbox
                    checked={checkedAll[permission.title]}
                    onChange={(e) => {
                      handleCheckedAll(permission.title, e.target.checked);
                    }}
                  />
                  <div className="w-1/12 font-semibold">
                    {capitalize(permission.title)}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-1">
                    {permission.children.map((child) => {
                      return (
                        <div
                          className="flex gap-2 items-center w-full"
                          key={child.title}
                        >
                          <Switch
                            checked={watchPermissionByRole?.includes(child.id)}
                            onChange={(_, value) => {
                              handleChange(child, value);
                            }}
                          />
                          <div>{child.title}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>
      {openCreateRoleModal && (
        <CreateNewRoleModal
          open={openCreateRoleModal}
          handleClose={() => {
            setOpenCreateRoleModal(false);
          }}
        />
      )}
    </>
  );
};
