import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

export const styles = {
  position: "absolute",
  top: 40,
  right: 0,
  left: -10,
  zIndex: 1,
  border: "1px solid",
  p: 1,
  bgcolor: "background.paper",
};

export const expirations = [
  {
    id: 1,
    name: "No expiration date",
    Icon: <CalendarMonthOutlinedIcon style={{ width: "16px", height: "16px", color: "#44546f" }} />,
  },
  {
    id: 2,
    name: "Overdue",
    color: "bg-[#c9372c]",
    Icon: <AccessTimeOutlinedIcon style={{ width: "16px", height: "16px" }} />,
  },
  {
    id: 3,
    name: "Not marked as completed",
    Icon: <AccessTimeOutlinedIcon style={{ width: "16px", height: "16px", color: "#44546f" }} />,
  },
  {
    id: 4,
    name: "Marked Complete",
  },
];
