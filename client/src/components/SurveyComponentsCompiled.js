import Form from 'react-bootstrap/Form';
import {Row, Col} from 'react-bootstrap';

function OpenQuestionCompiled(props){
    return(<>
    <Form.Group as={Row} controlId={"open"+props.id}>
                    <Form.Label column sm="12"> 
                    {props.question.min ? props.question.questionText+"*" : props.question.questionText}
                    
                    </Form.Label>
                    
                    <Col sm="12">
                    {console.log(props.answers)}
                    <Form.Control placeholder="text" disabled defaultValue={props.answers.find(x=>x.questionSortID === props.question.questionSortID).answerText}/>
                    </Col>
                    
        </Form.Group></>);
}

function CloseQuestionCompiled(props){
    return(
        <Form.Group as={Row} controlId={"close"+props.id}>
        <Form.Label column sm="12">
        {props.question.questionText+"* (min " + props.question.min + " risposte, max " + props.question.max + " risposte)"}
        </Form.Label>
        {props.question.options.map(ch=>
            <Col className="checkborder" sm="12" >
                <Form.Check custom type="checkbox" id={"check-"+ch.optionSortID} label={ch.optionText} 
                checked={props.answers.find(x=>x.questionSortID === props.question.questionSortID).options.find(x=>x.optionSortID === ch.optionSortID).value}
                disabled style={ {marginLeft:'30px', marginTop:'30px'}}/>
            </Col>
    ) }  
    </Form.Group> 
    );
}

function RadioQuestionCompiled(props){
    return(
        <Form.Group as={Row} controlId={"radio"+props.id}>
        <Form.Label column sm="12">
        {props.question.min===1 ? props.question.questionText+"*" : props.question.questionText}
        </Form.Label>
        <Col className="radioborder" sm="12" >
        {props.question.options.map(ch=>
            <Col className="checkborder" sm="12" >
                <Form.Check custom type="radio" id={"radio-"+ch.optionSortID} label={ch.optionText} 
                checked={props.answers.find(x=>x.questionSortID === props.question.questionSortID).options.find(x=>x.optionSortID === ch.optionSortID).value}
                disabled style={ {marginLeft:'30px', marginTop:'30px'}}/>
            </Col>
        ) }  
        </Col>
    </Form.Group>
    );

}

export {OpenQuestionCompiled, CloseQuestionCompiled,RadioQuestionCompiled};