var request = require("request");
require('dotenv').config();


function telegram(method, param, cb){
    var options = {
        method: 'POST',
        url: `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/${method}`,
        json: true,
        formData: param
      };
      
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
      
       if(cb) cb(body,response)
      });


}
module.exports.telegram  = telegram;