var express = require('express')
var app = express()
var MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId;
var url = "mongodb+srv://truong321:truong321@cluster0.jje0pst.mongodb.net/test"


app.set('view engine', 'hbs')
app.use(express.urlencoded({extended: true}))

app.use(express.static('style'))

app.post('/addProduct',async(req,res)=>{
    let name = req.body.txtName
    let price = Number(req.body.txtPrice)
    let imageURL = req.body.txtPic
    let description = req.body.txtDes

    let product = {
        'name':name,
        'price':price,
        'imageURL':imageURL,
        'description':description
        }
        let server = await MongoClient.connect(url)        
        let dbo = server.db("demo")
        await dbo.collection("ATNProduct").insertOne(product) 

        res.redirect('/new')    
})

app.get('/view',async(req,res)=>{
    let server = await MongoClient.connect(url)
    let dbo = server.db("demo")
    let prods = await dbo.collection("ATNProduct").find().toArray()
    res.render('viewProduct',{'prods':prods})        
})

app.get('/delete',async(req,res)=>{
    let id = req.query.id

    let objectId = ObjectId(id)
    let server = await MongoClient.connect(url);
    let dbo = server.db("demo")
    //for substring search, case insensitive
    await dbo.collection("ATNProduct").deleteOne({_id:objectId})
    res.redirect('/view')
})

app.post('/search', async (req,res)=>{
    let name = req.body.txtSearch
    let server= await MongoClient.connect(url);
    let dbo = server.db("demo");

    let prods = await dbo.collection("ATNProduct").find({'name':new RegExp(name, 'i')}).toArray()
    res.render('viewProduct',{'prods': prods})
})



app.get('/',(req,res) =>{
    res.render('home')
})

app.get('/new',(req,res)=>{
    res.render('addProduct')
})

const port = process.env.port || 3000
app.listen(port)

console.log("Server is running")