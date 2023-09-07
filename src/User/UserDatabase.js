import UserValidation from './UserValidation.js'
import jwt from 'jsonwebtoken'

export default class UserDatabase extends UserValidation {
    constructor() {
        super()
        this.User
        this.Error
        this.AccessToken
        this.RefreshToken
    }

    async allUsers(Conn, Authenticated) {
        if (Authenticated.Permissions !== 'Admin') { this.Error = "You don't have permissions"; return this}
        try {
            this.User = await Conn.user.findMany()
        } catch(Error) {
            this.Error = this.checkErrors(Error)
        }
        return this
    }

    async createUser(User, Conn) {
        try {
            this.User = await Conn.user.create({
                data: {
                    Email: User.Email,
                    Name: User.Name,
                    Password: User.Password
                }
            })
            const AccessToken = await jwt.sign({ UserID: this.User.UserID, Permissions: this.User.Permissions }, process.env.JWT_ACCESS_SECRET, {
                    algorithm: 'HS256',
                    expiresIn: process.env.JWT_ACCESS_EXPIRES
                }),
                RefreshToken = await jwt.sign({ UserID: this.User.UserID, Permissions: this.User.Permissions }, process.env.JWT_REFRESH_SECRET, {
                    algorithm: 'HS256',
                    expiresIn: process.env.JWT_REFRESH_EXPIRES
                })
            this.AccessToken = AccessToken
            this.RefreshToken = RefreshToken
        } catch(Error) {
            this.Error = this.checkErrors(Error)
        }
        return this
    }

    async loginUser(User, Conn) {
        try {
            this.User = await Conn.user.findUnique({
                where: {
                    Email: User.Email
                }
            })
            if (!this.comparePassword(User.Password, this.User.Password)) { this.Error = 'Incorrect Password'; return this }
            const AccessToken = await jwt.sign({ UserID: this.User.UserID, Permissions: this.User.Permissions }, process.env.JWT_ACCESS_SECRET, {
                    algorithm: 'HS256',
                    expiresIn: process.env.JWT_ACCESS_EXPIRES
                }),
                RefreshToken = await jwt.sign({ UserID: this.User.UserID, Permissions: this.User.Permissions }, process.env.JWT_REFRESH_SECRET, {
                    algorithm: 'HS256',
                    expiresIn: process.env.JWT_REFRESH_EXPIRES
                })
            this.AccessToken = AccessToken
            this.RefreshToken = RefreshToken
        } catch(Error) {
            this.Error = this.checkErrors(Error)
        }
        return this
    }

    getUser() {
        return this.User
    }

    getAccessToken() {
        return this.AccessToken
    }

    getRefreshToken() {
        return this.RefreshToken
    }

    getError() {
        return this.Error
    }
}