// import { initializeApp } from "firebase/app";
import { createUserWithDefaultTab } from './database.service';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    inMemoryPersistence
} from "firebase/auth";
import { updateProfile } from "firebase/auth";
import {auth} from './database.service';
class AuthService {
    constructor() {
        // const firebaseConfig = {
        //     apiKey: "AIzaSyDYWLbR1Ud0qwj-6F06rDosta5x_TewD4A",
        //     authDomain: "boardcode-b36dd.firebaseapp.com",
        //     projectId: "boardcode-b36dd",
        //     storageBucket: "boardcode-b36dd.firebasestorage.app",
        //     messagingSenderId: "975798164904",
        //     appId: "1:975798164904:web:30690a94c69984ece3d19d",
        //     measurementId: "G-QLZ1NVXFGH",
        // };

        // Initialize Firebase
        // this.app = initializeApp(firebaseConfig, "boardcode-b36dd");
        this.auth = auth;

        // Set default session persistence to 'local'
        this.setPersistence("local");
    }

    /**
     * Store session data using Firebase token
     */
    async storeSession(user) {
        if (user) {
            const token = await user.getIdToken();
            localStorage.setItem("auth_user", JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                token,
            }));
        } else {
            localStorage.removeItem("auth_user");
        }
    }

    /**
     * Get the current user session from localStorage
     */
    getStoredSession() {
        const user = localStorage.getItem("auth_user");
        return user ? JSON.parse(user) : null;
    }

    /**
     * Create a new account
     */


async createAccount({ email, password, name, rememberMe=false }) {
    try {
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        const user = userCredential.user;

        // Update user profile with display name
        if (name) {
            await updateProfile(user, { displayName: name });
        }

        // Create user with default tab in database
        await createUserWithDefaultTab(email);

        await this.storeSession(user);
        await this.handleUserLogin(email , password,rememberMe)
        window.location.href = "/ide";
        return { user };
    } catch (error) {
        console.log("AuthService :: createAccount :: error", error);
        return { error };
    }
}


    /**
     * Login with email and password
     */
    async login({ email, password, persistence = "local" }) {
        try {
            await this.setPersistence(persistence); // Set persistence before login
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;

            await this.storeSession(user);
            return { user };
        } catch (error) {
            console.log("AuthService :: login :: error", error);
            return { error };
        }
    }

    /**
     * Login with Google OAuth
     */
    async createAccountWithGoogle(persistence = "local") {
        try {
            await this.setPersistence(persistence); // Set persistence before Google login
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(this.auth, provider);
            const user = result.user;
            // console.log(user);
            await this.storeSession(user);
            
            await createUserWithDefaultTab(user.email);
            // Redirect to /ide after successful login
            window.location.href = "/ide";

            return { user };
        } catch (error) {
            console.log("AuthService :: createAccountWithGoogle :: error", error);
            return { error };
        }
    }

    /**
     * Logout from all sessions
     */
    async logout() {
        try {
            await signOut(this.auth);
            this.storeSession(null); // Clear session from localStorage
            window.location.href = "/"; // Redirect to root after logout
        } catch (error) {
            console.log("AuthService :: logout :: error", error);
        }
    }

    /**
     * Get the current user from Firebase or localStorage
     */
    async getCurrentUser() {
        return new Promise((resolve) => {
            const storedUser = this.getStoredSession();
            if (storedUser) return resolve(storedUser);

            onAuthStateChanged(this.auth, async (user) => {
                if (user) {
                    await this.storeSession(user); // Cache user in localStorage
                    resolve(user);
                } else {
                    resolve(null);
                }
            });
        });
    }

    /**
     * Set session persistence
     */
    async setPersistence(type = "local") {
        try {
            const persistenceMap = {
                local: browserLocalPersistence,
                session: browserSessionPersistence,
                none: inMemoryPersistence,
            };

            await setPersistence(this.auth, persistenceMap[type]);
            console.log(`Persistence set to ${type}`);
        } catch (error) {
            console.error("AuthService :: setPersistence :: error", error);
            return { error };
        }
    }

    /**
     * Handle user login with persistence preference
     */
    async handleUserLogin({ email, password, rememberMe }) {
        const persistenceType = rememberMe ? "local" : "session";
        return this.login({ email, password, persistence: persistenceType });
    }
}

const authService = new AuthService();

export default authService;

// Import the Firebase library

// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore"; // For Firestore database

// // Your Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBHNcwFWQ8xfOxitQgCnp-Hdgd98bADY_Y",
//   authDomain: "codeeditor-5e6a3.firebaseapp.com",
//   projectId: "codeeditor-5e6a3",
//   storageBucket: "codeeditor-5e6a3.firebasestorage.app",
//   messagingSenderId: "436317022784",
//   appId: "1:436317022784:web:ccd9b20bbfb30a35854da5",
//   measurementId: "G-Y56VB5ZRPR"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firestore
// const db = getFirestore(app);

// // export default db;

// import { doc, updateDoc, arrayUnion } from "firebase/firestore";
// import { v4 as uuidv4 } from 'uuid';  // Import uuid for generating unique IDs

// // Function to create a new tab in Firestore
// async function createTab(userId, newTab) {
//     const userRef = doc(db, "users", userId);
//     await updateDoc(userRef, {
//         tabs: arrayUnion(newTab)
//     });
// }

// // Function to handle new editor creation
// export function onCreateEditor({ fileName, language, code, user }) {
//     const userId = "aayush";  // Assuming `user` holds the user ID (you can modify it based on your app's authentication method)
    
//     const newTab = {
//         id: uuidv4(),  // Generate a unique ID for the new tab
//         filename: fileName,
//         language,
//         code,
//     };
    
//     // Call createTab to update the user's tabs in Firestore
//     createTab(userId, newTab)
//         .then(() => {
//             console.log("New tab created successfully!");
//         })
//         .catch((error) => {
//             console.error("Error creating new tab:", error);
//         });
// }

