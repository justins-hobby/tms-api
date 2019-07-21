const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const AccountSchema = mongoose.Schema(
    {        
        employeeID: String,
        userName: String,
        passwordHash: String,
        emailAddress: String,
        isLocked: Boolean,
        isActivated: Boolean
    },
    {
        timestamps: true
    }
)

AccountSchema.pre('save', function(next){
    var account = this;
    if(!account.isModified('passwordHash')) { return next() };
    bcrypt.hash(account.passwordHash, 15).then((hashedPassword) => {
        account.passwordHash = hashedPassword
        next();
    })
}, function(err){
    next(err);
})

AccountSchema.methods.comparePassword = function(providedPassword, next){
    bcrypt.compare(providedPassword, this.passwordHash, function(error, isEqual)
    {
        if(error) return next(error);
        next(null, isEqual)
    })
}


module.exports = mongoose.model('Accounts', AccountSchema);