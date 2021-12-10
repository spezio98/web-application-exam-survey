import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Container} from 'react-bootstrap';
import {MyNavBar} from './components/MyNavBar.js';
import {BrowserRouter as Router} from 'react-router-dom';
import {Main} from './components/main.js';
import {MainAdmin} from './components/MainAdmin.js';
import {useState, useEffect} from 'react';
import API from './API.js';

function App() {
  const [loggedIn,setLoggedIn]=useState(false);
  const [message, setMessage] = useState('');
  const [currUser,setcurrUser] = useState();
  const [currIDUser, setCurrIDUser] = useState();
  const [surveys, setSurveys] = useState([]);
  const [trigger, setTrigger] = useState(true);
  const [id, setId] = useState(0); 

  useEffect(()=>{
    const checkAuth = async () => {
      try {
        const uInfo = await API.getUserInfo();
        setLoggedIn(true);
        setCurrIDUser(uInfo.id);
        setcurrUser(uInfo.name);
        
      } catch(err) {
        console.error(err.error);
      }
    };
    checkAuth().then(() => {setTrigger(true);});
    //setTrigger(true);
  },[]);

  useEffect( () =>{
    const getSurveys = async() =>{
      if(!loggedIn){
        const survs = await API.fetchSurveys();
        setSurveys([...survs]);
      }
      if(loggedIn && currIDUser!= undefined){
        
        const survs = await API.fetchAdminSurveys(currIDUser);
        setSurveys([...survs]);
      }
    }
    if(trigger){
        getSurveys().then( () => {
          setTrigger(false);
        });
      
    }
  },[trigger, currIDUser]);

  const doLogin = async (credentials) => {
    try{
      const user = await API.login(credentials);
      setLoggedIn(true);
      setcurrUser(user.name);
      setCurrIDUser(user.id);  
      setMessage({msg:`Welcome, ${user.name}!`, type: 'success'});
      setTrigger(true);
    }catch(err) {
      setMessage({msg: " Incorrect username and/or password", type: 'danger'});
    }
  }

  const doLogout = async () => {
    await API.logOut().then(setMessage({msg: 'Successfully logged out', type: 'success'}));
    setLoggedIn(false);
    setMessage("");
    setTrigger(true);
    //setSurveys([]); necessario?
  }

  return (<Router>
    <Container fluid="true">
      <MyNavBar handleLogout={doLogout} logoutButton={loggedIn}/>
      
      {!loggedIn ?
      <Main setTrigger={setTrigger} id={id} surveys={surveys} setSurveys={setSurveys} loggedIn={loggedIn} currUser={currUser} 
        message={message} setMessage={setMessage} login={doLogin} loggedIn={loggedIn} currUser={currUser}/>
      : 
      <MainAdmin setTrigger={setTrigger} surveys={surveys} setSurveys={setSurveys} loggedIn={loggedIn} currUser={currUser} currIDUser={currIDUser}
      message={message} setMessage={setMessage} login={doLogin}
      />
      }
    </Container>
  </Router>
  );
}

export default App;
