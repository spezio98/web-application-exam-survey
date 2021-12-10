'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('surveydb.db', (err) => {
  if(err) throw err;
});

// get all tasks. It's for normal user and not for admin
exports.listSurveys = () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM SURVEYS';
      db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        const surveys = rows.map((e) => ({ id: e.ID, title: e.title}));
        console.log(surveys);
        resolve(surveys);
      });
    });
  };
/*
exports.listAdminSurvs = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM SURVEYS WHERE adminID = ?';
  
      db.all(sql, [id], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
      const surveys = rows.map((e) => ({ id: e.ID, title: e.title}));
      
      resolve(surveys);
      });
    });
  }

exports.getNCompiled = (id) => {
  return new Promise((resolve, reject) => {
    const sqlnCompiled = 'SELECT ID, COUNT(ID) AS nCompiled FROM (SELECT * FROM SURVEYS, USERANSWERS WHERE SURVEYS.ID = USERANSWERS.surveyID AND SURVEYS.adminID = ? group by SURVEYS.id, user) GROUP BY ID'
    
    db.all(sqlnCompiled, [id], (err,rows) =>{
      if(err) {
        reject(err);
        return;
      }
    
      const compl = rows.map((e) => ({ id: e.ID, nCompiled: e.nCompiled}));
      resolve(compl);
    })
  });
}*/

  // get all tasks. It's for admin
exports.listAdminSurveys = (id) => {
  return new Promise((resolve, reject) => {
    let surveys;
    const sql = 'SELECT * FROM SURVEYS WHERE adminID = ?';
    const sqlnCompiled = 'SELECT ID, COUNT(ID) AS nCompiled FROM (SELECT * FROM SURVEYS, USERANSWERS WHERE SURVEYS.ID = USERANSWERS.surveyID AND SURVEYS.adminID = ? group by SURVEYS.id, user) GROUP BY ID'
    
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
    surveys = rows.map((e) => ({ id: e.ID, title: e.title}));
    
    });
    
    db.all(sqlnCompiled, [id], (err,rows) =>{
      if(err) {
        reject(err);
        return;
      }
    
      const compl = rows.map((e) => ({ id: e.ID, nCompiled: e.nCompiled}));
      const finalSurveys = surveys.map((e) => {
        for(let c of compl)
        {
          if(c.id===e.id)
            return {id:e.id, title:e.title, nCompiled: c.nCompiled};
        }
        return {id:e.id, title:e.title, nCompiled: 0};
      })

      console.log(finalSurveys);
      resolve(finalSurveys);
    })
  });
};


  

//get specific survey with all questions. It's for normal user and not for admin
exports.survey = (id) => {
    return new Promise((resolve, reject) => {
        //const sql = 'SELECT QUESTIONS.ID AS questionID, title, text, type, min, max FROM SURVEYS, QUESTIONS WHERE QUESTIONS.surveyID = SURVEYS.ID AND SURVEYS.ID = ?';
        const sql = 'SELECT questionSortID, QUESTIONS.text as questionText, type, QUESTIONS.ID as questionID,  min, max, optionSortID, OPTIONS.ID as optionID, OPTIONS.text as optionText  FROM SURVEYS, QUESTIONS LEFT JOIN OPTIONS ON QUESTIONS.ID = OPTIONS.questionID WHERE QUESTIONS.surveyID = SURVEYS.ID AND SURVEYS.ID = ?';
        db.all(sql, [id], (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          if (rows == undefined) {
            resolve({error: 'Survey not found.'});
          } else {
          const questions = rows.map((e) => ({ questionSortID: e.questionSortID, questionText: e.questionText, type: e.type, questionID: e.questionID, min: e.min, max: e.max, optionSortID: e.optionSortID, optionID: e.optionID, optionText: e.optionText}));
          console.log(questions);
          resolve(questions);
          }
        });
      });
}

