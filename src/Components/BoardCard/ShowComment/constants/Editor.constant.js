export const editorInit = {
  images_upload_url:
    "https://api-task-management-production.up.railway.app/api/upload/file",
  referrer_policy: "origin",
  height: 340,
  licenseKey: "gpl",
  width: "100%",
  menubar: false,
  forced_root_block: "p",
  newline_behavior: "",
  statusbar: false,
  branding: false,
  plugins: ["advlist", "autolink", "lists", "link", "image"],
  toolbar:
    "code fullscreen visualblocks | undo redo bold italic alignleft aligncenter alignright | link image media",
  content_style: `
    img {
      max-width: 100%;
      height: 80%;
    }
  `
};
