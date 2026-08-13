import React, { useRef, useEffect } from 'react';
import { Bell, Check, Trash2, X, AlertTriangle, CheckCircle2, Calendar, Target } from 'lucide-react';
import PropTypes from 'prop-types';
import { useVault } from '../context/VaultContext';

export const NotificationCenter = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, clearNotifications } = useVault();
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-vault-emerald shrink-0" />;
      case 'recurring':
        return <Calendar className="w-4 h-4 text-vault-reserveBlue shrink-0" />;
      case 'goal':
        return <Target className="w-4 h-4 text-vault-reserveBlue shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-vault-reserveBlue shrink-0" />;
    }
  };

  return (
    <div className="absolute right-6 top-14 z-50 w-80 sm:w-96 bg-vault-surface border border-vault-rule rounded-2xl shadow-xl p-4 text-vault-ink dark:text-vault-text font-sans select-none animate-in fade-in zoom-in-95 duration-150">
      <div ref={modalRef} className="space-y-3">
        {/* Header */}
        <div className="flex justify-between items-center pb-2.5 border-b border-vault-rule">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-vault-reserveBlue" />
            <h3 className="text-xs font-bold font-sans">Notifications</h3>
            <span className="text-[10px] font-mono bg-vault-reserveBlue text-white px-1.5 py-0.2 rounded font-bold">
              {notifications.filter(n => !n.read).length} Unread
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={clearNotifications}
              title="Clear all notifications"
              className="p-1 text-vault-muted hover:text-vault-rose rounded hover:bg-vault-surfaceHighlight transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-vault-muted hover:text-vault-ink rounded hover:bg-vault-surfaceHighlight transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-72 overflow-y-auto space-y-2 font-mono text-xs">
          {notifications.length > 0 ? (
            notifications.map(n => (
              <div 
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-colors ${
                  n.read 
                    ? 'bg-vault-paper/60 border-vault-rule opacity-75' 
                    : 'bg-vault-paper border-vault-reserveBlue/40 font-bold'
                }`}
              >
                {getIcon(n.type)}
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-xs leading-snug">{n.title}</p>
                  <p className="text-[10px] text-vault-muted dark:text-vault-mutedDark mt-0.5 leading-normal">{n.message}</p>
                  <span className="text-[9px] text-vault-subtle block mt-1">{n.time}</span>
                </div>
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-vault-reserveBlue shrink-0 mt-1" />
                )}
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-vault-muted font-mono text-xs">
              No new notifications
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

NotificationCenter.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};
