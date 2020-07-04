# descomplicabot


Endpoints usados:
- API da extensão de navegador usada para as dicas:
```javascript
`http://54.94.38.92:3000/${process.env.API_TOKEN}/tips`
```
https://who.is/whois-ip/ip-address/54.94.38.92
- API do app 10 segundos usada para os quizzes:
```javascript
`https://${process.env.DEZ_API_TOKEN}.amazonaws.com/trivia-paperx-production/lives/${data}/questions.js`
```

A propósito, o fato de eu ter acesso a essas APIs pode ser considerado uma falha de segurança de seus sistemas, mas não é nada que vocês precisem se preocupar, pois pelo o que eu chequei nenhuma informação crítica está sendo vazada.  
