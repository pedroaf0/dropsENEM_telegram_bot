const request = require("request");
const http = require("http");
const express = require("express");
const { telegram } = require('./js.js')
const convert = require('xml-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3333;

const server = http.createServer(app);

app.post('/quiz'+process.env.TELEGRAM_TOKEN,async (req, res) => {

    GetQuiz((statement, alternatives, correct_index, inlineKeyboard)=>{
      telegram('sendPoll',{
        chat_id: process.env.CHAT_ID,
        type:'quiz',
        question:statement,
        options:JSON.stringify(alternatives),
        correct_option_id:correct_index,
        reply_markup:JSON.stringify(inlineKeyboard)
      }, ()=>{res.write(statement+'\n'+alternatives) 
              res.end();})
    })
})
app.post('/tip'+process.env.TELEGRAM_TOKEN,async (req, res) => {
 GetTip((inlineKeyboard, Message)=>{
    telegram('sendMessage', {
        chat_id: process.env.CHAT_ID,
        text: Message,
        reply_markup: JSON.stringify(inlineKeyboard),
        parse_mode:'Markdown'
        },body=>{console.log('ok:'+body.ok)
                  res.write(Message) 
                  res.end();})
    })
 })
function GetQuiz(cb){
  var options = {
    method: 'GET',
    url: `https://${process.env.DEZ_API_TOKEN}.amazonaws.com/trivia-paperx-production/`
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var result1 = convert.xml2js(body, {compact: false, spaces: 4});
    console.log(result1.elements[0].elements[100+getRandomInt(800)].elements[0].elements[0].text.split('/')[1]) 
    const data = result1.elements[0].elements[100+getRandomInt(800)].elements[0].elements[0].text.split('/')[1]
  



  var options = {
    method: 'GET',
    url: `https://${process.env.DEZ_API_TOKEN}.amazonaws.com/trivia-paperx-production/lives/${data}/questions.js`
  };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
   // console.log(body);
   const { extraQuestion, finalExtraQuestion, questions, videoDurations, feedbackTimes, winnersTime, extraQuestionTime, videoUrls } = eval(body.split('winnersTime, extraQuestionTime').join('winnersTime, extraQuestionTime,videoUrls'));
  const n = getRandomInt(10)
   console.log(questions[n]);
   console.log(videoUrls[n+2]);
  const { statement, alternatives, correct_index } = questions[n];
  const inlineKeyboard = {
    inline_keyboard: [
        [
            {
                text: 'Explicação',
                url:videoUrls[n+2]
            }
        ]
    ]
  };

  cb(statement, alternatives, correct_index, inlineKeyboard)


  });
})
}

function GetTip(cb){

var options = {
  method: 'POST',
  url: `http://54.94.38.92:3000/${process.env.API_TOKEN}/tips`
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);
    var { tipId, exam, subject, content, url} = JSON.parse(body)[getRandomInt(100)]
  console.log({ tipId, exam, subject, content, url});

  const inlineKeyboard = {
    inline_keyboard: [
        [
            {
                text: '👍',
                callback_data: 'upvote-'+tipId 
            },                {
                text: '👎',
                callback_data: 'downvote-'+tipId
            }
        ],
        [
            {
                text: 'Entenda tudo desse assunto',
                url:url
            }
        ]
    ]
  };
  content = content.split('**').join('*')
  content = content.split('_').join('')
  subject = subject.split(' ').join('_')
  exam = exam.split(' ').join('_')
  var Message = `Daily Tip\n#${subject} #${exam}\n\n${content}`
  
  cb(inlineKeyboard, Message)
});

}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
console.log("api escutando em "+port)
server.listen(port);