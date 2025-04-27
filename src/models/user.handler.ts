import { users, sessionTokens } from "../mainDatabase";
import { UserInterface } from "../dto/user/user.interface";
import { compare } from 'bcrypt';
import * as mongodb from "mongodb";
import e from "cors";

export class UserHandler {
    private selectedUsers: UserInterface[];
    private readonly sessiontokenExpireTime: number = 1; // in hours

    constructor() {
    }

    /**
     * Select a user by username.
     * Replaces the selected users array with the user found by the username, if found.
     * 
     * @param {string} username - the username to find
     * @returns `boolean` - wether the user was found or not
    */
    async findUserByUsername(username: string): Promise<boolean> {
        const user = await users.findOne({ username: username }).lean();
        if (!user) {
            return false;
        } else {
            this.selectedUsers = [];
            this.selectedUsers.push(user);
            return true;
        }
    }

    /**
     * Get the selected user.
     * Selected user being the first user in the already selected users array.
     * 
     * @returns `UserInterface | undefined`
     */
    getUser(): UserInterface | undefined {
        if (!this.selectedUsers || this.selectedUsers.length === 0 || !this.selectedUsers[0]) {
            return undefined;
        }
        return this.selectedUsers[0];
    }


    /**
     * Validates the password for the selected user.
     * Selected user being the first user in the already selected users array.
     * - If multiple users are selected, only the first one will be used
    * @param {string} password - the password to validate
    * @returns `boolean` - wether the password is valid or not
    */
    async validatePassword(password: string): Promise<boolean> {
        if (!this.selectedUsers) {
            return false;
        }
        const passwordMatch = await compare(password, this.selectedUsers[0].password);
        if (!passwordMatch) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Creates a session token for the selected user.
     * Selected user being the first user in the already selected users array.
     * Automatically deletes old session tokens.
     * 
     * @returns `string | undefined` - the session token if a user is selected.
     */
    async createSessionToken(): Promise<string | undefined> {
        if (!this.selectedUsers || this.selectedUsers.length === 0 || !this.selectedUsers[0]) {
            return;
        }
        const user = this.selectedUsers[0];
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + this.sessiontokenExpireTime);
        const oldSessionToken = await sessionTokens.findOne({ userId: user._id }).lean();
        if (oldSessionToken) {
            await this.removeAllSessionTokens()
        }
        const sessionToken = await sessionTokens.create({ userId: user._id, expirationDate: expirationDate });
        sessionToken.save();
        return sessionToken._id.toString();
    }

    /**
     * Checks if a session token is valid, meaning it exists and is not expired.
     * 
     * @param {string} sessionToken - the session token to check
     * @returns `boolean | string` - wether the session token is valid or not, if it is a string, it's the reason why it's invalid.
     * 
     */
    async validateSessionToken(sessionToken: string): Promise<boolean | string> {
        var sessionTokenId = undefined;
        try {
            sessionTokenId = new mongodb.ObjectId(sessionToken);
        } catch (error) {
            return "Invalid session token format";
        }
        // check if the session token is valid by checking if it exists and if it's not expired
        const sessionTokenObject = await sessionTokens.findOne({ _id: sessionTokenId }).lean();
        if (!sessionTokenObject) {
            return false;
        }
        if (sessionTokenObject.expirationDate < new Date()) {
            this.removeSessionToken(sessionToken);
            return false;
        }
        return true;
    }

    /**
     * Removes a session token from the database by it's id.
     * 
     * @param {string} sessionToken - the session token to remove
     * @returns `boolean` - wether the session token was removed or not
     */
    async removeSessionToken(sessionToken: string): Promise<boolean> {
        var sessionTokenId = undefined;
        try {
            sessionTokenId = new mongodb.ObjectId(sessionToken);
        } catch (error) {
            return false;
        }
        try {
            const deleteResult = await sessionTokens.deleteOne({ _id: sessionTokenId });
            if (deleteResult.deletedCount === 1) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * Removes all session tokens from the database for the selected user.
     * Selected user being the first user in the already selected users array.
     * 
     * @returns `boolean` - wether the session tokens were removed or not
     */
    async removeAllSessionTokens(): Promise<boolean> {
        if (!this.selectedUsers || this.selectedUsers.length === 0 || !this.selectedUsers[0]) {
            return false;
        }
        try {
            const deleteResult = await sessionTokens.deleteMany({ userId: this.selectedUsers[0]._id });
            if (deleteResult.deletedCount > 0) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * Selects a user by it's id.
     * Overwrites the selected users array with the user found by the id, if found.
     * 
     * @param {string} userId - the id of the user to select
     * @returns `boolean` - wether the user was selected or not
     */
    async selectUserById(userIdString: string): Promise<boolean> {
        var userId = undefined;
        try {
            userId = new mongodb.ObjectId(userIdString);
        } catch (error) {
            return false;
        }
        const user = await users.findOne({ _id: userId }).lean();
        if (!user) {
            return false;
        } else {
            this.selectedUsers = [];
            this.selectedUsers.push(user);
            return true;
        }
    }

    /**
     * Get userID by sessionToken
     * 
     * @param {string} sessionToken - the session token to check
     * @returns `string | undefined` - the userid if it is a valid sessiontoken.
     */
    async getUserIdBySessionToken(sessionToken: string): Promise<string | undefined> {
        var sessionTokenId = undefined;
        try {
            sessionTokenId = new mongodb.ObjectId(sessionToken);
        } catch (error) {
            return;
        }
        const sessionTokenObject = await sessionTokens.findOne({ _id: sessionTokenId }).lean();
        if (!sessionTokenObject) {
            return;
        }
        return `${sessionTokenObject.userId}`;
    }

    /**
     * Get the username of the selected user(s).
     * Selected user(s) being the user(s) in the already selected users array.
     * 
     * @returns `string[] | undefined` - the username of the selected user if a user is selected.
     */
    getUsernames(): string[] | undefined {
        if (!this.selectedUsers || this.selectedUsers.length === 0 || !this.selectedUsers[0]) {
            return;
        }
        var usernames: string[] = [];
        this.selectedUsers.forEach(user => {
            usernames.push(user.username);
        });
        return usernames;
    }
}