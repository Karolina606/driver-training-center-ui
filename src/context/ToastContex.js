import { createContext } from "react";

const ToastContext = createContext({
  toastState: {'isOpen': false, 'type':'success', 'message': 'success'},
  setToastState: () => {}
});

export default ToastContext;