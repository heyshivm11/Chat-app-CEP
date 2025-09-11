// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  projectId: 'studio-8452254852-d6924',
  appId: '1:1069566010714:web:2cffd79222b5c10d1aff63',
  storageBucket: 'studio-8452254852-d6924.firebasestorage.app',
  apiKey: 'AIzaSyAn72li2y4raSkMfkEUGO9vPE1NQjIaNjA',
  authDomain: 'studio-8452254852-d6924.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '1069566010714',
};

// Initialize Firebase
const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export { firebaseApp };
