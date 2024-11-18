import { toast } from "react-toastify";
import { apiUploadMultiFile } from "../../../../Services/API/ApiUpload/apiUpload";
import { useCallback, useState } from "react";
import { apiAssignFile } from "../../../Services/API/ApiUpload/apiUpload";

const HandleUploadAvatar = () => {
  const [loading, setLoading] = useState(false);
  const [imageuploadedServer, setImageUploadedServer] = useState("");
  const [imageUploadedApi, setImageUploadApi] = useState("");

  const handleFileChangeAvatar = async (event) => {
    const files = event.target.files;
    if (!files.length) return;
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const validFiles = [];
    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.name} is too large to upload.`);
      } else {
        validFiles.push(file);
      }
    });
    if (!validFiles.length) return;
    setLoading(true);
    const loadToastId = toast.loading("Uploading...");

    try {
      // Tải lên các file song song
      const uploadPromises = validFiles.map((file) => {
        const formData = new FormData();
        formData.append("files", file);
        return apiUploadMultiFile(formData);
      });

      const responses = await Promise.all(uploadPromises);
      toast.dismiss(loadToastId);
      toast.success("Upload successful!");

      // Lấy dữ liệu file đã tải lên
      const uploadedFilesData = responses.flatMap((response) => response.data);
      const uploadedUrls = uploadedFilesData.map((file) => file.url);

      // Cập nhật danh sách file đã tải lên
      setImageUploadApi((prev) => [...prev, ...uploadedFilesData]);

      // Gọi API để đính kèm (gửi) các URL len dữ liệu thẻ (card)
      await handlePostFiles(dataCard.id, uploadedUrls);
      return uploadedFilesData;
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.dismiss(loadToastId);
      toast.error("Failed to upload files.");
    } finally {
      setLoading(false);
    }
  };

  // ============HANDLE POST FILE LEN API==============
  const handlePostFiles = useCallback(
    async (id, allUrls) => {
      try {
        const response = await apiAssignFile(id, allUrls);
        // setPostUploadedFiles(response.data.files);
        return response.data.files;
      } catch (error) {
        console.error("Failed to get uploaded files:", error);
      }
    },
    // [setPostUploadedFiles]
  );

  

  return (
    <div>

    </div>
  )
}
export default HandleUploadAvatar;

