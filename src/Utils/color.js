export function stringToColor(string) {
  if (!string) return "#000000";

  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

export function stringAvatar(name) {
  if (!name) return null;
  return {
    sx: {
      bgcolor: stringToColor(name)
    },
    children: `${name.charAt(0).toUpperCase()}`,
    title: name
  };
}

function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace("#", "");
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}

function rgbToHex(color) {
  // Kiểm tra nếu đầu vào đã là mã hex
  if (color.startsWith("#")) {
    return color;
  }

  // Nếu đầu vào là mã RGB, chuyển đổi sang hex
  const rgbValues = color.match(/\d+/g);
  return "#" + rgbValues?.map((value) => ("0" + parseInt(value).toString(16)).slice(-2)).join("");
}

export function contrastTextColor(colorCode) {
  const hexColor = rgbToHex(colorCode);
  const textColor = getContrastYIQ(hexColor);
  return textColor;
}
