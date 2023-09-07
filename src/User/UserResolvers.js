import UserValidation from './UserValidation.js'
import UserDatabase from './UserDatabase.js'

export const UserResolvers = {
  Query: {
    loginUser: async (_, { User }, { Conn, Rep }) => {
      const LoginedUser = await new UserDatabase().loginUser(User, Conn)
      if(LoginedUser.Error) return { __typename: 'Error', ...{ Message: LoginedUser.getError() } }
      if(LoginedUser.User) {
        Rep.setCookie('AccessToken', LoginedUser.getAccessToken(), {
          maxAge: 60*30,
          httpOnly: true
        })
        Rep.setCookie('RefreshToken', LoginedUser.getRefreshToken(), {
          maxAge: 60*60*24*30,
          httpOnly: true
        })
        return { __typename: 'User', ...LoginedUser.getUser() }
      } 
    },
    allUsers: async (_, { Data }, { Conn, Authenticated }) => {
      console.log(Authenticated)
      const GetAllUsers = await new UserDatabase().allUsers(Conn, Authenticated)
      if(GetAllUsers.User) return { __typename: 'Users', ...{ Users: GetAllUsers.getUser() }}
      if(GetAllUsers.Error) return { __typename: 'Error', ...{ Message: GetAllUsers.getError() } }
    },
    logout: async (_, { Data }, { Conn, Rep }) => {
      Rep.clearCookie('AccessToken')
      Rep.clearCookie('RefreshToken')
      return { __typename: 'Success', ...{ Message: 'User logged out' } }
    }
  },
  Mutation: {
    createUser: async (_, { User }, { Conn, Rep }) => {
      const Email = new UserValidation().checkEmail(User.Email),
            Name = new UserValidation().checkName(User.Name),
            Password = new UserValidation().checkPassword(User.Password)

      if(Email.Error) return { __typename: 'Error', ...{ Message: Email.getError() } }
      if(Name.Error) return { __typename: 'Error', ...{ Message: Name.getError() } }
      if(Password.Error) return { __typename: 'Error', ...{ Message: Password.getError() } }

      User.Password = Password.encryptPassword(User.Password)
      const CreatedUser = await new UserDatabase().createUser(User, Conn)
      if(CreatedUser.Error) return { __typename: 'Error', ...{ Message: CreatedUser.getError() } }
      if(CreatedUser.User) {
        Rep.setCookie('AccessToken', CreatedUser.getAccessToken(), {
          maxAge: 60*30,
          httpOnly: true
        })
        Rep.setCookie('RefreshToken', CreatedUser.getRefreshToken(), {
          maxAge: 60*60*24*30,
          httpOnly: true
        })
        return { __typename: 'User', ...CreatedUser.getUser() }
      }
    }
  }
}