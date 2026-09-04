
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/admin/Sidebar";
import TopBar from "../../components/admin/TopBar";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);


  // FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await api.get("/notifications");

      console.log("Admin Notifications:", response.data);

      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Error fetching Admin notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // unread count
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;


  // MARK ONE AS READ
  const markAsRead = async (notificationId) => {
    try {
      await api.patch(
        `/notifications/${notificationId}/read`
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Error marking notification as read:",
        error
      );
    }
  };


  // MARK ALL AS READ
  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(
        "Error marking all notifications as read:",
        error
      );
    }
  };

  // GET NOTIFICATION ICON
  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "assigned":
        return "📋";

      case "in-progress":
        return "🔧";

      case "resolved":
        return "✓";

      default:
        return "🔔";
    }
  };


  // GET NOTIFICATION STYLE
  const getNotificationStyle = (type) => {
    switch (type?.toLowerCase()) {
      case "assigned":
        return "bg-purple-100 text-purple-700";

      case "in-progress":
        return "bg-blue-100 text-blue-700";

      case "resolved":
        return "bg-green-100 text-green-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // UNREAD COUNT
  const clearNotification = async (id) => {
  try {
    await api.delete(`/notifications/${id}`);

    setNotifications((prev) =>
      prev.filter(
        (notification) => notification._id !== id
      )
    );
  } catch (error) {
    console.error(
      "Error clearing notification:",
      error
    );
  }
};

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ================= SIDEBAR ================= */}
      <Sidebar />

      {/* ================= MAIN AREA ================= */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* ================= TOPBAR ================= */}
        <TopBar />

        {/* ================= CONTENT ================= */}
        <main className="flex-1 p-6">

          <div className="mx-auto max-w-5xl">

            {/* ================= HEADER ================= */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Notifications
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Stay updated about your complaints
                </p>
              </div>

              {/* MARK ALL READ */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="w-fit rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Mark all as read
                </button>
              )}

            </div>

            {/* ================= UNREAD COUNT ================= */}
            {!loading && unreadCount > 0 && (
              <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">

                <p className="text-sm font-medium text-blue-700">
                  You have {unreadCount} unread notification
                  {unreadCount !== 1 ? "s" : ""}.
                </p>

              </div>
            )}

            {/* ================= LOADING ================= */}
            {loading && (
              <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

                <p className="text-sm text-slate-500">
                  Loading notifications...
                </p>

              </div>
            )}

            {/* ================= EMPTY ================= */}
            {!loading && notifications.length === 0 && (
              <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <span className="text-2xl">
                    🔔
                  </span>
                </div>

                <h2 className="text-lg font-semibold text-slate-700">
                  No Notifications
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  You don't have any notifications yet.
                </p>

              </div>
            )}

            {/* ================= NOTIFICATION LIST ================= */}
            {!loading && notifications.length > 0 && (
              <div className="space-y-4">

                {notifications.map((notification) => (

                  <div
                    key={notification._id}
                    onClick={() =>
                      !notification.isRead &&
                      markAsRead(notification._id)
                    }
                    className={`relative rounded-2xl border p-5 shadow-sm transition ${
                      notification.isRead
                        ? "border-slate-100 bg-white"
                        : "border-blue-100 bg-blue-50/40"
                    } ${
                      !notification.isRead
                        ? "cursor-pointer hover:shadow-md"
                        : ""
                    }`}
                  >

                    {/* UNREAD DOT */}
                    {!notification.isRead && (
                      <span className="absolute right-5 top-5 h-2.5 w-2.5 rounded-full bg-blue-600" />
                    )}

                    <div className="flex gap-4">

                      {/* ICON */}
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${getNotificationStyle(
                          notification.type
                        )}`}
                      >
                        {getNotificationIcon(
                          notification.type
                        )}
                      </div>

                      {/* CONTENT */}
                      <div className="min-w-0 flex-1 pr-5">

                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                          <h3
                            className={`text-sm font-semibold ${
                              notification.isRead
                                ? "text-slate-700"
                                : "text-slate-900"
                            }`}
                          >
                            {notification.title}
                          </h3>

                          <span className="text-xs text-slate-400">
                            {notification.createdAt
                              ? new Date(
                                  notification.createdAt
                                ).toLocaleString()
                              : ""}
                          </span>

                        </div>

                        {/* MESSAGE */}
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {notification.message}
                        </p>

                        {/* COMPLAINT */}
                        {notification.complaint && (
                          <div className="mt-3 inline-flex rounded-lg bg-slate-100 px-3 py-1.5">

                            <span className="text-xs font-medium text-slate-600">
                              Complaint:{" "}
                              {notification.complaint.title}
                            </span>

                          </div>
                        )}

                        {/* STATUS */}
                        {notification.complaint?.status && (
                          <div className="mt-2">

                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getNotificationStyle(
                                notification.complaint.status
                              )}`}
                            >
                              {notification.complaint.status}
                            </span>

                          </div>
                        )}

                        {/** clear button  */}
                        {notification.isRead && (
                          <button
                          onClick={(e)=>{
                            e.stopPropagation();
                            clearNotification(
                              notification._id
                            );
                          }}
                          className="mt-4 rounded-lg border border-red-200 bg-red-500 px-4 py-1.5 text-red-100 transition hover:bg-red-300 translate-x-190">Clear</button>
                        )}

                      </div>

                    </div>

                  </div>

                ))}

              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminNotifications;
