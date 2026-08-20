import { App } from "antd";
import { useEffect } from "react";
import { staticFn } from "./staticFn";

/**
 * Captures the theme-aware modal/message/notification instances from antd's
 * <App> context into the shared `staticFn` holder. Mount once, inside <App>,
 * so static call sites (staticModal.confirm, ...) respect dark/light mode.
 */
export function StaticFnHolder() {
  const { modal, message, notification } = App.useApp();

  useEffect(() => {
    staticFn.modal = modal;
    staticFn.message = message;
    staticFn.notification = notification;
  }, [modal, message, notification]);

  return null;
}