exports.surveyAnswers = ( surveyID) =>{
  return new Promise((resolve, reject) => {
    const sql = 'SELECT T.surveyID, T.questionID as questionID, questionSortID, questionText, type, min, max, T.optionID AS optionID, optionSortID, optionText, USERANSWERS.ID AS answerID, user, answerText FROM (SELECT surveyID, QUESTIONS.ID AS questionID, questionSortID, QUESTIONS.text AS questionText, type, min, max, OPTIONS.ID AS optionID, optionSortID, OPTIONS.text AS optionText FROM QUESTIONS LEFT JOIN OPTIONS ON QUESTIONS.ID = OPTIONS.questionID WHERE surveyID = ?) AS T LEFT JOIN USERANSWERS ON (T.questionID = USERANSWERS.questionID) AND (T.optionID = USERANSWERS.optionID OR USERANSWERS.optionID IS NULL) '
    db.all(sql, [surveyID], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({error: 'Survey not found.'});
      } else {
        const table = rows.map((e) => ({surveyID:e.surveyID, questionID:e.questionID, questionSortID:e.questionSortID, questionText:e.questionText, type:e.type, min:e.min, max:e.max,
        optionID:e.optionID, optionSortID:e.optionSortID, optionText:e.optionText, answerID:e.answerID, user:e.user, answerText:e.answerText}));
        
        let users = [];
        let questions = [];//{questionSortID, questionText, type, min, max, optionSortID, optionText}
        let answers = []; //{user, questionSortID, answerText} for open and {user, questionSortID, options:[{optionSortID, value}]}
        for(let r of table)
        {
          //get users
          if(r.user != null && !users.includes(r.user))
            users.push(r.user);

          //get empty questions
          if(r.questionText != null && !questions.find(x=>x.questionText === r.questionText))
            if(r.type==="open")
              questions.push({questionSortID: r.questionSortID, questionText:r.questionText, type:r.type, min:r.min, max:r.max});
            else
              questions.push({questionSortID: r.questionSortID, questionText:r.questionText, type:r.type, min:r.min, max:r.max, options:Array.of({optionSortID: r.optionSortID, optionText: r.optionText})});
          else
            if(r.type==="close"){
              let q = questions.find(x=> x.questionText === r.questionText);
              if(!q.options.find(a => a.optionSortID === r.optionSortID))
                q.options.push({optionSortID: r.optionSortID, optionText: r.optionText});
          
            }
          
          
        }
        //get answers associated to questionSortID
        for(let u of users)
          for(let q of questions)
            {
              if(q.type==="open")
                {
                  let a = table.find(x=> x.user === u && x.questionSortID === q.questionSortID)
                  if(a)
                    answers.push({user: u, questionSortID: q.questionSortID, answerText: a.answerText})
                  else
                    answers.push({user: u, questionSortID: q.questionSortID, answerText: ""})

                }
                else{
                  if(!answers.find(x=>x.user === u && x.questionSortID===q.questionSortID))
                    answers.push({user:u, questionSortID:q.questionSortID, options:[]});
                  for(let o of q.options){
                    let a = table.find(x=> x.user === u && x.questionSortID === q.questionSortID && o.optionSortID === x.optionSortID)
                    if(a)
                      answers.find(x=>x.user === u && x.questionSortID===q.questionSortID).options.push({optionSortID:o.optionSortID, value:true});
                    else
                      answers.find(x=>x.user === u && x.questionSortID===q.questionSortID).options.push({optionSortID:o.optionSortID, value:false});
                  }
                }
                
            }
        const convertedAnswers = [];


        console.log(answers);
        //resolve(answers);
        resolve([users,questions,answers]);
      //const questions = rows.map((e) => ({ questionSortID: e.questionSortID, questionText: e.questionText, type: e.type, questionID: e.questionID, min: e.min, max: e.max, optionSortID: e.optionSortID, optionID: e.optionID, optionText: e.optionText}));
      //console.log(questions);
      //resolve(questions);
      }
    });
  });
}

exports.addAnswer = (surveyID, answer) => {
    return new Promise((resolve, reject) => {
      let id;//???? controlla
      const sql = 'INSERT INTO USERANSWERS(surveyID,questionID,optionID,user,answerText) VALUES(?, ?, ?, ?, ?) ';

      db.run(sql, [surveyID, answer.questionID, answer.optionID, answer.user, answer.answerText], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
}

exports.checkCompilation = (surveyID) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT user FROM USERANSWERS WHERE surveyID = ? GROUP BY user';
    
    db.all(sql, [surveyID], function (err,rows) {
      if (err) {
        reject(err);
        return;
      }
      let list = [];
      for(let r of rows)
        list.push(r.user);
      resolve(list);
    });

  });
}

