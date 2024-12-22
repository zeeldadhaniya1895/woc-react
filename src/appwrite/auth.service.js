import { Client, Account, ID } from "appwrite";

class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(import.meta.env.VITE_AppWrite_URL)
            .setProject(import.meta.env.VITE_AppWrite_Project_ID);

        this.account = new Account(this.client);
    }

    /**
     * Store session data in localStorage
     */
    storeSession(user) {
        if (user) {
            localStorage.setItem("auth_user", JSON.stringify(user));
        } else {
            localStorage.removeItem("auth_user");
        }
    }

    /**
     * Get the current user from localStorage
     */
    getStoredSession() {
        const user = localStorage.getItem("auth_user");
        return user ? JSON.parse(user) : null;
    }

    /**
     * Create a new account
     */
    async createAccount({ email, password, name }) {
        try {
            const user = await this.account.create(ID.unique(), email, password, name);
            if (user) {
                const session = await this.account.createEmailPasswordSession(email, password);
                this.storeSession(user); // Store user in localStorage
                return { user, session };
            }
            return null;
        } catch (error) {
            console.log("AuthService :: createAccount :: error", error);
            return { error };
        }
    }

    /**
     * Login with email and password
     */
    async login({ email, password }) {
        try {
            const session = await this.account.createEmailPasswordSession(email, password);
            const user = await this.account.get();
            this.storeSession(user); // Store user in localStorage
            return { user, session };
        } catch (error) {
            console.log("AuthService :: login :: error", error);
            return { error };
        }
    }

    /**
     * Create a session using Google OAuth
     */
    async createAccountWithGoogle() {
        try {
            // Initiate OAuth2 session
            await this.account.createOAuth2Session(
                "google",
                `https://boardcode.netlify.app/ide`, // Success URL
                `https://boardcode.netlify.app/` // Failure URL
            );

            // After redirect, fetch and store the authenticated user
            const user = await this.account.get();
            this.storeSession(user); // Store user in localStorage
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
            await this.account.deleteSessions();
            this.storeSession(null); // Clear session from localStorage
            window.location.href = "/"; // Redirect to root after logout
        } catch (error) {
            console.log("AuthService :: logout :: error", error);
        }
    }

    /**
     * Get the current user from Appwrite or localStorage
     */
    async getCurrentUser() {
        try {
            const storedUser = this.getStoredSession();
            if (storedUser) return storedUser;

            const user = await this.account.get();
            this.storeSession(user); // Cache user in localStorage
            return user;
        } catch (error) {
            return null;
        }
    }
}

const authService = new AuthService();

export default authService;
