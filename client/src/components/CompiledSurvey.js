import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import {Row, Col, Button} from 'react-bootstrap';
import {OpenQuestionCompiled, CloseQuestionCompiled, RadioQuestionCompiled} from './SurveyComponentsCompiled.js';
import API from '../API.js';
import {questionObj, answerObj} from './Obj.js';



function CompiledSurvey (props){
    const [trigger, setTrigger] = useState(true);
    const [users, setUsers] = useState([]);
    const [questions, setQuestions] = useState([]); 
    const [answers, setAnswers] = useState([]);
    const [userIndex, setUserIndex] = useState(0);

    let tempUser = [];
    let tempAnswers = [];
    let tempQuestions = [];

    useEffect(() =>{
        
        const getAnsweredQuestions = async(surveyID, adminID ) =>{//adminID forse non serve
            const ansQ = await API.fetchAnsweredQuestions(surveyID);
            
            for(let a of ansQ[2])
                tempAnswers.push(new answerObj(a.user, a.questionSortID, a.answerText, a.options))
    
            for(let q of ansQ[1])
                tempQuestions.push(new questionObj(q.questionSortID, q.questionText, q.type, q.min, q.max, q.options));
            
            for(let us of ansQ[0])
                tempUser.push(us);
            
            setAnswers([...tempAnswers]);  
            setQuestions([...tempQuestions]);
            setUsers([...tempUser]);
        }
        if(trigger){
            getAnsweredQuestions(props.survey.id, props.currIDUser)/*.then(() =>{
                setAnswers([...tempAnswers]);       
            }).then(() => {
                setQuestions([...tempQuestions]);
            }).then(() =>{
                setUsers([...tempUser]);
            })*/.then( () => {
              setTrigger(false);
            });
          
        }
    

    },[trigger]);

    function increaseUserIndex(){
        if(userIndex < users.length-1){
            setUserIndex(oldIndex => oldIndex+1);
        }
    }
    function decreaseUserIndex(){
        if(userIndex > 0){
            setUserIndex(oldIndex => oldIndex-1);
        }
    }


    return(<>{props.survey.nCompiled ? 

            <>{!trigger ? 
            <Form className="form">
                
                <h3>{props.survey.title}</h3>
                
                <h4>{"Questionario di " + users[userIndex]}</h4>
                {questions.map((q) =><QuestionCompiled key={q.questionSortID} id={q.questionSortID} question={q} answers={answers.filter(x=>x.user===users[userIndex])} 
                userIndex={userIndex} setUserIndex={setUserIndex} users={users}/>)}
                <Row style={{paddingTop:'2rem'}}>
                    <Col align="left"> 
                        <Button variant="primary" onClick={decreaseUserIndex} disabled={userIndex === 0}>
                            Back
                        </Button>
                    </Col>
                    <Col align="right"> 
                        <Button variant="primary" onClick={increaseUserIndex} disabled={userIndex >= users.length-1}>
                            Next
                        </Button>
                    </Col>
                </Row>
            </Form>:
            <span>🕗 Please wait, loading... 🕗</span>} </> : <h3 className="form">No answers on this survey</h3>}
    </>);
}
function QuestionCompiled(props){
    return(<>
        {props.question.type === "open" ? 
        <OpenQuestionCompiled key={props.key} question={props.question} answers={props.answers} id={props.id}/>
         :
         <>
        {props.question.max > 1 ? 
        <CloseQuestionCompiled key={props.key} question={props.question} answers={props.answers} id={props.id}/>
        :<RadioQuestionCompiled key={props.key} question={props.question} answers={props.answers} id={props.id}/>
        }
    </> 
}</>);
}

export {CompiledSurvey};