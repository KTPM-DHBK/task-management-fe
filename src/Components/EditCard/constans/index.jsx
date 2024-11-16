import {
  Person4Outlined as Person4OutlinedIcon,
  Label as LabelIcon,
  AccessTimeOutlined as AccessTimeOutlinedIcon,
  SaveAsOutlined as SaveAsOutlinedIcon,
  BackupTableOutlined as BackupTableOutlinedIcon,
} from "@mui/icons-material";

export const listBtnCard = [
  {
    id: 1,
    nameBtn: "Open Card",
    Icon: <SaveAsOutlinedIcon className="mr-2 ml-1" fontSize="small" />,
  },
  {
    id: 2,
    nameBtn: "Edit label",
    Icon: <LabelIcon className="mr-2 ml-1" fontSize="small" />,
  },
  {
    id: 3,
    nameBtn: "Change Membership",
    Icon: <Person4OutlinedIcon className="mr-2 ml-1" fontSize="small" />,
  },
  {
    id: 4,
    nameBtn: "Change cover",
    Icon: <SaveAsOutlinedIcon className="mr-2 ml-1" fontSize="small" />,
  },
  {
    id: 5,
    nameBtn: "Edit date",
    Icon: <AccessTimeOutlinedIcon className="mr-2 ml-1" fontSize="small" />,
  },
  {
    id: 8,
    nameBtn: "Storage",
    Icon: <BackupTableOutlinedIcon className="mr-2 ml-1" fontSize="small" />,
  },
];
