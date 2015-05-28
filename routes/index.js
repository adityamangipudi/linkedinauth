var express = require('express');
var config = require('../config.json');
var SessionModel = require('../models/SessionModel');

var router = express.Router();
function validate(req, res, next) {
  console.log('req-cookies[shark]',req.cookies);
  console.log('req-cookies[shark]',req.cookies['shark-cookie']);
  console.log('req-cookiestypeof',typeof req.cookies['shark-cookie'] );
  //res.clearCookie('shark-cookie'); next();
  if(typeof req.cookies['shark-cookie'] !=='undefined'&&req.cookies['shark-cookie'] !=='undefined'){
    var user =  req.cookies['shark-cookie'];
    SessionModel.findOne({userid: user}, function(err, result){
        if(err) next();
        else{

          console.log('res', result);
          var userid = result['userid'];
          res.redirect('/authorize/authenticated?user='+userid);

         // next();

        }
    });
  }
  else{
    next();
  }

}


/* GET home page. */
router.get('/',validate, function(req, res, next) {
  res.render('index', { title: 'Shark City' , key:config.api_key});
});

module.exports = router;
