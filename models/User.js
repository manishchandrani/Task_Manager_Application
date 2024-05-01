const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String
    }
});

userSchema.pre('save', async function(next) {
    try{
        const user = this;
        if(!user.isModified('password')){
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(this.password, salt);
        user.password= hashedPassword;
        next();
    }catch(error){
        return next(error);
    }
});

userSchema.methods.matchPassword = async function(password){
    try{
        return await bcrypt.compare(password, this.password);
    }catch(error){
        throw new Error(error);
    }
};


module.exports = mongoose.model('User', userSchema);