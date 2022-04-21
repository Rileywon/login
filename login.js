const EXPRESS = require ('express')
const {ObjectId, MongoClient} = require('mongodb')

const APP = EXPRESS()
const expressSession = require('express-session')
//const URL = 'mongodb://localhost:27017'
const URL = 'mongodb+srv://new-thang-99:27112011@cluster0.xogzz.mongodb.net/test';

APP.use(EXPRESS.urlencoded({extended:true}))
APP.set('view engine', 'hbs')
APP.use(expressSession({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000
    },
    }))
   



APP.get('/', async (req,res)=>{
    const client = await MongoClient.connect(URL);
    const dbo = client.db("login");
    const allProducts = await dbo.collection("products").find({}).toArray();
    console.log(req.session.products);
    if(!req.session.products) {
        res.render('login', {data:allProducts})
    } else {
        res.render('home');
    }
})

APP.post('/insert', async (req,res)=>{
    const emailInput = req.body.txtEmail;
    const passwordInput = req.body.txtPassword;
        if((!passwordInput && passwordInput.length < 8) || emailInput.length ==0){
            console.log("ko chay");
            res.redirect('registers');
        }else {
            const newProduct = {email :emailInput, password :passwordInput};
            const client = await MongoClient.connect(URL);
            const dbo = client.db("login");
            console.log({email :emailInput, password :passwordInput})
            try {
                await dbo.collection("products").insertOne(newProduct)
             } catch (e) {
                print (e);
             }
            res.redirect('/');
        }
})
APP.get('/registers', async (req,res)=>{
    res.render('register')

})
APP.get('/forget', async (req,res)=>{
    res.render('forget')
})

APP.post('/forget', async (req,res)=>{
    const rename = req.body.rename;
    const client = await MongoClient.connect(URL);
    const dbo = client.db("login");
    console.log({email:rename})
    await dbo.collection("products").find({email: rename}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        if(result.length > 0){
            res.render('login', {data:result})
         }else {
            res.redirect('/forget');
        }
      });;
})

APP.post('/auth/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
        })
}) 
APP.get('/logout', async (req,res)=>{
    res.render('login')
})


APP.post('/lg', async (req, res)=>{
    const username = req.body.useremails;
    const userpassword = req.body.userpasswords;
    const client = await MongoClient.connect(URL);
    const dbo = client.db("login");
    let user = {email:username, password:userpassword}
    await dbo.collection("products").find(user).toArray(function(err, result) {
        if (err) throw err;
        console.log(result[0]._id);
        if(result.length > 0){
            console.log(result[0]._id)
            req.session.products = result[0]._id
            console.log(req.session)
            res.render('home', {data:result})
         }else {
            res.redirect('/');
        }
      });;
})

const PORT = process.env.PORT || 5000;
APP.listen(PORT);