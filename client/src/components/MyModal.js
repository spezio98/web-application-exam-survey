import {Button, Modal} from 'react-bootstrap';
import {MyForm} from './MyForm';


function MyModal(props){
    return (
    <Modal show={props.show} onHide={props.handleClose} size="lg" centered>
        <Modal.Header closeButton>
            <Modal.Title>
                {props.type==="name" ? "Create new survey" : "Add question"}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {props.type==="name" ?
            <MyForm setLocalSurveyName={props.setLocalSurveyName}  errorMessage={props.errorMessage} type={props.type}/>
        :
            <MyForm errorMessage={props.errorMessage} setErrorMessage={props.setErrorMessage} type={props.type} setOptions={props.setOptions} options={props.options}
            setQuestionSortID={props.setQuestionSortID} setQuestionText={props.setQuestionText} setMin={props.setMin} setMax={props.setMax}
            radioValue={props.radioValue} setRadioValue={props.setRadioValue}/>

        }
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
            Close
            </Button>
            <Button variant="primary" onClick={props.handleSubClose} >
            OK
            </Button>
        </Modal.Footer>
        </Modal>
    );
}

export {MyModal};