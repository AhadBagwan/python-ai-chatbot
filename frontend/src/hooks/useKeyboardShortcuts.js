import { useEffect, useCallback } from 'react';
import useSettingsStore from '../stores/settingsStore';
import useChatStore from '../stores/chatStore';

export function useKeyboardShortcuts() {
  const { toggleSidebar, toggleTheme, setSettingsOpen } = useSettingsStore();
  const { createChat } = useChatStore();

  const handleKeyDown = useCallback((e) => {
    // Ignore if typing in input/textarea
    if (
      e.target.tagName === 'INPUT' ||
      e.target.tagName === 'TEXTAREA' ||
      e.target.isContentEditable
    ) {
      // Allow Escape to work in inputs
      if (e.key !== 'Escape') return;
    }

    // Ctrl/Cmd + N: New Chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      createChat();
    }

    // Ctrl/Cmd + B: Toggle Sidebar
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      toggleSidebar();
    }

    // Ctrl/Cmd + ,: Open Settings
    if ((e.ctrlKey || e.metaKey) && e.key === ',') {
      e.preventDefault();
      setSettingsOpen(true);
    }

    // Ctrl/Cmd + Shift + T: Toggle Theme
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
      e.preventDefault();
      toggleTheme();
    }

    // Escape: Close modals
    if (e.key === 'Escape') {
      setSettingsOpen(false);
    }

    // /: Focus input (when not in input)
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const input = document.querySelector('textarea');
      if (input) input.focus();
    }
  }, [toggleSidebar, toggleTheme, setSettingsOpen, createChat]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export default useKeyboardShortcuts;
