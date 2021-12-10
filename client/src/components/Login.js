import { useState } from "react";
import {Form, Button, Alert,Col} from 'react-bootstrap';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('') ;
  
  const handleSubmit = (event) => {
      event.preventDefault();
      setErrorMessage('');
      const credentials = { username, password };
      console.log(credentials)
      let valid = true;
      if(username === '' || password === '' || password < 6)
          valid = false;
      if(valid)
        props.login(credentials);
      else
        setErrorMessage('Error(s) in the login form, please fix it.');
  };

  return (
    <Form>
      {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
      <Form.Group controlId='username'>
          <Form.Label>Email</Form.Label>
          <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
      </Form.Group>
      <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
      </Form.Group>
      <Form.Group className="custom-button">
        <Button  onClick={handleSubmit}>Login</Button>
      </Form.Group>
     
  </Form>
  )
}
function LogoutButton(props) {
  return(
    <Col>
      <Button variant="danger" onClick={props.logout}>Logout</Button>
    </Col>
  )
}
export { LoginForm, LogoutButton };