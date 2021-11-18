module.exports.validateRegisterInput = (username, email, password, confirmPassword)=> {
    const errors = {}
    if (username.trim() === '') errors.username = 'username must not be empty'
    if (email.trim() === '') errors.email = 'email must not be empty'
    
    if(password === '') {
        errors.password = 'password must not empty'
    } else if(password !== confirmPassword) {
        errors.confirmPassword = 'password must match'
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput = (username, password) => {
    const errors = {}
    if(username.trim() === ''){
        errors.username = "Username must not be empty"
    }
    if(password.trim() === ''){
        errors.username = "Username must not be empty"
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}