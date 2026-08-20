/**
 * antd's static `Modal.confirm` / `message.*` / `notification.*` render outside
 * the React tree, so they can't read the theme from <ConfigProvider> and always
 * fall back to the light theme. antd's <App> component exposes theme-aware
 * instances via App.useApp(); <StaticFnHolder> captures them here so any call
 * site can use a themed modal/message/notification that respects dark mode.
 *
 * Usage:
 *   import { staticModal } from "../../util/staticFn";
 *   staticModal.confirm({ ... });
 */
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
