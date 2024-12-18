import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
        .setEndpoint(import.meta.env.VITE_AppWrite_URL)
        .setProject(import.meta.env.VITE_AppWrite_Project_ID);
        
        this.account = new Account(this.client);
    }
    async createAccount({ email, password, name }) {
        try {
            // Create the user
            const user = await this.account.create(ID.unique(), email, password, name);
    
            if (user) {
                // Create a session for the user
                const session = await this.account.createEmailPasswordSession(email, password);
                // console.log("Session created:", session);
                // console.log("User:", user);               
                return { user, session }; 
            } else {
                return null;
            }
        } catch (error) {
            console.log("appwrite service :: createaccount :: error", error);
            return {error};
        }
    }
    

    async createAccountWithGoogle() {
        try {
            await this.account.createOAuth2Session(
                'google', // Use 'google' as the provider string
                'http://localhost:5173/ide', 
                'http://localhost:5173/'
            );
        } catch (error) {
            console.log("appwrite service :: createAccountWithGoogle :: error", error);
            return error;
        }
    }
    

    async login({email,password}){
        try {
            return this.account.createEmailPasswordSession(email,password)
        } catch (error) {
            console.log("appwrite service :: login :: error",error);
            return error;
        }
    }

    async getCurrentUser()
    {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("appwrite service :: getcurrentuser :: error",error);
        }
        return null;
    }

    async logout(){
        try{
            await this.account.deleteSessions();
        }catch(error){
            console.log("appwrite service :: logout :: error",error);
            
        }
    }

    onAuthStateChange(callback) {
        // Simulate auth change using polling or events
        const interval = setInterval(async () => {
          const user = await this.getCurrentUser();
          callback(user);
        }, 1000);
    
        return () => clearInterval(interval);
      }
    
}

const authService = new AuthService();

export default authService;