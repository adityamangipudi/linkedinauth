/**
 * Created by adityamangipudi1 on 5/19/15.
 */

var mongoose = require('mongoose')
var UserModel = mongoose.model('user_info', {

    email: {
        type: String,
        required: true,
        unique: true
    },firstname: {
        type: String,
        required: true

    },lastname: {
        type: String,
        required: true
    },formattedName:{
        type: String,
        required: true
    },industry:{
        type: String,
        required: true
    },location:{
        type: Object,
        required: true
    },numConnections:{
        type: Number,
        required: true
    },pictureUrl:{
        type: String,
        required: true
    },publicProfileUrl:{
        type: String,
        required: true
    }, headline:{
        type: String
    }, linkedinId:{
        type: String,
        required: true
    }, timestamp:{
        type:Object,
        required:true
    }, user_type:{
        type: String,
        required: true
    }

})
module.exports = UserModel
