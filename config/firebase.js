import {getApp,getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBnNeI5Ot4EbY47O-yNEMsHoMfHCNs1wHc",
  authDomain: "alphachat-85d29.firebaseapp.com",
  projectId: "alphachat-85d29",
  storageBucket: "alphachat-85d29.appspot.com",
  messagingSenderId: "750601341638",
  appId: "1:750601341638:web:e0ac6ee6001a6d282225c7",
  measurementId: "G-NXZ58SWX8V"
};

// Initialize Firebase
const app=getApps.length > 0 ? getApp() : initializeApp(firebaseConfig)
const firebaseAuth=getAuth(app)
const firestoreDB=getFirestore(app)


export {app,firebaseAuth,firestoreDB};