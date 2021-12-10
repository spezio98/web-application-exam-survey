import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import validator from 'validator';
import {Row, Col, Button, Alert} from 'react-bootstrap';
import {OpenQuestion2,CloseQuestion2, RadioQuestion2} from './SurveyComponents';
import { Redirect} from 'react-router-dom';
import API from '../API.js';
import {AddQuestionButton, SaveQuestionButton, CancelQuestionButton} from './Button.js'
import {OpenQuestionNew, CloseQuestionNew,RadioQuestionNew} from './NewSurveyComponents.js';

function Survey2(props){
    const [name,setName] = useState('');
    const [answers, setAnswers] = useState([]);
    const [valid,setValid] = useState(false);
    const [title, setTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [trigger, setTrigger] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [usersCompiled, setUsersCompiled] = useState([]);

    useEffect( () =>{
        const getQuestions = async(id) =>{
          const quests = await API.fetchQuestions(id);
          const surveys = await API.fetchSurveys();
          const uc = await API.fetchListUsers(id);
          setUsersCompiled([...uc]);
          setTitle(surveys.find(x => x.id == id).title);
          let convertedQuestions = [];
          quests.forEach(q => {
            if(q.type==="open") 
                convertedQuestions.push({questionSortID:q.questionSortID, questionID: q.questionID, questionText: q.questionText, type: q.type, min: q.min, max:q.max});
            else{
                if(!convertedQuestions.some(x=> x.questionID === q.questionID))
                {
                    convertedQuestions.push({questionSortID:q.questionSortID, questionID: q.questionID, questionText: q.questionText, type: q.type, min: q.min, max:q.max,
                    options:[{optionSortID: q.optionSortID, optionID:q.optionID, optionText:q.optionText}]});
                }
                else
                {
                    convertedQuestions.find(x => x.questionID === q.questionID).options.push({optionSortID: q.optionSortID, optionID:q.optionID, optionText:q.optionText});
                }
            }
           
        });
        //ULTIMA AGGIUNTA
        convertedQuestions = convertedQuestions.sort((a,b) => {
            if(a.questionSortID < b.questionSortID)
                return -1;
            if(a.questionSortID > b.questionSortID)
                return 1;
            return 0;
        })
          setQuestions([...convertedQuestions]);
        }
        if(trigger){
            getQuestions(props.id).then( () => {
              setTrigger(false);
              console.log(questions);
            });
          
        }
      },[trigger]);


      //validation
      function validate(){
        console.log(answers);
        if(!name || !validator.isLength(name,{min:1, max:200}))
        {
            setErrorMessage('Empty name or too long.'); 
            return false;
        }
        
        if(usersCompiled.find(x=> x.toLowerCase() === name.toLowerCase()))
        {
            setErrorMessage('User ' + name + ' has already compiled this survey'); 
            return false;
        }

        if(answers.length==0){
            setErrorMessage('Empty survey.'); 
            return false;
        }

        for(let q of questions){
            let a = answers.find(x=>x.questionID===q.questionID);

            if(q.type==="open")
                if(q.min){
                    //if(q.max === 1)
                        if(!a || !validator.isLength(a.answerText,{min:1}))
                        {
                            setErrorMessage('Mandatory answers required'); 
                            return false;
                        }
                        if(a.answerText.length > 200){
                            setErrorMessage('Open answer too long.'); 
                            return false;
                        }
                }
            if(q.type === "close")
            {
                
                if(q.min){
                    if(q.max === 1){
                        console.log(a);
                        if(!a || !a.option)
                        {
                        setErrorMessage('Min number of required options not respected'); 
                        return false;
                        }
                    }
                    else{
                        if(!a || a.options.length<q.min)
                        {
                            setErrorMessage('Min number of required options not respected'); 
                            return false;
                        }
                    }
                }
                
                
                if(q.max>1)
                {
                     //calcolo il numero di risposte checked (valore true) mediante un riduttore
                    if(a.options.reduce((accumulator, currentValue) => {
                        if(currentValue.value)
                            accumulator++;
                        return accumulator;
                    }, 0) > q.max)
                    {
                        setErrorMessage('Max number of required options not respected'); 
                        return false;
                    }
                }

            }
        }
        setErrorMessage(''); 
        return true;
    }

      //submit
      function submit(){
        let res = validate();
        let convAnswers = [];
        //conversione in formato per server
        if(res){
            for(let ans of answers){
                if(ans.type==="open")
                {
                    convAnswers.push({questionID: ans.questionID, optionID: null, user: name, answerText: ans.answerText})
                }
                if(ans.type==="close"){
                    let q = questions.find(x=> x.questionID === ans.questionID);
                    if(q.max > 1) //close
                        for(let c of ans.options)
                        {
                            if(c.value)
                                convAnswers.push({questionID: ans.questionID, optionID: c.optionID, user: name, answerText: null})
                        }
                    else //radio
                    {
                        if(ans.option.value)
                            convAnswers.push({questionID: ans.questionID, optionID: ans.option.optionID, user: name, answerText: null})
                    }
                }
            }
            
            //manda risposte al server
            API.fetchUserAnswers(props.id,convAnswers);
            props.setMessage({msg:`Answers registered`, type: 'success'});
            setAnswers([]);
            setQuestions([]);
            setValid(res);

        }
      }
      //controlla se i messaggi di errore per la validazione sono visibili o torna sempre indietro. prova a mettere la condizione !errorMessage
      return(<>
      {!valid ? <> 
        <Form className="form">
            {!trigger ? <>
                <h3>{title}</h3>
                {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert>  : ''}
                <Form.Group as={Row} controlId="formName">
                    <Form.Label column sm="6">
                    Inserisci il tuo nome*
                    </Form.Label>
                    <Col sm="6">
                    <Form.Control placeholder="Name" onChange={event => 
                        setName(event.target.value)}/>
                    </Col>
                </Form.Group>
                {console.log(questions)}
                {questions.map((q) =><Question2 key={q.questionID} id={q.questionID} question={q} setAnswers={setAnswers} answers={answers}
                                                    errorMessage={errorMessage} setErrorMessage={setErrorMessage}/>)}   
                <Row>
                    <Col align="right">
                        
                        <Button variant="primary"  onClick={submit}>
                            Invia
                        </Button>
                        
                        
                    </Col>
                </Row>
            </>:<span>🕗 Please wait, loading... 🕗</span>}
            </Form> 
    </>:
    <><Redirect to={"/surveys"}/>
    </>}</>);


}
function Question2(props){

    return(
    <>{props.question.type === "open" ? 
    <OpenQuestion2 key={props.id} id={props.id} question={props.question} setAnswers={props.setAnswers} id={props.id}/> 
    : 
    <>
    {props.question.max > 1 ? 
    <CloseQuestion2 key={props.id} id={props.id} question={props.question} setAnswers={props.setAnswers} id={props.id}/> 
    : <RadioQuestion2 key={props.id} id={props.id} question={props.question} setAnswers={props.setAnswers} id={props.id}/>
    }
</>      

}</>);
}

function NewSurvey(props){

    return (<>
        <Form className="form">
                <h3>{props.surveyName}</h3>
                {props.newSurvey.sort((a,b) => {
                    if(a.questionSortID < b.questionSortID)
                        return -1;
                    if(a.questionSortID > b.questionSortID)
                        return 1;
                    return 0;
                }).map((q) =><>{console.log(q)}
                {q.type === "open" ? 
                <OpenQuestionNew key={q.questionSortID} question={q} id={q.questionSortID} deleteQuestion={props.deleteQuestion} moveQuestion={props.moveQuestion} nQuestions={props.newSurvey.length}/> 
                : 
                <>
                {q.max > 1 ? 
                <CloseQuestionNew key={q.questionSortID} question={q} id={q.questionSortID} deleteQuestion={props.deleteQuestion} moveQuestion={props.moveQuestion} nQuestions={props.newSurvey.length}/> 
                : <RadioQuestionNew key={q.questionSortID} question={q} id={q.questionSortID} deleteQuestion={props.deleteQuestion} moveQuestion={props.moveQuestion} nQuestions={props.newSurvey.length}/>
                }
                </>      

                }</>)}
                
                <Row style={{paddingTop:'2rem'}}>
                    <Col sm="4"> 
                        <CancelQuestionButton setSurveyName={props.setSurveyName} setNewSurvey={props.setNewSurvey} setMessage={props.setMessage} setQuestionSortID={props.setQuestionSortID}/>
                    </Col>
                    <Col sm="4"> 
                        <AddQuestionButton newSurvey={props.newSurvey} setNewSurvey={props.setNewSurvey} setQuestionSortID={props.setQuestionSortID} questionSortID={props.questionSortID}/>
                    </Col>
                    <Col sm="4"> 
                        <SaveQuestionButton newSurvey={props.newSurvey} surveyName={props.surveyName} setSurveyName={props.setSurveyName} setNewSurvey={props.setNewSurvey}
                        setMessage={props.setMessage} currIDUser={props.currIDUser} setTrigger={props.setTrigger} setQuestionSortID={props.setQuestionSortID}/>
                    </Col>
                </Row>

        </Form>
        </>
    );
}


export {Survey2, NewSurvey};