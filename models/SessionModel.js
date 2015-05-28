/**
 * Created by adityamangipudi1 on 5/19/15.
 */

var mongoose = require('mongoose')
var SessionModel = mongoose.model('user_session', {
    userid: {
        type: String,
        required: true,
        unique: true
    }, timestamp:{
        type: Object
    }
});
module.exports = SessionModel;
