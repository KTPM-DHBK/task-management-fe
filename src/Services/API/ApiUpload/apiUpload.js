import request from "../request"

// upload 1 file
export function apiUploadFile(formData) {
  return request.post('upload/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

//upload multi file
export function apiUploadMultiFile(formData) {
  return request.post('upload/multiple-files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// api assign file, get file
export function apiAssignFile(id, urls) {
  return request.post(`card/${id}/attach-file`, {
    urls: urls
  });
}

//delete file id
export function apiDeleteFile(id, filedId) {
  return request.delete(`card/${id}/delete-file/${filedId}`);
}