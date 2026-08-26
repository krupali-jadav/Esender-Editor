export const staticFn = {
  modal: null,
  message: null,
  notification: null,
};

// Convenience proxies so call sites can use `staticModal.confirm(...)` directly.
export const staticModal = {
  confirm: (...args) => staticFn.modal?.confirm(...args),
  info: (...args) => staticFn.modal?.info(...args),
  success: (...args) => staticFn.modal?.success(...args),
  error: (...args) => staticFn.modal?.error(...args),
  warning: (...args) => staticFn.modal?.warning(...args),
};
