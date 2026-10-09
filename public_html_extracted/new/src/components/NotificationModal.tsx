import React, { useState, useEffect } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, CheckCircle, XCircle, Sparkles, Check, Trash2, X } from 'lucide-react';
import { AppNotification, User } from '../types';
import { PlatformStore } from '../services/platformStore';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSelectTarget?: (targetId: string, type: 'film' | 'reel') => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectTarget
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (isOpen && currentUser) {
      const list = PlatformStore.getNotifications(currentUser.id);
      setNotifications(list);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    if (currentUser) {
      PlatformStore.markAllNotificationsAsRead(currentUser.id);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    PlatformStore.markNotificationAsRead(notif.id);
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    if (notif.targetId && notif.targetType && onSelectTarget) {
      onSelectTarget(notif.targetId, notif.targetType);
      onClose();
    }
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 fill-red-500 text-red-500" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 fill-amber-400 text-amber-400" />;
      case 'follow':
        return <UserPlus className="h-4 w-4 text-emerald-400" />;
      case 'approval':
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case 'rejection':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'welcome':
      default:
        return <Sparkles className="h-4 w-4 text-amber-400" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div 
      id="notifications-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-start justify-center sm:justify-end sm:pr-12 pt-16 bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        id="notifications-panel"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Notifications</h3>
              <p className="text-[11px] text-slate-400">
                {unreadCount > 0 ? `${unreadCount} new notifications` : 'All caught up'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                title="Mark all as read"
                className="rounded-lg px-2 py-1 text-[11px] font-medium text-amber-400 hover:bg-slate-800"
              >
                Mark read
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 no-scrollbar">
          {!currentUser ? (
            <div className="p-8 text-center space-y-2">
              <Bell className="h-8 w-8 text-slate-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-300">Sign in to view notifications</p>
              <p className="text-[11px] text-slate-500">Likes, comments, follows, and approvals will appear here.</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/80 mx-auto text-slate-400">
                <Bell className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold text-white">No notifications yet</p>
              <p className="text-[11px] text-slate-400">
                When viewers like, comment on, or save your short movies and reels, updates will appear in real time.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`flex items-start gap-3 p-3.5 transition-colors cursor-pointer hover:bg-slate-800/50 ${
                  !n.isRead ? 'bg-amber-500/5' : ''
                }`}
              >
                <div className="relative shrink-0 mt-0.5">
                  <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-700 bg-slate-800">
                    <img 
                      src={n.senderAvatar || '/harri-kumar.jpg'} 
                      alt={n.senderName} 
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-slate-900 p-0.5 border border-slate-700">
                    {getIcon(n.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-200 leading-snug">
                    <strong className="text-white font-semibold">{n.senderName}</strong>{' '}
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-500 mt-1 block">{n.createdAt}</span>
                </div>

                {!n.isRead && (
                  <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
