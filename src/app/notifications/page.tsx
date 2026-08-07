"use client";

import { useState } from "react";

type NotificationItem = {
  id: number;
  title: string;
  text: string;
  unread: boolean;
};

const startingNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "Meal reminder",
    text: "Ready to log your next meal?",
    unread: true,
  },
  {
    id: 2,
    title: "Nutrition progress",
    text: "Your meal history is helping Bite Wise build a clearer nutrition picture.",
    unread: true,
  },
  {
    id: 3,
    title: "Recommendation ready",
    text: "New meal ideas are available for you to explore.",
    unread: false,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState(startingNotifications);

  const unreadCount = notifications.filter(
    (item) => item.unread
  ).length;

  const markRead = (id: number) => {
    setNotifications((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, unread: false }
          : item
      )
    );
  };

  const markAllRead = () => {
    setNotifications((items) =>
      items.map((item) => ({
        ...item,
        unread: false,
      }))
    );
  };

  return (
    <div className="dashboard-content notifications-page">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">
            Notifications
          </span>

          <h1>Your updates</h1>

          <p>
            Meal reminders, nutrition updates and Bite Wise recommendations.
          </p>
        </div>
      </div>

      <div className="notification-toolbar">
        <div>
          <strong>
            Recent notifications
          </strong>{" "}

          <span className="notification-count">
            {unreadCount}
          </span>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            className="mark-all-read"
            onClick={markAllRead}
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="notification-list">
        {notifications.map((item) => (
          <button
            type="button"
            key={item.id}
            className={
              item.unread ? "unread" : ""
            }
            onClick={() => markRead(item.id)}
          >
            <span className="notification-dot" />

            <span>
              <strong>{item.title}</strong>
              <small>{item.text}</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}