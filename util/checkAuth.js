const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const { AuthenticationError } = require('apollo-server-errors')

dotenv.config()

module.exports = (context) => {
    const authHeader = context.req.headers.authorization
    if(authHeader){
        const token = authHeader.split(' ')[1]
        if(token){
            try {
                const user = jwt.verify(token, process.env.SECRET_KEY)
                return user
            } catch (error) {
                throw new AuthenticationError('Invalid')
            }
        }

        throw new Error('Authentication token must be \' Bearer [token]\'')
    }
    throw new Error('Authentication header nust be provided')
}