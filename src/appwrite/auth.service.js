import { initializeApp } from "firebase/app";
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
class AuthService {
    constructor() {
        const firebaseConfig = {
            apiKey: "AIzaSyDYWLbR1Ud0qwj-6F06rDosta5x_TewD4A",
            authDomain: "boardcode-b36dd.firebaseapp.com",
            projectId: "boardcode-b36dd",
            storageBucket: "boardcode-b36dd.firebasestorage.app",
            messagingSenderId: "975798164904",
            appId: "1:975798164904:web:30690a94c69984ece3d19d",
            measurementId: "G-QLZ1NVXFGH",
        };

        // Initialize Firebase
        this.app = initializeApp(firebaseConfig);
        this.auth = getAuth(this.app);

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

            await this.storeSession(user);

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
