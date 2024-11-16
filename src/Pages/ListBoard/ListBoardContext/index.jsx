import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { CreateList } from "../../../Services/API/ApiListOfBoard";
import { createCardByIdList, getAllCardByIdList } from "../../../Services/API/ApiCard";
import {
  getAllMembersByIdBoard,
  getBoardId,
  getWorkspaceById,
  updateBoard,
} from "../../../Services/API/ApiBoard/apiBoard";
import { apiAssignFile, apiDeleteFile, apiUploadMultiFile } from "../../../Services/API/ApiUpload/apiUpload";
import { deleteComment, postComment, updateComment } from "../../../Services/API/ApiComment";

const ListBoardContext = createContext();

export const useListBoardContext = () => {
  return useContext(ListBoardContext);
};

function ListBoardProvider({ children, boardId, idWorkSpace }) {
  const [nameTitle, setNameTitle] = useState("");
  const [isClosedNavBar, setIsCloseNavBar] = useState(false);
  const [isShowBoardCard, setIsShowBoardCard] = useState(false);
  const [isShowBoardEdit, setIsShowBoardEdit] = useState(false);
  const [isShowAddList, setIsShowAddList] = useState(false);
  const [activeMonitor, setActiveMonitor] = useState([]);
  const [dataCard, setDataCard] = useState();
  const [dataList, setDataList] = useState();
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeStar, setActiveStar] = useState(false);
  const [listCount, setListCount] = useState([]);
  const [dataBoard, setDataBoard] = useState([]);
  const [dataWorkspace, setDataWorkspace] = useState([]);
  const [membersBoard, setMembersBoard] = useState([]);
  const [membersInCard, setMembersInCard] = useState([]);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [uploadedFiles, setUploadedFiles] = useState([]); //file  upload len thang server
  const [postUploadedFiles, setPostUploadedFiles] = useState([]);
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [upFileComment, setUpFileComment] = useState([]);

  const navigate = useNavigate();

  const handleFileChange = async (event) => {
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
      setUploadedFiles((prev) => [...prev, ...uploadedFilesData]);

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
        setPostUploadedFiles((prev) => [...prev, ...response.data.files]);
        return response.data.files;
      } catch (error) {
        console.error("Failed to get uploaded files:", error);
      }
    },
    [setPostUploadedFiles],
  );

  const handleDeleteFile = async (fileId) => {
    try {
      await apiDeleteFile(dataCard.id, fileId);
      setDataCard((prev) => ({
        ...prev,
        files: prev.files.filter((file) => file.id !== fileId),
      }));
      setPostUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
      toast.success("File deleted successfully!");
    } catch (error) {
      console.error("Failed to delete file:", error);
      toast.error("Failed to delete file.");
    }
  };

  const handlePostComment = async () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const images = doc.querySelectorAll("img");
    const imageUrls = Array.from(images).map((img) => img.src);
    const params = {
      content: content,
      files: imageUrls,
      cardId: dataCard.id,
    };
    setLoading(true);
    const loadingToastId = toast.loading("Saving...");
    try {
      const response = await postComment(boardId, params);
      toast.dismiss(loadingToastId);
      toast.success("Create comment successfully!");

      // Cập nhật lại nội dung và các file sau khi bình luận thành công
      setContent("");
      setUpFileComment([]);
      const newComment = response.data;

      // Thêm bình luận mới vào danh sách bình luận
      setDataCard((prevDataCard) => ({
        ...prevDataCard,
        comments: [...prevDataCard.comments, newComment],
      }));
      // Cập nhật danh sách file đã tải lên từ comment
      setPostUploadedFiles((prev) => [...prev, ...newComment.files]);
    } catch (err) {
      toast.dismiss(loadingToastId);
      toast.error("Cannot create comment");
      console.error("Lỗi khi đăng comment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (cmdId) => {
    try {
      await deleteComment(boardId, cmdId);
      setDataCard((prevDataCard) => ({
        ...prevDataCard,
        comments: prevDataCard.comments.filter((comment) => comment.id !== cmdId),
      }));
      toast.success("Deleted comment successfully!");
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  // const handleUpdateComment = async (cmdId, content) => {
  //   try {
  //     const response = await updateComment(boardId, cmdId, {content});
  //     setDataCard((prevDataCard) => ({
  //       ...prevDataCard,
  //       comments: prevDataCard.comments.map((comment) => (comment.id === cmdId ? response.data : comment)),
  //     }));
  //     toast.success("Comment updated successfully!");
  //   } catch (err) {
  //     toast.error("Cannot update comment");
  //     console.error("Error updating comment:", err);
  //   }
  // };

  // const handleUpdateComment = async (cmdId, content) => {
  //   setLoading(true);
  //   try {
  //     // Tải lên ảnh mới nếu có
  //     const parser = new DOMParser();
  //     const doc = parser.parseFromString(content, "text/html");
  //     const images = doc.querySelectorAll("img");
  //     const imageUrls = Array.from(images).map((img) => img.src);
  
  //     // Nếu có ảnh mới, tải lên và lấy URL
  //     if (imageUrls.length > 0) {
  //       const formData = new FormData();
  //       for (const url of imageUrls) {
  //         const response = await fetch(url);
  //         const blob = await response.blob();
  //         formData.append("files", blob, "image.jpg");
  //       }
  //       const uploadResponse = await apiUploadMultiFile(formData);
  //       const uploadedImageUrls = uploadResponse.data.map((file) => file.url);
  
  //       // Cập nhật nội dung với các URL ảnh đã tải lên
  //       uploadedImageUrls.forEach((url, index) => {
  //         content = content.replace(imageUrls[index], url);
  //       });
  //     }
  
  //     // Cập nhật comment với nội dung mới và danh sách ảnh mới
  //     const response = await updateComment(boardId, cmdId, { content });
  //     setDataCard((prevDataCard) => ({
  //       ...prevDataCard,
  //       comments: prevDataCard.comments.map((comment) => (comment.id === cmdId ? response.data : comment)),
  //     }));
  //     // toast.success("Comment updated successfully!");
  //     return response;
  //   } catch (err) {
  //     toast.error("Cannot update comment");
  //     console.error("Error updating comment:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleUpdateComment = async (cmdId, content) => {
  //   const parser = new DOMParser();
  //   const doc = parser.parseFromString(content, "text/html");
  //   const images = doc.querySelectorAll("img");
  //   const imageUrls = Array.from(images).map((img) => img.src);
  //   const params = {
  //     content: content,
  //     files: imageUrls,
  //     cardId: dataCard.id,
  //   };
  //   setLoading(true);
  //   const loadingToastId = toast.loading("Saving...");
  //   try {
  //     const response = await updateComment(cmdId, params);
  //     toast.dismiss(loadingToastId);
  //     toast.success("Create comment successfully!");

  //     // Cập nhật lại nội dung và các file sau khi bình luận thành công
  //     setContent("");
  //     setUpFileComment([]);
  //     const newComment = response.data;

  //     // Thêm bình luận mới vào danh sách bình luận
  //     setDataCard((prevDataCard) => ({
  //       ...prevDataCard,
  //       comments: [...prevDataCard.comments, newComment],
  //       files: [...prevDataCard.files, ...newComment.files],
  //     }));
  //     // Cập nhật danh sách file đã tải lên từ comment
  //     setPostUploadedFiles((prev) => [...prev, ...newComment.files]);
  //   } catch (err) {
  //     toast.dismiss(loadingToastId);
  //     toast.error("Cannot create comment");
  //     console.error("Lỗi khi đăng comment:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  let prevListCountRef = useRef();
  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const resWorkspace = await getWorkspaceById(idWorkSpace);
        if (!resWorkspace || resWorkspace.error) return navigate(`/workspace/${idWorkSpace}/home`);
        setDataWorkspace(resWorkspace?.data);

        const resBoard = await getBoardId(boardId);
        if (!resBoard || resBoard.error) return navigate(`/workspace/${idWorkSpace}/home`);
        setDataBoard(resBoard);
        const lists = resBoard.lists;
        const listWithCardsPromises = lists.map(async (list) => {
          let cards = await getAllCardByIdList(list.id, boardId);
          cards = cards.data[0].cards;
          return { ...list, cards };
        });
        const updatedLists = await Promise.all(listWithCardsPromises);
        if (JSON.stringify(updatedLists) !== JSON.stringify(prevListCountRef.current)) {
          setListCount(updatedLists);
        }
        prevListCountRef.current = updatedLists;
      } catch (err) {
        console.error("Error fetching board data: ", err);
        navigate(`/workspace/${idWorkSpace}/home`);
      }
    };

    fetchBoardData();
  }, [boardId, idWorkSpace, navigate, dataCard]);

  useEffect(() => {
    const getAllUserInBoard = async () => {
      try {
        const res = await getAllMembersByIdBoard(boardId);
        const dataUser = res.data;
        setMembersBoard(dataUser);
      } catch (err) {
        console.error("Error get all user data in board: ", err);
      }
    };

    getAllUserInBoard();
  }, [boardId]);

  const handleShowBoardCard = useCallback(
    async (data, dataCard) => {
      setIsShowBoardCard(!isShowBoardCard);
      if (isShowBoardEdit) {
        setIsShowBoardEdit(!isShowBoardEdit);
      }
      setDataList(data);
      setDataCard(dataCard);
      setPostUploadedFiles([...dataCard?.files]);
      setMembersInCard(dataCard?.members);
    },
    [isShowBoardCard, isShowBoardEdit],
  );

  const handleShowBoardEdit = useCallback(
    async (e, dataList, dataCard) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setPosition({ top: rect.bottom + 8, left: rect.left });
      setDataList(dataList);
      setDataCard(dataCard);
      setPostUploadedFiles([...dataCard?.files]);
    },
    //eslint-disable-next-line
    [isShowBoardEdit],
  );

  const handleShowAddCard = (idList) => {
    setActiveIndex(idList);
    const newList = listCount.map((list) => ({
      ...list,
      isShowAddCard: list.id === idList ? !list.isShowAddCard : false,
    }));
    setListCount(newList);
  };

  const handleShowAddList = useCallback(() => {
    setIsShowAddList(!isShowAddList);
  }, [isShowAddList]);

  const handleChange = async (e, idList) => {
    const newList = [...listCount];
    const index = newList.findIndex((list) => list.id === idList);
    if (index !== -1) {
      newList[index].title = e.target.value;
      setListCount(newList);
    }
  };

  const handleChangeTitleCard = (e) => {
    setNameTitle(e.target.value);
  };

  const handleClosedNavBar = () => {
    setIsCloseNavBar(!isClosedNavBar);
  };

  const handleAddCard = useCallback(
    async (newData, idList) => {
      const newList = [...listCount];
      const index = newList.findIndex((list) => list.id === idList);
      if (!Array.isArray(newList[index].cards)) {
        newList[index].cards = [];
      }
      if (newData.title) {
        newList[index].cards = [...newList[index].cards, newData];
      }
      newList[index].isShowAddCard = !newList[index].isShowAddCard;
      setListCount(newList);
      setNameTitle("");

      const dataSend = {
        ...newData,
        description: "",
        coverUrl: "",
        priority: "medium",
        tagId: "",
        listId: idList,
      };
      try {
        const res = await createCardByIdList(dataSend);
        setDataCard(res);
      } catch (error) {
        console.error("Failed to create card by id list:", error);
      }
    },
    [listCount],
  );

  const handleAddList = async (newData) => {
    if (newData.title) {
      const newListItem = {
        title: newData.title.trim(),
        description: "",
        boardId: dataBoard.id,
      };

      try {
        await CreateList(dataBoard?.id, newListItem);
        setIsShowAddList(!isShowAddList);
        setNameTitle("");
        setListCount((prev) => [...prev, newListItem]);
      } catch (error) {
        console.error("Failed to create list:", error);
      }
    }
  };

  const handleCopyList = (dataList) => {
    setListCount([...listCount, dataList]);
  };

  const handleActiveMonitor = (idList) => {
    if (activeMonitor.includes(idList)) {
      setActiveMonitor(activeMonitor.filter((i) => i !== idList));
    } else {
      setActiveMonitor([...activeMonitor, idList]);
    }
  };

  // ============handle get Active star==============
  useEffect(() => {
    if (dataBoard && dataBoard.id) setActiveStar(dataBoard.isFavorite);
  }, [dataBoard]);
  const handleActiveStar = useCallback(() => {
    setActiveStar(!activeStar);
    updateBoard(boardId, { ...dataBoard, isFavorite: !activeStar });
  }, [activeStar, boardId, dataBoard]);

  const handleChangeSidebar = useCallback((isClose) => {
    return setIsCloseNavBar(!isClose);
  }, []);

  return (
    <ListBoardContext.Provider
      value={{
        nameTitle,
        setNameTitle,
        isClosedNavBar,
        handleClosedNavBar,
        isShowBoardCard,
        handleShowBoardCard,
        isShowBoardEdit,
        handleShowBoardEdit,
        isShowAddList,
        handleShowAddList,
        activeMonitor,
        handleActiveMonitor,
        dataCard,
        setDataCard,
        dataList,
        setDataList,
        listCount,
        setListCount,
        handleAddCard,
        handleAddList,
        position,
        setPosition,
        activeIndex,
        activeStar,
        handleActiveStar,
        dataBoard,
        dataWorkspace,
        membersBoard,
        membersInCard,
        setMembersInCard,
        setMembersBoard,
        handleChangeSidebar,
        handleChange,
        handleChangeTitleCard,
        handleCopyList,
        handleShowAddCard,
        uploadedFiles,
        setUploadedFiles,
        handleFileChange,
        postUploadedFiles: postUploadedFiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        setPostUploadedFiles,
        handlePostFiles,
        loading,
        content,
        setContent,
        isSaving,
        setIsSaving,
        handlePostComment,
        handleDeleteComment,
        handleDeleteFile,
        boardId,
        idWorkSpace,
        upFileComment,
        setUpFileComment,
        setIsShowBoardEdit,
        // handleUpdateComment,
        setLoading,
      }}
    >
      {children}
    </ListBoardContext.Provider>
  );
}

export default ListBoardProvider;
