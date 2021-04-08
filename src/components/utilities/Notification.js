import { toast } from "react-toastify";
const DURATION = 4000;
const POSITION = "top-center";

// success notification
export const notifySuccess = (msg) =>
  toast.success(msg, {
    position: POSITION,
    autoClose: DURATION,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

// error notification
export const notifyError = (msg) =>
  toast.error(msg, {
    position: POSITION,
    autoClose: DURATION,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

// warning notification
export const notifyWarning = (msg) =>
  toast.warning(msg, {
    position: POSITION,
    autoClose: DURATION,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
