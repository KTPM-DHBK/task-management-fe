import { Autocomplete, Avatar } from "@mui/material";
import { TextField } from "@mui/material";
import { useState } from "react";
import { useDebounce, useGetUser } from "../../Hooks";
import { useEffect } from "react";
import Loading from "../Loading";

export const SearchMember = (
  { isShowDescription, register, onChange, multiple } = {
    isShowDescription: true,
    multiple: true
  }
) => {
  const [searchMember, setSearchMember] = useState("");
  const [searchOptions, setSearchOptions] = useState([]);
  const debounceSearchMember = useDebounce(searchMember, 500);

  const { userInfo, isLoading } = useGetUser({
    search: debounceSearchMember
  });

  useEffect(() => {
    if (userInfo?.data) setSearchOptions(userInfo.data);
    // eslint-disable-next-line
  }, [JSON.stringify(userInfo)]);

  return (
    <div className="flex flex-col gap-1">
      <div className="font-bold">Workspace members</div>
      <Autocomplete
        {...register}
        onChange={onChange}
        multiple={multiple}
        options={searchOptions}
        getOptionLabel={(option) => option.name}
        getOptionKey={(option) => option.id}
        blurOnSelect={false}
        filterSelectedOptions
        disableCloseOnBlur
        noOptionsText={
          isLoading ? (
            <div className="h-10">
              <Loading size={20} />
            </div>
          ) : (
            "No options"
          )
        }
        onInputChange={(_, newInputValue) => {
          setSearchMember(newInputValue);
        }}
        renderInput={(params) => (
          <TextField {...params} placeholder="Find members" />
        )}
        renderOption={(props, option) =>
          !searchOptions.length && isLoading ? (
            <Loading />
          ) : (
            <li {...props}>
              <div className="flex items-center">
                <Avatar
                  src={option.avatarUrl}
                  sx={{ width: 20, height: 20 }}
                  alt={option.name?.[0]}
                ></Avatar>
                <div className="ml-2">{option.name}</div>
              </div>
            </li>
          )
        }
      />
      {isShowDescription && (
        <div>
          Add members to your Workspace so they can collaborate on boards.
        </div>
      )}
    </div>
  );
};
