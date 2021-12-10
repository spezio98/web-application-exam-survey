import {questionIcon, userIcon1} from '../icons';
import { Navbar,Nav} from "react-bootstrap";
import { LogoutButton } from './Login';

function MyNavBar(props){
  return (
  <Navbar expand="sm" className="navbar navbar-dark bg-primary fixed-top">
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Brand  href="/" fill="currentcolor">
    {questionIcon}
    {' '} SPZsurveys
  </Navbar.Brand>
  
  
  <Nav className="ml-md-auto">  
    {props.logoutButton ? 
    <LogoutButton logout={props.handleLogout}/> :
    <Nav.Link href="/login" >
      {userIcon1}
    </Nav.Link>}
  </Nav>
</Navbar>);
}

export {MyNavBar};