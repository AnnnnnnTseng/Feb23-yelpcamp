
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
//會在useSchema加入username/password的外掛，幫確認username沒重複等等
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);