exports.createSurvey = (title, adminID) => {
  
  return new Promise((resolve, reject) => {
   // let getAdminID;
    let newSurveyID;
    //const sqlSurveyID = 'SELECT MAX(ID) AS ID FROM SURVEYS';
    const sql = 'INSERT INTO SURVEYS(title,adminID) VALUES( ?, ?) ';
    const sql2 = 'INSERT INTO QUESTIONS(surveyID, questionSortID, text, type, min, max) VALUES(?, ?, ?, ?, ?, ?)';

    
    db.run(sql, [title, adminID], function (err) {
      if (err) {
        reject(err);
        return;
      }
      //getAdminID = this.lastID;
      /*
      for(let q of survey){
        db.run(sql2, [this.lastID,], function(err) {
          if (err) {
            reject(err);
            return;
          }
        });
      }*/
      resolve(this.lastID);
    });
    
  });
}

exports.createQuestion = (newSurveyID, questionSortID, questionText, type, min, max) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO QUESTIONS(surveyID, questionSortID, text, type, min, max) VALUES(?, ?, ?, ?, ?, ?)';

    db.run(sql, [newSurveyID, questionSortID, questionText, type, min, max], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
}

exports.createOption = (newQuestionID, optionSortID, optionText) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO OPTIONS(questionID, optionSortID, text) VALUES(?, ?, ?)';

    db.run(sql, [newQuestionID, optionSortID, optionText], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
}

/*SELECT surveyID, T.questionID as questionID, questionSortID, questionText, type, min, max, T.optionID AS optionID, optionSortID, optionText, USERANSWERS.ID AS answerID, user, answerText FROM 
(SELECT surveyID, QUESTIONS.ID AS questionID, questionSortID, QUESTIONS.text AS questionText, type, min, max, OPTIONS.ID AS optionID, optionSortID, OPTIONS.text AS optionText FROM QUESTIONS LEFT JOIN OPTIONS ON QUESTIONS.ID = OPTIONS.questionID WHERE surveyID = 1) 
AS T,USERANSWERS WHERE (T.questionID = USERANSWERS.questionID) AND (T.optionID = USERANSWERS.optionID OR USERANSWERS.optionID IS NULL) */

/* completo?
SELECT surveyID, T.questionID as questionID, questionSortID, questionText, type, min, max, T.optionID AS optionID, optionSortID, optionText, USERANSWERS.ID AS answerID, user, answerText FROM 
(SELECT surveyID, QUESTIONS.ID AS questionID, questionSortID, QUESTIONS.text AS questionText, type, min, max, OPTIONS.ID AS optionID, optionSortID, OPTIONS.text AS optionText FROM QUESTIONS LEFT JOIN OPTIONS ON QUESTIONS.ID = OPTIONS.questionID WHERE surveyID = 1) 
AS T LEFT JOIN USERANSWERS ON (T.questionID = USERANSWERS.questionID) AND (T.optionID = USERANSWERS.optionID OR USERANSWERS.optionID IS NULL) 
*/

/*FINITA
SELECT T.surveyID, T.questionID as questionID, questionSortID, questionText, type, min, max, T.optionID AS optionID, optionSortID, optionText, USERANSWERS.ID AS answerID, user, answerText FROM 
(SELECT surveyID, QUESTIONS.ID AS questionID, questionSortID, QUESTIONS.text AS questionText, type, min, max, OPTIONS.ID AS optionID, optionSortID, OPTIONS.text AS optionText FROM QUESTIONS LEFT JOIN OPTIONS ON QUESTIONS.ID = OPTIONS.questionID WHERE surveyID = 1) 
AS T LEFT JOIN USERANSWERS ON (T.questionID = USERANSWERS.questionID) AND (T.optionID = USERANSWERS.optionID OR USERANSWERS.optionID IS NULL) WHERE user = "Andrea" OR user IS NULL
*/

/*query per trovare il numero di risposte per ogni sondaggio di un dato admin
SELECT ID, COUNT(ID) AS nCompiled FROM (SELECT * FROM SURVEYS, USERANSWERS WHERE SURVEYS.ID = USERANSWERS.surveyID AND SURVEYS.adminID = 1 group by SURVEYS.id, user)
GROUP BY ID
*/