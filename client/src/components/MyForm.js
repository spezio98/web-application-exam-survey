import Form from 'react-bootstrap/Form';
import {Col, Row, Alert,Container} from 'react-bootstrap';
import { useState} from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import {Button, ButtonGroup} from 'react-bootstrap';
import { optionQuestionObj } from './Obj';
import validator from 'validator';

function MyForm(props){
  const [optionSortID, setOptionSortID] = useState(1);
  const [newOptionText, setNewOptionText] = useState('');

  const radios = [
    { name: 'Open', value: '1' },
    { name: 'Close', value: '2' }
  ];

  let valid = true;

  function validate(){
    if(optionSortID>10)
    {
      props.setErrorMessage('No more then 10 options');
      return false;
    }
    if(validator.isEmpty(newOptionText))
    {
      props.setErrorMessage('Empty option');
      return false;
    }
    return true;
  }

  function handleAddOption() {
    valid = validate();
    if(valid){
      let newOption = new optionQuestionObj(optionSortID, newOptionText);
      setOptionSortID(old => old+1);
      setNewOptionText('');
      props.setOptions(old => [...old, newOption]);
      console.log(newOption);
    }
  }

  return(<>
      <Form>
          {props.errorMessage ? <Alert variant='danger'>{props.errorMessage}</Alert>  : ''}
          <Form.Group as={Row} controlId="formDescription">
            {props.type==="name" ? 
            <>
            <Form.Label column sm="2">
              Insert title*
            </Form.Label>
            <Col sm="10">
              <Form.Control placeholder="Title" onChange={event => 
                props.setLocalSurveyName(event.target.value)}/>
            </Col>
            </>
            :
            <>
            
            <ButtonGroup toggle style={{paddingLeft:"3.3rem"}}>
              {radios.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  type="radio"
                  variant="primary"
                  name="radio"
                  value={radio.value}
                  checked={props.radioValue === radio.value}
                  onChange={(e) => props.setRadioValue(e.currentTarget.value)}
                >
                  {radio.name}
                </ToggleButton>
              ))}
           </ButtonGroup>
           
          {props.radioValue === '2' ? <>
            <Form.Row >
            <Form.Group as={Col} style={{paddingLeft:"4rem"}} md="6">
              <Form.Label>Insert question*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Question"
                name="Question"
                onChange={event => 
                  props.setQuestionText(event.target.value)}
              />
            </Form.Group>
            <Form.Group as={Col} md="3">
              <Form.Label>Insert min*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Min"
                name="Min"
                onChange={event => 
                  props.setMin(event.target.value)}
              />
              
            </Form.Group>
            <Form.Group as={Col} md="3">
              <Form.Label>Insert Max*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Max"
                name="Max"
                onChange={event => 
                  props.setMax(event.target.value)}
              />

              
            </Form.Group>
          </Form.Row>    
              { props.options && props.options.map((o) => <>
              <Container>
              <Form.Row >
                <Form.Group key={o.optionSortID} as={Col} style={{paddingLeft:"3rem"}} md="4">

                    <Form.Control key={o.optionSortID}
                      type="text"
                      placeholder={o.optionText}
                      name="Option"
                      disabled
                    />
              </Form.Group>
              </Form.Row>
              </Container>
              
              </>)}
              <Container>
                    <Form.Row >
                    <Form.Group as={Col} style={{paddingLeft:"3rem"}} md="4">
                          
                          <Form.Control
                            type="text"
                            placeholder="Option"
                            name="Option"
                            onChange={event =>
                              setNewOptionText(event.target.value)}
                          />
                    </Form.Group>
                    
                    <Form.Group style={{paddingLeft:"1rem"}}>
                    <Button id='addOption' variant="success" onClick={handleAddOption}>+</Button>
                    </Form.Group >
                    </Form.Row>
                    </Container>
                    
                   </>
                    :
                    <>
                    <Container>
                      <Row>

                        <Col sm="6">
                        <Form.Group as={Col} style={{paddingLeft:"2.5rem"}}>
                          <Form.Label>Insert question*</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Question"
                            name="Question"
                            onChange={event => 
                              props.setQuestionText(event.target.value)}
                          />
                          
                        </Form.Group>
                        </Col>
                        <Col sm="6">
                        <Form.Group as={Col} style={{paddingTop:"2.5rem"}}>
                        
                          <Form.Check custom type="checkbox" id={"check-mandatory"} label="Mandatory" onChange={(event) => {
                            props.setMax('1');
                            if(event.target.checked){
                              props.setMin('1')
                            }else
                            {
                              props.setMin('0');
                            }
                          }}
                             />
                        </Form.Group>
                        </Col>
                        </Row>
                        </Container>
                    </>}
                   
          </>}
          </Form.Group>
        </Form>
</>
  );
}



export {MyForm};