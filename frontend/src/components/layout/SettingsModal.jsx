import React from "react";
import SettingsModal from "../modals/SettingsModal";

export default function LayoutSettingsModal({ open, onOpenChange, onClose }) {
  if (!open && onClose === undefined) return null;
  return <SettingsModal onClose={onClose || (() => onOpenChange && onOpenChange(false))} />;
}
