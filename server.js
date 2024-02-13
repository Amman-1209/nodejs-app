const express = require('express');
const app = express();
const {pool} = require('./dbconfig');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');

const PORT = process.env.PORT || 3000;


app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));

app.use(session({
    secret: 'secret',

    resave: false,

    saveUninitialized: false
}));

app.use(flash());

app.get('/', (req, res)=>{
    res.render('index');
});

app.get('/users/register', (req,res)=>{
    res.render('register');
});

app.get('/users/login', (req,res)=>{
    res.render('login');
});

app.get('/users/dashboard', (req,res)=>{
    res.render('dashboard', { user : 'Aman'});
});

app.post('/users/register', async (req, res)=>{
    let {name , email, password, password2} = req.body;
    console.log({name , email, password, password2});

    let errors =[];
    if(!name||!email||!password||!password2){
        errors.push({message: "Please enter all the fields" });
    }

    if(password.length<6){
        errors.push({message: "Password should at least be 6 characters" });  
    }

    if(password != password2){
        errors.push({message: "Password do not match" });
    }

    if(errors.length>0){
        res.render('register', {errors} );
    } else {
        // form validations done
        let hashedPass = await bcrypt.hash(password , 10);
        console.log(hashedPass);

        pool.query(
            ` SELECT * FROM users WHERE email=$1`,[email], (err, result)=>{
                if(err){
                    throw err;
                }
                console.log(result.rows);

                if(result.rows.length>0){
                    errors.push({message :"Email already exists"});
                    res.render('register', { errors });
                }else{
                    pool.query(
                        `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, password`,[name, email, hashedPass], (err, result)=>{
                            if(err){
                                throw err;
                            }
                            console.log(result.rows);
                            req.flash("success_msg", "You are now registered. Please login");
                            res.redirect("/users/login");
                        }
                    );
                }
            }
        );
    }
});

app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}`);
});