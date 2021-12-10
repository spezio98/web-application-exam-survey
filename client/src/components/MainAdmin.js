import ListGroup from 'react-bootstrap/ListGroup';
import {Col, Row,Alert} from 'react-bootstrap';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {CompiledSurvey} from './CompiledSurvey.js';
import { NewSurvey } from './Survey.js';
import {LoginForm} from './Login.js';
import { useState } from 'react';
import {AddButton} from './Button.js';

function ElementAdmin(props){
    return(
        <Link style={{ textDecoration: 'none', border: '0px', }} to={"/admin/surveys/"+props.survey.id}>
            <ListGroup.Item action> 
            <Row>
            <Col sm="6">
                {props.survey.title} 
            </Col>
            <Col className="numCompiled" sm="6">
                {props.survey.nCompiled}
            </Col>
            </Row>
            </ListGroup.Item>
        </Link>
        
    );
}


function MainAdmin(props)
{
    const [newSurvey, setNewSurvey] = useState([]); //sarà un vettore di questions
    const [surveyName, setSurveyName] = useState('');
    const [message, setMessage] = useState('');
    const [questionSortID, setQuestionSortID] = useState(1);

    function deleteQuestion(id){
        let i= 1;

        setNewSurvey((old) =>{
            return old.filter(x=> x.questionSortID !== id)
            .map( x => {
                x.questionSortID = i;
                i++
                return x; 
            });
        });
        setQuestionSortID(old => old-1);
    }

    function moveQuestion(id,type){
            let result = newSurvey.map( x => {
                if(type === "up"){
                    if(x.questionSortID === id-1)
                        x.questionSortID = -1;
                    
                    if(x.questionSortID === id)
                        x.questionSortID = id-1;
                }
                else{
                    if(x.questionSortID === id)
                        x.questionSortID = -1;

                    if(x.questionSortID === id+1)
                        x.questionSortID = id; 
                }
                return x;
            }).map( y => {
                if(y.questionSortID === -1) {
                    if(type==="up")
                        y.questionSortID = id;
                    else
                        y.questionSortID = id+1;
                }
                return y;
            }).sort((a,b) => {
                if(a.questionSortID < b.questionSortID)
                    return -1;
                if(a.questionSortID > b.questionSortID)
                    return 1;
                return 0;
            })

            setNewSurvey([...result]);   
            
    }

    return(
    <Col className="pad-top-4rem">
        {/*{!props.loggedIn && <Redirect to="/" />}*/}
        {props.message && <Row>
         <Alert closeLabel="" variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert>
        </Row> }
        <Switch>
            <Route exact path="/admin/surveys" render={() =>
            <>{!surveyName ? 
                <>  {message && <Row>
                    <Alert closeLabel="" variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
                   </Row> }
                    <h3>{"List of "+props.currUser +" surveys"}</h3>
                    <ListGroup className="list-height">
                    {props.surveys.map((sv) => <ElementAdmin key={sv.id} id={sv.id} survey={sv}
                                                message={props.message} setMessage={props.setMessage}/>)}       
                    </ListGroup>
                    <AddButton setSurveyName={setSurveyName} type="name" setNewSurvey={setNewSurvey}/>
            </> : 
                <>
                    <NewSurvey newSurvey={newSurvey} surveyName={surveyName} setSurveyName={setSurveyName} setNewSurvey={setNewSurvey} setQuestionSortID={setQuestionSortID}
                    setMessage={setMessage} message={message} currIDUser={props.currIDUser} setTrigger={props.setTrigger} deleteQuestion={deleteQuestion} questionSortID={questionSortID}
                    moveQuestion={moveQuestion}/>
                </>}
            </>
            }/>

            <Route exact path="/login" render={() => 
                <>{props.loggedIn ? <Redirect to={"/admin/surveys"} /> : <LoginForm loggedIn={props.loggedIn} login={props.login}/>}</>
            }/>

            <Route exact path="/admin/surveys/:id" render={({match}) => 
                
                <CompiledSurvey survey={props.surveys.find(x=>{
                    
                    return x.id == match.params.id
                })}
                
                />}  currIDUser={props.currIDUser}/>
           

            <Route>
                {props.loggedIn ?<Redirect to="/admin/surveys"/> : <Redirect to="/surveys"/>}
            </Route>         
             
        </Switch>
    </Col>
    );
}


export {MainAdmin};