import Error from '../Message/Error'
import Success from '../Message/Success'
import Crypto from 'crypto-es';

enum Status {
    Online = 'Online',
    Idle = 'Idle',
    Offline = 'Offline'
}

class User {
    UserID: number | undefined
    Email: string | undefined
    Name: string | undefined
    Password: string | undefined
    Salt: string | undefined
    Status: Status | undefined

    constructor(User?: { UserID: number, Email: string, Name: string, Password: string, Salt: string, Status: Status }) {
        this.UserID = User?.UserID
        this.Email = User?.Email
        this.Name = User?.Name
        this.Password = User?.Password
        this.Salt = User?.Salt
        this.Status = User?.Status
    }

    createUser() {
        if (this.UserID !== undefined)
            return <Error Error='User: Already Exists'/>
        if (Object.values(this).filter(Value => Value === undefined).length !== 0)
            return <Error Error="User: User Data doesn't exist." />
        return <Success Success='User: Create User.' />
    }

    updateUser() {
        if (Object.values(this).filter(Value => Value === undefined).length !== 0)
            return <Error Error="User: Doesn't Exist"/>
        return <Success Success='User: Update User.' />
    }

    setEmail(Email: string) {
        if (!Email.match(/^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i))
            return <Error Error='Email: Invalid Format' />
        this.Email = Email
        return <Success Success='Email: Email Updated.' />
    }

    setName(Name: string) {
        if (Name.length > 25)
            	return <Error Error='Name: Maximum 25 Characters' />
        this.Name = Name
        return <Success Success='Name: Name Updated.' />
    }

    setPassword(Password: string) {
        if (Password.length < 8)
            return <Error Error='Password: Minimum 8 Characters' />
        if (!Password.match(/[A-Z]/))
            return <Error Error='Password: At Least One Uppercase' />
        if (!Password.match(/[a-z]/))
            return <Error Error='Password: At Least One Lowercase' />
        if (!Password.match(/\d/))
            return <Error Error='Password: At Least One Digit' />
        if (!Password.match(/[_\W]/))
            return <Error Error='Password: At Least One Special Character' />
        this.Salt = Crypto.lib.WordArray.random(128/8).toString()
        Password = Crypto.algo.SHA256.create().update(Password).update(this.Salt).finalize().toString()
        this.Password = Password
        return <Success Success='Password: Password Updated.' />
    }

    setStatus(Status: Status) {
        return this.Status = Status
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
}

export { User, Status }
