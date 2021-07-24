const request = require("request");
const http = require("http");
const express = require("express");
const { telegram } = require('./telegram.js')
const convert = require('xml-js');
require('dotenv').config();
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3333;

const server = http.createServer(app);
app.post('/webhook',async (req, res) => {
  res.status(200); 
  res.end();
  })
app.post('/quiz'+process.env.TELEGRAM_TOKEN,async (req, res) => {

    GetQuiz((statement, alternatives, correct_index, videoUrl)=>{
      telegram('sendPoll',{
        chat_id: process.env.CHAT_ID,
        type:'quiz',
        question:statement,
        options:JSON.stringify(alternatives),
        correct_option_id:correct_index,
        explanation:`[Clique aqui para ver a explicação](${videoUrl})`,
        explanation_parse_mode:"MarkdownV2"

      }, ()=>{res.write(statement+'\n'+alternatives) 
              res.end();})
    })
})
app.post('/tip'+process.env.TELEGRAM_TOKEN,async (req, res) => {
 GetTip((Message)=>{
    telegram('sendMessage', {
        chat_id: process.env.CHAT_ID,
        text: Message,
        parse_mode:'Markdown'
        },body=>{console.log(body)
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
    const data = result1.elements[0].elements[100+getRandomInt(900)].elements[0].elements[0].text.split('/')[1]
  
  var options = {
    method: 'GET',
    url: `https://${process.env.DEZ_API_TOKEN}.amazonaws.com/trivia-paperx-production/lives/${data}/questions.js`
  };
  
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
   // console.log(body);
   const {  questions,  videoUrls } = eval(body.split('winnersTime, extraQuestionTime').join('winnersTime, extraQuestionTime,videoUrls'));
  const n = getRandomInt(10)
   console.log(questions[n]);
   console.log(videoUrls[n+2]);
  const { statement, alternatives, correct_index } = questions[n];
  const videoUrl = videoUrls[n+2];

  cb(statement, alternatives, correct_index, videoUrl);


  });
})
}

function GetTip(cb){


    var { tipId, exam, subject, content, url} = JSON.parse(fs.readFileSync('tips.backup.json').toString())[getRandomInt(200)]
  console.log({ tipId, exam, subject, content, url});

  content = content.split('**').join('*')
  content = content.split('_').join('')
  subject = subject.split(' ').join('_')
  exam = exam.split(' ').join('_')
  const Message = `DICAAA!\n#${subject} #${exam}\n\n${content}`

  cb(Message)


}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
console.log("api escutando em "+port)
server.listen(port);