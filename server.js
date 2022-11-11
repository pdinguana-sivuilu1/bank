const HTTP_PORT = process.env.PORT || 3000;

// express and handlebars 
const express = require('express');
const http = require('http')
const app = express();
const exphbs = require('express-handlebars');

// path module
const path = require('path');

// file system
var fs = require('fs');

// json parse
const bodyParser = require('body-parser');

// require client session
const clientsessions = require("client-sessions");

// require cookie parser
var cookieParser = require('cookie-parser')

// setting up static 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("static"));

// require random string
const randomStr = require("randomstring");

// random string variable
var strRandom = randomStr.generate();

// parsing app
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text({ type: 'text/html'}));

// parse cookie
app.use(cookieParser())

// Setup client-sessions
app.use(clientsessions({
cookieName: "session", 
secret: strRandom,
duration: 5 * 60 * 1000,
activeDuration: 1 * 60 * 1000,
httpOnly: true,
secure: true,
ephemeral: true
}));

// rendering engine
app.engine('.hbs', exphbs.engine({
extname: '.hbs',
defaultLayout: false,
layoutsDir: "views",
partialsDir: __dirname + '/views'
}));

// setting up view paths
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

// route for the /headers page
app.get("/headers", (req, res) => {
const headers = req.headers;
res.send(headers);
});

// Setup a route on the 'root' of the url to redirect to /login
app.get("/", (req, res) => {
res.redirect("/login");
})

// Display the home page
app.get("/login", (req, res) => {
res.render("login")
});

// Display the landing page with conditions
app.post("/login", (req, res) => {
var somedata = {
username: req.body.txtUserName,
password: req.body.txtPassword
}

// read user file
fs.readFile('user.json', (err, data) => {

// parse user file with conditions
users = JSON.parse(data)
for(const key in users){
if(somedata.username == key && somedata.password !== users[key]){
return res.render("login", { message: "Invalid password", layout: false })}
else if(somedata.username !== key && somedata.password == users[key]){
return res.render("login", { message: "Not a registered username", layout: false });
}
else 
break;
}

// render success login to landing page
res.render("landing", { user: somedata, layout: false })

// cookie
res.cookie('session', 'ten', {maxAge: 10000});

// session
req.session.user = somedata.username;
console.log(req.session)
})})

app.post("/l", (req, res) => {
var b = req.params.b;
var l = req.params.l;
// read accounts file
fs.readFile('accounts.json', (err, accounts) => {
// parse accounts file 
accs = JSON.parse(accounts)
for (var key in accs){
var q = {
k: req.body.txtid,
x: "Account: " + key,
y: "Account Type " + accs[key].accountType,
z: "Account Balance: "+ accs[key].accountBalance
}
if (q.k == key){
return res.render("balance", {c: q})}
else 
break;
}
return res.render("landing", { message: "Invalid Account Number"})
}
)})

app.post('/b', (req, res, next) => {
var l = req.params.l;
var b = req.params.b;
return res.render("landing")
})

// Log a user out by destroying their session and redirecting them to /login
app.post("/logout", function (req, res) {
req.session.reset();
res.redirect("/login");
});    

// listening to connection
app.listen(3000);