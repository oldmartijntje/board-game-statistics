import { UserHandler } from "./user.handler";
import { UserInterface } from "../dto/user/user.interface";

export class Authenticator {
    private userHandlerInstance: UserHandler;
    private sessionToken: string | undefined;
    private isAuthenticated: boolean;
    private user: UserInterface | undefined;

    constructor() {
        this.userHandlerInstance = new UserHandler();
        this.isAuthenticated = false;
    }

    /**
     * Sets the `isAuthenticated` boolean to `false`
     */
    private unAuthorise() {
        this.isAuthenticated = false;
    }

    /**
     * Sets the `isAuthenticated` boolean to `true`
     */
    private authorise() {
        this.isAuthenticated = true;
    }

    /**
     * Tries to login with sessionToken.
     * @param sessionTokenString - the sessionToken
     * @returns `boolean` - wether it's a valid token or not.
     */
    async authenticateBySessionToken(sessionTokenString: string): Promise<boolean> {
        const validSessionToken = await this.userHandlerInstance.validateSessionToken(sessionTokenString);
        if (typeof validSessionToken === "string" || validSessionToken === false) {
            // The sessiontoken is invalid
            this.unAuthorise();
            return false;
        }
        const userId = await this.userHandlerInstance.getUserIdBySessionToken(sessionTokenString);
        if (typeof userId === "boolean") {
            // The sessiontoken was valid, but unable to get the userId.
            this.unAuthorise();
            return false;
        }
        const user = await this.userHandlerInstance.selectUserById(userId);
        if (user) {
            // user is authenticated
            this.sessionToken = sessionTokenString;
            this.user = this.userHandlerInstance.getUser()
            this.authorise();
            return true;
        } else {
            // The sessiontoken was valid, but the user doesn't exist.
            this.unAuthorise();
            return false;
        }
    }

    /**
     * Wether or not the user is authenticated.
     * @returns `boolean`
     */
    isAuthorised() {
        return this.isAuthenticated;
    }

    /**
     * Tries to login with credentials
     * Auto creates a sessiontoken.
     * @param username
     * @param password
     * @returns `boolean` - wether it's a valid login.
     */
    async authenticateByLogin(username: string, password: string): Promise<boolean> {
        if (!await this.userHandlerInstance.findUserByUsername(username)) {
            this.unAuthorise();
            return false;
        }
        if (!await this.userHandlerInstance.validatePassword(password)) {
            this.unAuthorise();
            return false;
        }
        this.user = this.userHandlerInstance.getUser()
        this.authorise();
        const sessionToken = await this.userHandlerInstance.createSessionToken();
        this.sessionToken = sessionToken;
        return true;
    }

    /**
     * Returns the userHandler
     * @returns `UserHandler` - the userhandler the class uses.
     */
    getUserHandler(): UserHandler {
        return this.userHandlerInstance;
    }

    /**
     * Returns your user data.
     * @returns `UserInterface` - without the password field.
     */
    getUserData(): UserInterface | undefined {
        if (!this.user) {
            return;
        }
        const user = { ...this.user };
        delete user.password;
        return user;
    }

    /**
     * Returns the SessionToken if definded.
     * @returns `string` sessionToken
     */
    getSessionToken(): string | undefined {
        return this.sessionToken
    }

}