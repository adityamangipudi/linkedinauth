/**
 * Created by adityamangipudi1 on 5/26/15.
 */
var express = require('express');
var config = require('../config.json');
var passport = require('passport');
var session = require('express-session');
var logout = require('express-passport-logout');
var SessionModel = require('../models/SessionModel');
var UserModel = require('../models/UserModel');
var router = express.Router();
router.use(passport.initialize());
router.use(passport.session());
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
function uuid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
}

var profileG,type={}, id, user;
var LINKEDIN_KEY =config.api_key;
var LINKEDIN_SECRET = config.secret_key;

passport.serializeUser(function(user, done) {
    //console.log('user', user);
    done(null, user);
});

passport.deserializeUser(function(user, done){
    done(null, user);
});
passport.use('linkedin',new LinkedInStrategy({
    clientID: LINKEDIN_KEY,
    clientSecret: LINKEDIN_SECRET,
    callbackURL: "http://localhost:3000/authorize/linkedin/callback",
    scope: ['r_emailaddress', 'r_basicprofile']
}, function( accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

        profileG=profile;
        var user_data = profileG['_json'];
        console.log('prof',profile);
        if(type[id]['user_type']==='1'){
            var user_obj = {
                email:user_data.emailAddress,
                firstname:user_data.firstName,
                lastname:user_data.lastName,
                formattedName:user_data.formattedName,
                industry:user_data.industry,
                location:user_data.location,
                numConnections:user_data.numConnections,
                pictureUrl:user_data.pictureUrl,
                publicProfileUrl:user_data.publicProfileUrl,
                headline:user_data.headline,
                linkedinId:user_data.id,
                timestamp: new Date(Date.now()),
                user_type: 'Venture Capitalist'

            }
            UserModel.findOneAndUpdate({email: user_data.emailAddress, linkedinId:user_data.id},user_obj , {upsert: true, 'new': true}, function(err, result){
                if(err) console.log(err);
                else{
                    console.log('res',result)
                    user = result['_id'];
                    console.log('user',typeof user);
                    SessionModel.findOneAndUpdate({userid: user}, {userid:user, timestamp: Date.now()}, {upsert:true, 'new': true}, function(err, sessresult){
                        if(err) console.log(err);
                        else{
                            console.log('sesres', sessresult);
                            return done(null, profile);

                        }
                    });
                }
            });
        }else{
            var user_obj = {
                email:user_data.emailAddress,
                firstname:user_data.firstName,
                lastname:user_data.lastName,
                formattedName:user_data.formattedName,
                industry:user_data.industry,
                location:user_data.location,
                numConnections:user_data.numConnections,
                pictureUrl:user_data.pictureUrl,
                publicProfileUrl:user_data.publicProfileUrl,
                headline:user_data.headline,
                linkedinId:user_data.id,
                timestamp: new Date(Date.now()),
                user_type: 'Entrepreneur'

            }
            UserModel.findOneAndUpdate({email: user_data.emailAddress, linkedinId:user_data.id},user_obj , {upsert: true, 'new': true}, function(err, result){
                if(err) console.log(err);
                else{
                    console.log('res',result);
                    user = result['_id'];
                    console.log('user',user);
                    SessionModel.findOneAndUpdate({userid: user}, {userid:user, timestamp: Date.now()}, {upsert:true, 'new': true}, function(err, sessresult){
                        if(err) console.log(err);
                        else{
                            console.log('sesres', sessresult);
                            return done(null, profile);

                        }
                    });
                }
            });
        }
    });
}));

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Shark City' , key:config.api_key});
});
router.get('/:type/linkedin', function(req, res, next) {
    console.log('c',req.params.type);
     id = 'req_'+uuid();
    type[id]={
        user_type: req.params.type};
    passport.authenticate('linkedin', { state: '7e12584c423443244ddbb15c847450bba436'  })(req, res, next);
   // res.render('index', { title: 'Shark City' , key:config.api_key});
}, function() {});

router.get('/linkedin/callback',function(req, res, next){
    console.log('here');
    passport.authenticate('linkedin',function(err, usr){
        console.log('here2');

        if(err) res.redirect('/');
        else{
            console.log('usr in callbak',usr);
            req.user=usr;
            res.redirect('/authorize/authenticated');
        }
        /* {successRedirect: '/authorize/authenticated',
         failureRedirect: '/'
         }*/
    })(req, res, next);


});
router.get('/authenticated', function(req, res){
    if(typeof req.query.user !== 'undefined'){
        user = req.query.user;

    }
    UserModel.findOne({_id:user}, function(err, result){
       if(err) console.log(err);
        else {
           console.log('resuser',result);
           console.log('cook', user)
           res.cookie('shark-cookie', user);
           res.render('authenticated', {title:result['formattedName'],profile: result['pictureUrl'], key:config.api_key});
       }
    });

});

router.get('/logout', function(req, res){
    res.clearCookie('shark-cookie');
    req.logout();
    console.log('after logout', req.session);
    profileG = null;
    res.redirect('/');
});
module.exports = router;
