function optionQuestionObj(optionSortID, optionText){
    this.optionSortID = optionSortID;
    this.optionText = optionText;
}
function optionAnswerObj(optionSortID, value){
    this.optionSortID = optionSortID;
    this.value = value;
}

function answerObj(user, questionSortID, answerText, options){
    this.user = user;
    this.questionSortID = questionSortID;
    this.options = [];
    if(!options){
        this.answerText = answerText;
        this.options = null;
    }
    else
    {
        this.answerText = null;    
        for(let o of options)
            this.options.push(new optionAnswerObj(o.optionSortID, o.value))
    }
}

function questionObj(questionSortID, questionText, type, min, max, options){
    this.questionSortID = questionSortID;
    this.questionText = questionText;
    this.type = type;
    this.min = min;
    this.max = max;
    if(type==="open")
        this.options = null;
    else{
        this.options = [];
        for(let o of options)
            this.options.push(new optionQuestionObj(o.optionSortID,o.optionText));
    }
}

export {optionQuestionObj, answerObj, questionObj, optionAnswerObj}