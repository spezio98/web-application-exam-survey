import {Button} from 'react-bootstrap';
import { useState } from 'react';
import validator from 'validator';
import {MyModal} from './MyModal';
import { questionObj} from './Obj';
import API from '../API';
import {deleteIcon, arrowDown, arrowUp} from './icons.js';

function DeleteButton(props){
  return (
    <Button type="button" variant="danger" size="sm" onClick={()=> props.deleteQuestion(props.questionSortID)}>
      {deleteIcon}
    </Button>
    );
}

function UpButton(props){
  return (
    <Button type="button" variant="warning" size="sm" onClick={()=> props.moveQuestion(props.questionSortID, "up")} >
      {arrowUp}
    </Button>
    );
}

function DownButton(props){
  return (
    <Button type="button" variant="warning" size="sm" onClick={()=> props.moveQuestion(props.questionSortID, "down")}>
      {arrowDown}
    </Button>
    );
}


function AddButton(props){
    
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClose = () => {setShow(false); setErrorMessage('');}
  const handleShow = () => setShow(true);

  const [localSurveyName, setLocalSurveyName] = useState('');

  let valid = true;

  function validate(){
    if(validator.isEmpty(localSurveyName)){
      setErrorMessage('Empty title');
      return false;
    }
    if(validator.isNumeric(localSurveyName)){
      setErrorMessage('Title should not be numeric');
      return false;
    }
    return true;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    valid = validate();
    
    if(valid){
      props.setSurveyName(localSurveyName);
      setErrorMessage('')
    }
   
  }

  const handleSubClose = (event) =>{
    handleSubmit(event);
    if(valid){
      handleClose();
    }
  }

  return (
    <>
    <Button type="button" className="btn btn-lg fixed-right-bottom" onClick={handleShow}>&#43;</Button>
    
    <MyModal show={show} type="name" //use this to distinguish
    task={null} errorMessage={errorMessage} setLocalSurveyName={setLocalSurveyName}
    handleClose={handleClose} handleSubClose={handleSubClose}/>
    </>
  );
}

function AddQuestionButton(props){
    
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClose = () => {setShow(false); setErrorMessage('');  setMin('0'); setMax('1'); setQuestionText('');  setOptions([]);}
  const handleShow = () => setShow(true);

  
  const [questionText, setQuestionText] = useState('');
  //type già deciso
  const [min, setMin] = useState('0');
  const [max, setMax] = useState('1');
  const [options, setOptions] = useState([]);

  const [radioValue, setRadioValue] = useState('1');

  let valid = true;

  function validate(){
    if(validator.isEmpty(questionText)){
      setErrorMessage('Question text required'); 
      return false;
    }
    
      if(validator.isEmpty(min)){
        setErrorMessage('Min required'); 
        return false;
      } 
      if(!validator.isNumeric(min,{no_symbols: true}))
      {
        setErrorMessage('Min wrong format'); 
        return false;
      }
    

    if(validator.isEmpty(max)){
      setErrorMessage('Max required'); 
      return false;
    } 
    if(!validator.isNumeric(max,{no_symbols: true}))
    {
      setErrorMessage('Max wrong format'); 
      return false;
    }

    if(max< min){
      setErrorMessage('Min cannot be greater than max!'); 
      return false;
    }

    if(radioValue === '2'){
      if(options.length === 0)
      {
        setErrorMessage('At least one option is required'); 
        return false;
      }
      if(options.length < max)
      {
        setErrorMessage('Number of options cannot be less than Max'); 
        return false;
      }
     
    }
    
  return true;
  }
  
  const handleSubmit = (event) => {
    event.preventDefault();

    valid = validate();

    let newQuestion = null;

    if(valid){
    
      if(options.length === 0)
        newQuestion = new questionObj(props.questionSortID, questionText,"open", parseInt(min),  parseInt(max), null);
      else{
        newQuestion = new questionObj(props.questionSortID, questionText,"close", parseInt(min),  parseInt(max), options);
      }
      
      console.log(newQuestion);
   
      props.setNewSurvey(old => [...old, newQuestion]);
      setErrorMessage('')
    }
  }

  const handleSubClose = (event) =>{
    handleSubmit(event);
    if(valid){
      handleClose();
      props.setQuestionSortID(val => val+1);
      setRadioValue('1');
    }
    
  }

  return (
    <>
    <div style={{paddingLeft:"2rem"}}>
    <Button type="button" className="btn" size="sm" onClick={handleShow} >Add</Button>
    </div>
    <MyModal show={show}
    errorMessage={errorMessage} setErrorMessage={setErrorMessage} radioValue={radioValue} setRadioValue={setRadioValue}
    setQuestionSortID={props.setQuestionSortID} setQuestionText={setQuestionText}
    setMin={setMin} setMax={setMax} setOptions={setOptions} options={options}
    handleClose={handleClose} handleSubClose={handleSubClose}/>
    </>
  );
}


function SaveQuestionButton(props){

  function submit(){
    if( props.surveyName && props.newSurvey.length != 0){
      let result = API.fetchAddSurvey(props.surveyName, props.newSurvey, props.currIDUser);
      props.setSurveyName('');
      props.setNewSurvey([]);
      props.setQuestionSortID(1);
      
      if(result)
        props.setMessage({msg:`Survey added successfully`, type: 'success'});
      else
        props.setMessage({msg:`Error: Survey not added`, type: 'danger'});
      props.setTrigger(true);
    }

  }
  return(
    <Button type="button" className="btn" size="sm" onClick={submit} style={{float: 'right'}}>Save</Button>
  );
}

function CancelQuestionButton(props){

  function cancel(){
    console.log("delete");
    props.setSurveyName('');
    props.setNewSurvey([]);
    props.setMessage({msg:`Operation cancelled`, type: 'danger'});
    props.setQuestionSortID(1);
  }
  return(
    <Button align="right" type="button" variant="danger" className="btn" size="sm" onClick={cancel}>Cancel</Button>
  );
}


export {AddButton, AddQuestionButton, SaveQuestionButton, CancelQuestionButton, DeleteButton, UpButton, DownButton};