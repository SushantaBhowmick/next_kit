import admin, { ServiceAccount } from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_ADMIN_TYPE,
      project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
      private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
      auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
      token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
      auth_provider_x509_cert_url:
      process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X_CERT_URL,
      universe_domain: process.env.FIREBASE_ADMIN_UNIVERSE_DOMAIN,
    }as ServiceAccount),
  });
}

export const sendNotification = async (
  token: string,
  title: string,
  body: string
) => {
  const message = {
    token,
    notification: {
      title,
      body,
    },
  };

  try {
    const response = await admin.messaging().send(message);
    return response;
  } catch (error) {
    console.log("Error sending message:", error);
    return error;
  }
};
