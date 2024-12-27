import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import {
    getAuth
} from "firebase/auth";
// const firebaseConfigDb = {
//   apiKey: "AIzaSyBHNcwFWQ8xfOxitQgCnp-Hdgd98bADY_Y",
//   authDomain: "codeeditor-5e6a3.firebaseapp.com",
//   projectId: "codeeditor-5e6a3",
//   storageBucket: "codeeditor-5e6a3.firebasestorage.app",
//   messagingSenderId: "436317022784",
//   appId: "1:436317022784:web:ccd9b20bbfb30a35854da5",
//   measurementId: "G-Y56VB5ZRPR"
// };
const firebaseConfig = {
    apiKey: "AIzaSyDYWLbR1Ud0qwj-6F06rDosta5x_TewD4A",
    authDomain: "boardcode-b36dd.firebaseapp.com",
    projectId: "boardcode-b36dd",
    storageBucket: "boardcode-b36dd.firebasestorage.app",
    messagingSenderId: "975798164904",
    appId: "1:975798164904:web:30690a94c69984ece3d19d",
    measurementId: "G-QLZ1NVXFGH",
};

// const dbapp = initializeApp(firebaseConfigDb);
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export const auth = getAuth(app);

export const createUserWithDefaultTab = async (email) => {
  const userRef = doc(db, "users", email);
  await setDoc(userRef, {
    email,
    tabs: [{
      id: uuidv4(),
      name: "default",
      language: "javascript",
      code: "console.log('Hello World');"
    }]
  });
};

export const checkUserInDB = async (email) => {
  try {
    const userRef = doc(db, "users", email);
    const userDoc = await getDoc(userRef);
    return userDoc.exists();
  } catch (error) {
    console.error("Error checking user in database:", error);
    throw error;
  }
};

export const addNewTab = async (email, tabName, language) => {
    try {
      if (!tabName || tabName.trim() === '') {
        throw new Error('File name cannot be empty');
      }
  
      const userRef = doc(db, "users", email);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
  
      // Check for duplicate names
      const existingTab = userData.tabs.find(tab => tab.name === tabName);
      if (existingTab) {
        throw new Error('A file with this name already exists');
      }
  
      const newTab = {
        id: uuidv4(),
        name: tabName,
        language,
        code: ""
      };
  
      await updateDoc(userRef, {
        tabs: [...userData.tabs, newTab]
      });
  
      return {
        success: true,
        tab: newTab,
        message: 'Tab created successfully'
      };
    } catch (error) {
      console.error("Error adding new tab:", error);
      return {
        success: false,
        message: error.message
      };
    }
  };

export const getUserTabs = async (email) => {
  const userRef = doc(db, "users", email);
  const userDoc = await getDoc(userRef);
  return userDoc.data()?.tabs || [];
};

export const getTabNames = async (email) => {
  const tabs = await getUserTabs(email);
  return tabs.map(tab => tab.name);
};

export const updateTabCode = async (email, tabId, newCode) => {
  const userRef = doc(db, "users", email);
  const userDoc = await getDoc(userRef);
  const userData = userDoc.data();
  
  const updatedTabs = userData.tabs.map(tab => 
    tab.id === tabId ? {...tab, code: newCode} : tab
  );
  
  await updateDoc(userRef, { tabs: updatedTabs });
};

export const deleteTab = async (email, tabId) => {
    try {
      const userRef = doc(db, "users", email);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
  
      // Don't delete if it's the last tab
      if (userData.tabs.length <= 1) {
        throw new Error("Cannot delete the last tab");
      }
  
      const updatedTabs = userData.tabs.filter(tab => tab.id !== tabId);
      await updateDoc(userRef, { tabs: updatedTabs });
      return true;
    } catch (error) {
      console.error("Error deleting tab:", error);
      return false;
    }
  };
  
  export const getTabCode = async (email, tabId) => {
    try {
      const userRef = doc(db, "users", email);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      
      const tab = userData.tabs.find(tab => tab.id === tabId);
      return tab ? tab.code : null;
    } catch (error) {
      console.error("Error fetching tab code:", error);
      return null;
    }
  };
 
  export const renameTab = async (email, tabId, newFileName) => {
    try {
      // Input validation
      if (!newFileName || newFileName.trim() === '') {
        throw new Error('File name cannot be empty');
      }
  
      const userRef = doc(db, "users", email);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
  
      // Check for duplicate names
      const existingTab = userData.tabs.find(
        tab => tab.name === newFileName && tab.id !== tabId
      );
      
      if (existingTab) {
        throw new Error('A file with this name already exists');
      }
  
      // Update tab name while preserving other properties
      const updatedTabs = userData.tabs.map(tab => 
        tab.id === tabId ? { ...tab, name: newFileName } : tab
      );
  
      await updateDoc(userRef, { tabs: updatedTabs });
      return {
        success: true,
        message: 'File renamed successfully'
      };
    } catch (error) {
      console.error("Error renaming tab:", error);
      return {
        success: false,
        message: error.message
      };
    }
  };