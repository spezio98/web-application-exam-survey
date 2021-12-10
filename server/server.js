'use strict';
const express = require('express');
const morgan = require('morgan'); // logging middleware
const {check, validationResult} = require('express-validator'); // validation middleware https://github.com/validatorjs/validator.js
const dao = require('./dao'); // module for accessing the DB
const userdao = require('./user_dao');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy; // username+psw

/*** Set up Passport ***/
passport.use(new LocalStrategy(
  function(username,password,done){
    userdao.getAdmin(username,password).then((user)=>{
      if(!user)
        return done(null,false,{message:'Incorrect username and/or password.'});
      return done(null,user);
    });
  }
));

passport.serializeUser((user,done)=>{
  done(null,user.id);
});

passport.deserializeUser((id,done)=>{
  userdao.getAdminById(id).then((user)=>{
    done(null,user);
  })
  .catch((err)=>{
    done(err,null);
  });
});


// init express
const app = new express();
const port = 3001;

//setup middlewares
app.use(morgan('dev'));
app.use(express.json()); //per usare sempre json nei body delle post/put 

const isLoggedIn=(req,res,next)=>{
  if(req.isAuthenticated())
    return next();
  return res.status(400).json({error:'Not authorized'});
}

//enalbe sessions in express
app.use(session({
  secret: 'una frase segreta da non condividere con nessuno e da nessuna parte, usata per firmare il cookie Session ID',
  resave: false,
  saveUninitialized: false,
}));

//init Passport to use sessions
app.use(passport.initialize());
app.use(passport.session());

/*** API ***/

//LOGIN
app.post('/api/sessions',  function(req, res, next) {
  const errors = validationResult(req);   
  console.log(req.body); 
  if ( !errors.isEmpty() || req.body.password.length <= 6) {
    return res.status(401).json({message: "Username/password not valid! Try again!"});
  }
  
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);
    
    // req.user contains the authenticated user, we send all the user info back
    // this is coming from userDao.getUser()
    return res.json(req.user);

    });
  })(req, res, next);
});

//LOGOUT
app.delete('/api/sessions/current',isLoggedIn, (req, res) => {
  req.logout();
  res.end();
});

//Get current session to check if user logged out
app.get('/api/sessions/current', isLoggedIn,(req,res)=>{
  if(req.isAuthenticated())
    res.json(req.user);
  else
    res.status(401).json({error:'Not authenticated'});
})

//USER

// GET surveys for normal users /api/surveys
app.get('/api/surveys',(req, res) => {
    dao.listSurveys()
    .then(survey => res.json(survey)) //res.json fill the response body with a json obtained by survey
    .catch(()=> res.status(500).end());
});


// GET specific survey with questions for normal users /api/surveys/<id>
app.get('/api/surveys/:id',(req, res) => {
  dao.survey(req.params.id)
  .then(questions => res.json(questions))
  .catch(()=> res.status(500).end());
});

//POST answers to specific survey  /api/surveys/<id>
app.post('/api/surveys/:id',  async (req, res) => {
 
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(422).json({errors: errors.array()});

  try{
    for(let a of req.body)
      await dao.addAnswer(req.params.id,a);
    res.status(201).end();
    
  }catch(err){
    res.status(503).json({error:`Generic error`});
  }
});

// GET list users that compiled a certain survey /api/surveys/<id>/users
app.get('/api/surveys/:id/users',(req, res) => {
  dao.checkCompilation(req.params.id)
  .then(survey => res.json(survey)) //res.json fill the response body with a json obtained by survey
  .catch(()=> res.status(500).end());
});

//ADMIN


// GET surveys for admin /api/admin/<id>/surveys
app.get('/api/admin/:id/surveys', isLoggedIn,(req, res) => {
  dao.listAdminSurveys(req.params.id)
  .then(survey => res.json(survey)) //res.json fill the response body with a json obtained by survey
  .catch(()=> res.status(500).end());
});
/*
// GET surveys for admin /api/admin/<id>/surveys
app.get('/api/admin/:id/surveys',async (req, res) => {//REMEBER TO USE isLoggedIn and validation
  const errors = validationResult(req);
  let listSurveys;
  let listNCompiled;
  if (!errors.isEmpty()) 
    return res.status(422).json({errors: errors.array()});

    try{
      listSurveys = await dao.listAdminSurvs(req.params.id);
      listNCompiled = await dao.listNCompiled(req.params.id);

      const finalSurveys = listSurveys.map((e) => {
        for(let c of listNCompiled)
        {
          if(c.id===e.id)
            return {id:e.id, title:e.title, nCompiled: c.nCompiled};
        }
        return {id:e.id, title:e.title, nCompiled: 0};
      });
      console.log(finalSurveys);
      res.json(finalSurveys);
      
    }catch(err){
      res.status(500).json({error:`Generic error`});
    }

}); //REMEBER TO USE isLoggedIn

*/

//GET specific survey with questions and answers for admin
app.get('/api/admin/surveys/:surveyID', isLoggedIn, (req,res) =>{
  dao.surveyAnswers(req.params.surveyID)
  .then(answeredQuestions => res.json(answeredQuestions))
  .catch(() => res.status(500).end());
})



//POST new survey /api/admin/survey
app.post('/api/admin/survey',[
  check('title').notEmpty(),
  check('adminID').notEmpty(),
  check('adminID').isInt(),
  check('survey').notEmpty(),
  check('survey').isArray({min:1})

],
isLoggedIn, async (req, res) => { //REMEBER TO USE isLoggedIn and validation
  const errors = validationResult(req);
  let newSurveyID;
  let newQuestionID;
  if (!errors.isEmpty()) 
    return res.status(422).json({errors: errors.array()});

    try{
      
      newSurveyID = await dao.createSurvey(req.body.title, req.body.adminID);
      for(let q of req.body.survey){
        newQuestionID = await dao.createQuestion(newSurveyID, q.questionSortID, q.questionText, q.type, q.min, q.max);
        if(q.type==="close")
          for(let o of q.options)
            await dao.createOption(newQuestionID, o.optionSortID, o.optionText);
      }
      /*
      await dao.createSurvey(req.body.title, req.body.adminID).then((sID) => {
        for(let q of req.body.survey){
            dao.createQuestion(sID, q.questionSortID, q.questionText, q.type, q.min, q.max).then((qID) =>{
              if(q.type==="close")
                for(let o of q.options)
                  dao.createOption(qID, o.optionSortID, o.optionText);
            });
          }
      });*/
      res.status(201).end();
    }catch(err){
      res.status(503).json({error:`Generic error`});
    }

}); //REMEBER TO USE isLoggedIn

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});