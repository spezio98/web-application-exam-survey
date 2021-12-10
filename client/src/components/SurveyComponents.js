import Form from 'react-bootstrap/Form';
import {Row, Col, Button} from 'react-bootstrap';

function OpenQuestion2(props){
    return(
    <Form.Group as={Row} controlId={"open"+props.key}>
                    <Form.Label column sm="12">
                    {props.question.min ? props.question.questionText+"*" : props.question.questionText}
                    </Form.Label>
                    
                    <Col sm="12">
                    <Form.Control placeholder="text" onChange={event => 
                        props.setAnswers((answers) => {
                            let trovato = false;
                            for(const ans of answers)
                                if(ans.questionID === props.question.questionID) //perchè c'era ==?
                                    trovato = true;
                            if(!trovato){
                                return [...answers,{questionID:props.question.questionID, questionSortID:props.question.questionSortID, /*user:props.user,*/ answerText:event.target.value, type:props.question.type}];
                            }
                            else{
                                return answers.map((x) => {
                                    if(x.questionID === props.question.questionID)
                                        x.answerText = event.target.value;
                                    return x;
                                })}
                        })} />
                    </Col>
                    
        </Form.Group>);
}

function CloseQuestion2(props){
    return(
        <Form.Group as={Row} controlId={"close"+props.key}>
        <Form.Label column sm="12">
        {props.question.questionText+"* (min " + props.question.min + " risposte, max " + props.question.max + " risposte)"}
        </Form.Label>
        {props.question.options.map(ch=>
            <Col className="checkborder" sm="12" >
                <Form.Check custom type="checkbox" id={"check-"+props.id+"-"+ch.optionSortID} label={ch.optionText} 
                onChange={ event =>
                    props.setAnswers((answers) => {
                        let trovato = false;

                        for(const ans of answers)
                            if(ans.questionID === props.question.questionID) //perchè c'era ==?
                                trovato = true;
                                   
                        if(!trovato)
                            return [...answers,{questionID:props.question.questionID, questionSortID:props.question.questionSortID, /*user:props.user,*/ type:props.question.type, options:[{optionSortID: ch.optionSortID, optionID:ch.optionID, value:event.target.checked}]}];
                        else{
                            return answers.map((x) => {
                                let aTrovato = false;
                                if(x.questionID === props.question.questionID){
                                    for(let a of x.options)
                                        if(a.optionID === ch.optionID){
                                            a.value= event.target.checked;
                                            aTrovato = true;
                                            break;
                                        }
                                    if(!aTrovato)
                                        x.options.push({optionSortID: ch.optionSortID, optionID:ch.optionID, value:event.target.checked});
                         
                                            
                                        //quelle mai cliccate non saranno inserite. Se invece saranno rimesse a false non verranno considerate in inserimento
                                }
                            
                                return x;
                            })}
                    })
                    } style={ {marginLeft:'30px', marginTop:'30px'}}/>
            </Col>
                ) }  
    </Form.Group> 
    );
}

function RadioQuestion2(props){
    return(
        <Form.Group as={Row} controlId={"radio"+props.key}>
        <Form.Label column sm="12">
        {props.question.min===1 ? props.question.questionText+"*" : props.question.questionText}
        </Form.Label>
        <Col className="radioborder" sm="12" >
        {props.question.options.map(rd=>
            
                <Form.Check custom type="radio" name="radio" id={"radio-"+props.id+"-"+rd.optionSortID} label={rd.optionText} 
                onChange={ event =>
                    props.setAnswers((answers) => {
                        let trovato = false;
                        for(const ans of answers)
                            if(ans.questionID === props.question.questionID) //perchè c'era ==?
                                trovato = true;
                                   
                        if(!trovato){
                            return [...answers,{questionID:props.question.questionID, questionSortID:props.question.questionSortID, type:props.question.type, option:{optionSortID: rd.optionSortID, optionID:rd.optionID, value:event.target.checked}}];
                        }
                        else{
                            return answers.map((x) => {
                                if(x.questionID === props.question.questionID)
                                    x.option = {optionSortID: rd.optionSortID, optionID:rd.optionID, value:event.target.checked};
                                    
                                return x; 
                            })}
                    })
                    } style={ {marginLeft:'30px', marginTop:'30px'}}/>
            
                ) }</Col>
    </Form.Group>
    );

}



export {OpenQuestion2,CloseQuestion2, RadioQuestion2};