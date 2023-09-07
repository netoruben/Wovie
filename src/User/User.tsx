import { UserStatus, UserPermissions, User as UserInterface } from '@prisma/client'

export default class User implements UserInterface {
    UserID: number
    Email: string
    Name: string
    Password: string
    Status: UserStatus
    Permissions: UserPermissions
    JoinedWhen: Date
    UpdatedWhen: Date

    constructor(User: { UserID: number, Email: string, Name: string, Password: string, Status: UserStatus, Permissions: UserPermissions, JoinedWhen: Date, UpdatedWhen: Date }) {
        this.UserID = User.UserID
        this.Email = User.Email
        this.Name = User.Name
        this.Password = User.Password
        this.Status = User.Status
        this.Permissions = User.Permissions
        this.JoinedWhen = User.JoinedWhen
        this.UpdatedWhen = User.UpdatedWhen
    }
    
    getUserID() {
        return this.UserID
    }

    getEmail() {
        return this.Email
    }

    getName() {
        return this.Name
    }

    getPassword() {
        return this.Password
    }

    getStatus() {
        return this.Status
    }

    getJoinedWhen() {
        return this.JoinedWhen
    }
}