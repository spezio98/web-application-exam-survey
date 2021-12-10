import ListGroup from 'react-bootstrap/ListGroup';
import {Col, Row,Alert} from 'react-bootstrap';
import {Switch, Route, Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {Survey2} from './Survey.js';
import {LoginForm} from './Login.js';

function Element(props){
    return(
        <Link style={{ textDecoration: 'none', border: '0px', }} to={"/surveys/"+props.survey.id}>
            <ListGroup.Item action> 
            {props.survey.title} 
            </ListGroup.Item>
        </Link>
    );
}

function Main(props)
{
    return(
    <Col className="pad-top-4rem">
        {/*{!props.loggedIn && <Redirect to="/" />}*/}
        {props.message && <Row>
         <Alert closeLabel="" variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert>
        </Row> }
        <Switch>
            
            <Route exact path="/" render={()=>
            <Redirect to={"/surveys"} />   
            }/>
            <Route exact path={["/","/surveys"]} render={() =>
            <>  <h3>List of available surveys</h3>
                <ListGroup className="list-height">
                {props.surveys.map((sv) => <Element key={sv.id} id={sv.id} survey={sv} setTrigger={props.setTrigger}/>)}       
                </ListGroup>
            </>
        }/>
            
            <Route exact path="/login" render={() => 
            <>{props.loggedIn ? <Redirect to={"/admin/surveys"} /> : <LoginForm loggedIn={props.loggedIn} login={props.login}/>}</>
            }/>

            <Route exact path="/surveys/:id"  render={({match}) =>
            {
                return(<>
                    <Survey2 id={match.params.id} setMessage={props.setMessage}/>
                    </>);
            }
            }/>

            

            <Route>
                <Redirect to="/"/>
            </Route>
        </Switch>
    </Col>
    );
}

export {Main};