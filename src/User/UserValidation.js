import bcrypt from 'bcryptjs'
import Prisma from '@prisma/client'
import jwt from 'jsonwebtoken'

export default class UserValidation {
    constructor() {
        this.Success
        this.Error
    }

    checkErrors(Error) {
        if (Error instanceof Prisma.PrismaClientKnownRequestError)
            if (Error.code === 'P2002' && Error.meta.target === 'Email') return 'Email: Already Exists'
        return this
    }

    checkEmail(Email) {
        if (!Email.match(/^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i)) { this.Error = 'Email: Invalid Format'; return this }
        return this
    }

    checkName(Name) {
        if (Name.length > 25) { this.Error = 'Name: Maximum 25 Characters'; return this }
        return this
    }

    checkPassword(Password) {
        if (Password.length < 8) { this.Error = 'Password: Minimum 8 Characters'; return this }
        if (!Password.match(/[A-Z]/)) { this.Error = 'Password: At Least One Uppercase'; return this }
        if (!Password.match(/[a-z]/)) { this.Error = 'Password: At Least One Lowercase'; return this }
        if (!Password.match(/\d/)) { this.Error = 'Password: At Least One Digit'; return this }
        if (!Password.match(/[_\W]/)) { this.Error = 'Password: At Least One Special Character'; return this }
        return this
    }

    encryptPassword(Password) {
        return bcrypt.hashSync(Password, 10)
    }

    comparePassword(InputedPassword, DatabasePassword) {
        return bcrypt.compareSync(InputedPassword, DatabasePassword)
    }

    async authenticateUser(AccessToken, RefreshToken, Rep) {
        if (!AccessToken && !RefreshToken) { this.Error = 'Login Again or Create Account'; return this }
        if (!AccessToken) {
            const RefreshVerify = await jwt.verify(RefreshToken, process.env.JWT_REFRESH_SECRET)
            AccessToken = await jwt.sign({ UserID: RefreshVerify.UserID, Permissions: RefreshVerify.Permissions }, process.env.JWT_ACCESS_SECRET, {
                algorithm: 'HS256',
                expiresIn: process.env.JWT_ACCESS_EXPIRES
            })
            Rep.setCookie('AccessToken', AccessToken, {
                maxAge: 60*30,
                httpOnly: true
            })
        }
        const Verify = await jwt.verify(AccessToken, process.env.JWT_ACCESS_SECRET)
        this.Success = Verify
        return this
    }

    getError() {
        return this.Error
    }

    getSuccess() {
        return this.Success
    }
}