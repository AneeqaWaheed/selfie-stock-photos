import admin from "firebase-admin";
import serviceAccount from "./config/selfi-stock-firebase-adminsdk.json" assert { type: "json" };

// Initialize Firebase admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "selfi-stock.appspot.com", // Directly use the bucket name
});

const bucket = admin.storage().bucket(); // This gives you the storage bucket
export default bucket;
