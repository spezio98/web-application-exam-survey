
//LOGIN
const login = async(credentials) =>{
    let response = await fetch('api/sessions',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'},
      body: JSON.stringify(credentials),
    });
    if(response.ok){
      const user=await response.json();
      return user;
    }else{
      const errDetails=await response.text();
      throw errDetails;
    }
  }
  
  async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
  }
  
  async function getUserInfo(){
    const res = await fetch('api/sessions/current');
    const userInfo = await res.json();
    console.log(userInfo);
    if(res.ok)
      return userInfo;
    else
      throw userInfo;
  }

  //USER
  const fetchSurveys = async() =>{
    const response = await fetch('/api/surveys');
    const responseBody = await response.json();
    return responseBody;
}

const fetchQuestions = async(id) =>{
    const response = await fetch('/api/surveys/'+id);
    const responseBody = await response.json();

    console.log(responseBody);
    return responseBody;
}

const fetchUserAnswers = async(id,answers) => {
    const response = await fetch('/api/surveys/'+id,{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(answers),
      });
    console.log(JSON.stringify(answers));
}

const fetchListUsers = async(surveyID) => {
  const response = await fetch('/api/surveys/'+surveyID+'/users');
    const responseBody = await response.json();

    console.log(responseBody);
    return responseBody;
}

  //ADMIN
  const fetchAdminSurveys = async(id) =>{
    const response = await fetch('/api/admin/'+id+'/surveys');
    const responseBody = await response.json();
    return responseBody;
  }

  const fetchAnsweredQuestions = async(surveyID) =>{
    const response = await fetch('/api/admin/surveys/'+surveyID);
    const responseBody = await response.json();
    return responseBody;
  }

  const fetchAddSurvey = async(name,survey, adminID) =>{  
    console.log(JSON.stringify({title:name,survey:survey, adminID:adminID}));
    const response = await fetch('/api/admin/survey',{
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({title:name,survey:survey, adminID:adminID}),
    });
    return response.ok;
  }

const API={fetchSurveys, fetchAdminSurveys, fetchQuestions,fetchAnsweredQuestions,fetchAddSurvey, fetchListUsers, fetchUserAnswers,login,getUserInfo,logOut};
export default API;