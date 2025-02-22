"use client";
import { useEffect, useState } from "react";
import {getMessaging, getToken} from 'firebase/messaging';
import app from "@/utils/firebase/firebaseConfig";

const useFcmToken = () => {
  const [token, setToken] = useState("");
  const [notificationPermissionStatus, setPermissionNotificationStatus] =
    useState("");

  useEffect(() => {
    const getFcmToken = async () => {
      try {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {

            const messaging = getMessaging(app)

          // Retrieve the notification permission status
          const permission = await Notification.requestPermission();
          setPermissionNotificationStatus(permission);

          // check if the permission is grandted before  retreiving the token
          if (permission === "granted") {
            const currentToken = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            });
            if (currentToken) {
              setToken(currentToken);
            } else {
              console.log(
                "No registration token available. Request permission to generate one."
              );
            }
          }
        }
      } catch (error) {
        console.log("An error occurred while retrieving token:", error);
      }
    };
    getFcmToken();
  }, []);

  return { fcmToken: token, notificationPermissionStatus };
};

export default useFcmToken;
