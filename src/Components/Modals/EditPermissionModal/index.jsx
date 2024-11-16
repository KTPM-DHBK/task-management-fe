import { Autocomplete, Button, Modal, Switch, TextField } from "@mui/material";
import Loading from "../../Loading";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CenterModel } from "../styles";
import { CreateNewRoleModal } from "./CreateNewRoleModal";
import { PERMISSIONS } from "../../../constants/permission";
import { capitalize } from "lodash";
import { useGetBoardRole } from "../../../Hooks/useBoardPermission";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { updateBoardPermission } from "../../../Services/API/apiBoardPermission";

export const EditPermissionModal = ({ open: defaultOpen, handleClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openCreateRoleModal, setOpenCreateRoleModal] = useState(false);
  const { handleSubmit, getValues, watch, setValue, control } = useForm();
  const { idBoard } = useParams();

  const { dataBoardRole, isLoading: isLoadingRole } = useGetBoardRole(idBoard);

  const RoleOptions = useMemo(() => {
    const roles = [{ value: "newRole", label: "Create New Role" }];
    if (dataBoardRole) {
      dataBoardRole.forEach((role) => {
        roles.push({
          value: role.id,
          label: role.name
        });
      });
    }
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

  const onSubmit = async (data) => {
    setIsLoading(true);

    const payload = data.permissions.map((permission) => ({
      roleId: data.role.value,
      permissionId: permission
    }));
    const response = await updateBoardPermission(idBoard, payload);
    console.log(payload);
  };
  console.log(watch("permissions"));
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

  useEffect(() => {
    if (watchRole?.value === "newRole") {
      setValue("role", null);
      setOpenCreateRoleModal(true);
    }

    // eslint-disable-next-line
  }, [watchRole]);

  const loading = isLoading || isLoadingRole || !dataBoardRole;

  return (
    <>
      {loading && <Loading />}
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
                    renderInput={(params) => <TextField {...params} label="Role" />}
                    onChange={(_, data) => field.onChange(data)}
                  />
                )}
              />
              <div className="w-60 h-full">
                <Button variant="contained" size="medium" type="submit" fullWidth>
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
                  <div className="w-1/12 font-semibold">{capitalize(permission.title)}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-1">
                    {permission.children.map((child) => {
                      const permissions = watch("permissions") || [];
                      const isChecked = permissions.includes(child.id);

                      return (
                        <div className="flex gap-2 items-center w-full" key={child.title}>
                          <Controller
                            name={`permissions.${child.id}`}
                            control={control}
                            render={() => (
                              <Switch
                                checked={isChecked}
                                onChange={(_, value) => handleChange(child, value)}
                              />
                            )}
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
