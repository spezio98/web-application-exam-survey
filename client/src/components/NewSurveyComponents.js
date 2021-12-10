import Form from 'react-bootstrap/Form';
import {Row, Col} from 'react-bootstrap';
import {DeleteButton, UpButton, DownButton} from './Button.js';

function OpenQuestionNew(props){
    return(<>
    <Form.Group as={Row} controlId={"open"+props.id}>
                    
                    <Form.Label column sm="12"> 
                    {props.question.min ? props.question.questionText+"*" : props.question.questionText}
                    
                    </Form.Label>
                    
                    <Col sm="9" style={{paddingRight:'0px'}}>
                    <Form.Control placeholder="" disabled defaultValue="" />
                    </Col>
                    <Col className="sm-buttons" sm="1" >
                        {props.id>1 ? 
                        <UpButton moveQuestion={props.moveQuestion} questionSortID={props.id}/>
                        : <></>}
                    </Col>
                    <Col className="sm-buttons" sm="1"> 
                        {props.id< props.nQuestions ? 
                        <DownButton moveQuestion={props.moveQuestion} questionSortID={props.id}/>
                        : <></>}
                    </Col>
                    <Col className="sm-buttons" sm="1">
                        <DeleteButton deleteQuestion={props.deleteQuestion} questionSortID={props.id}/>
                    </Col>
                    
                    
                    
        </Form.Group></>);
}

function CloseQuestionNew(props){
    return(
        <Form.Group as={Row} controlId={"close"+props.id}>
        <Form.Label column sm="9">
        {props.question.questionText+"* (min " + props.question.min + " risposte, max " + props.question.max + " risposte)"}
        
        </Form.Label>
        <Col className="sm-buttons" sm="1" >
            {props.id>1 ? 
            <UpButton moveQuestion={props.moveQuestion} questionSortID={props.id}/>
            : <></>}
        </Col>
        <Col className="sm-buttons" sm="1"> 
            {props.id< props.nQuestions ? 
            <DownButton moveQuestion={props.moveQuestion} questionSortID={props.id}/>
            : <></>}
        </Col>
        <Col className="sm-buttons" sm="1">
            <DeleteButton deleteQuestion={props.deleteQuestion} questionSortID={props.id}/>
        </Col>
        {props.question.options.map(ch=>
            <Col className="checkborder" sm="12" >
                <Form.Check custom type="checkbox" id={"check-"+ch.optionSortID} label={ch.optionText} 
                disabled style={ {marginLeft:'30px', marginTop:'30px'}}/>
            </Col>
    ) }  
    </Form.Group> 
    );
}

function RadioQuestionNew(props){
    return(
        <Form.Group as={Row} controlId={"radio"+props.id}>
        <Form.Label column sm="9">
        {props.question.min===1 ? props.question.questionText+"*" : props.question.questionText}
        </Form.Label>
        <Col className="sm-buttons" sm="1" >
            {props.id>1 ? 
            <UpButton moveQuestion={props.moveQuestion} questionSortID={props.id}/>
            : <></>}
        </Col>
        <Col className="sm-buttons" sm="1"> 
            {props.id< props.nQuestions ? 
            <DownButton moveQuestion={props.moveQuestion} questionSortID={props.id}/>
            : <></>}
        </Col>
        <Col className="sm-buttons" sm="1">
            <DeleteButton deleteQuestion={props.deleteQuestion} questionSortID={props.id}/>
        </Col>
        <Col className="radioborder" sm="12" >
        {props.question.options.map(ch=>
            <Col className="checkborder" sm="12" >
                <Form.Check custom type="radio" id={"radio-"+ch.optionSortID} label={ch.optionText} 
                disabled style={ {marginLeft:'30px', marginTop:'30px'}}/>
            </Col>
        ) }  
        </Col>
    </Form.Group>
    );

}

export {OpenQuestionNew, CloseQuestionNew,RadioQuestionNew};