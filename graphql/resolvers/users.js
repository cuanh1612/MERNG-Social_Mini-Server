const user = require('../../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const {UserInputError} = require('apollo-server') 
const {validateRegisterInput, validateLoginInput} = require('../../util/validators')

dotenv.config()

function generateToken(user){
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,

    }, process.env.SECRET_KEY, {
        expiresIn: '1h'
    })
}

const userResolvers = {
    Query: {

    },
    Mutation: {
        login: async (_, {username, password}) => {
            const {errors, valid} = validateLoginInput(username, password)

            if(!valid){
                throw new UserInputError('Errors', {errors})
            }

            const User = await user.findOne({username})

            if(!User){
                errors.general = "User not found"
                throw new UserInputError("User not found", {errors})
            }

            const match = await bcrypt.compare(password, User.password)

            if(!match){
                errors.general = 'Wrong crendetials'
                throw new UserInputError('Wrong crendetials', {errors})
            }

            const token = generateToken(User)

            return {
                ...User._doc,
                id: User._id,
                token
            }
        },


        register: async (
            _, 
            {registerInput: {username, email, password, confirmPassword}}, 
            context, 
            info
        ) => {
            const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword)
            if(!valid){
                throw new UserInputError('Errors', {errors})
            }

            const User = await user.findOne({username});

            if(User){
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is take'
                    }
                })
            }

            password = await bcrypt.hash(password, 12)

            const newUser  = new user({
                email,
                username,
                password,
                createdAt: new Date().toString()
            })

            const res = await newUser.save()

            const token = generateToken(res)

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}

module.exports = userResolvers