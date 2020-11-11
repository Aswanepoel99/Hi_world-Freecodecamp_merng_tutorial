//imports neccesary modules
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInpuError, UserInputError } = require('apollo-server');

//import config util, and models
const User = require('../../models/user');
const { SECRET_KEY } = require('../../config')
const { validateRegisterInput, validateLoginInput } = require('../../Util/validators')

//create helper function
function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
    }, SECRET_KEY,
        { expiresIn: '1h' });
}


module.exports = {
    Mutation: {
        //defines how to login and confirm credentials
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);

            if (!valid) {
                throw new UserInputError('errors', { errors });
            }

            const user = await User.findOne({ username });
            if (!User) {
                errors.general = "User not Found";
                throw new UserInpuError("User not found", { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Password does not match'
                throw new UserInputError('Wrong credentials', { errors });
            }
            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            };

        },
        //defines how to register new user
        async register(
            _,
            {
                registerInput: { username, email, password, confirmPassword }
            },
        ) {
            // validate user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }
            // ensure suer does not already exist
            const user = await User.findOne({ username })
            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This Username is taken'
                    }
                })
            }
            // hash password and create auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}