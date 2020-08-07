# descomplicabot


Endpoints usados:
- API da extensão de navegador usada para as dicas:
```javascript
`http://54.94.38.92:3000/${process.env.API_TOKEN}/tips`
```
https://who.is/whois-ip/ip-address/54.94.38.92
![api1](https://user-images.githubusercontent.com/54213349/86514921-d236ea80-bdeb-11ea-8b8d-bc7d67b5439a.PNG)

- API do app 10 segundos usada para os quizzes:
```javascript
`https://${process.env.DEZ_API_TOKEN}.amazonaws.com/trivia-paperx-production/lives/${data}/questions.js`
```
![api2](https://user-images.githubusercontent.com/54213349/86514968-2b068300-bdec-11ea-8e7d-ff9b964a2761.PNG)
