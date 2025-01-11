import admin from "firebase-admin";
import serviceAccount from "./config/burgershop-2975b-firebase-adminsdk-myiuo-b24382f144.json" assert { type: "json" };

// Initialize Firebase admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "burgershop-2975b.appspot.com", // Directly use the bucket name
});

const bucket = admin.storage().bucket(); // This gives you the storage bucket
const verifyToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export { verifyToken };
export default bucket;
