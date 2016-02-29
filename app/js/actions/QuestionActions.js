import AppDispatcher from '../dispatcher/AppDispatcher';
import ZhishiConstants from '../constants/ZhishiConstants';
import Common from '../utils/Common.js'

var QuestionActions;

var waitForQuestionStore =  function(){
  if (AppDispatcher._isDispatching) { AppDispatcher.waitFor([QuestionStore.dispatchToken]) }
}

QuestionActions = {
  createQuestion: (question) => {
    QuestionActions.receiveQuestion(question)
    QuestionActions.sendQuestionsToSlack(question)
    window.location.href = `/questions/${question.id}`
  },

  receiveQuestions: (data) => {
    waitForQuestionStore();
    AppDispatcher.dispatch({
      actionType: ZhishiConstants.RECEIVE_QUESTIONS,
      data: data
    });
  },

  receiveQuestion: (question, new_question) => {
    waitForQuestionStore();
    if (question && question.id) {
      AppDispatcher.dispatch({
        actionType: ZhishiConstants.QUESTION_UPDATE,
        data: question
      });
    }
  },

  receiveTopQuestions: (data) => {
    waitForQuestionStore();
    AppDispatcher.dispatch({
      actionType: ZhishiConstants.RECEIVE_TOP_QUESTIONS,
      data: data
    });
  },

  editQuestion: (data) => {
    waitForQuestionStore();
    AppDispatcher.dispatch({
      actionType: ZhishiConstants.QUESTION_EDIT,
      data: data
    });
  },

  updateVote: (data) => {
    AppDispatcher.dispatch({
      actionType: ZhishiConstants.QUESTION_UPDATE_VOTES,
      data: data
    });
  },

  sendQuestionsToSlack: (question) => {
    let prefix = ["Got a bit of time?", 'Hey, you down?', 'Hey, can you help?', 'SOS']
    if (question) {
      let intro = `${prefix[parseInt(Math.random() * 4)]}! ${question.user.name} just asked a question`
      Common.sendToSlack({id: question.id, title: question.title, content: question.content, intro: intro})
    }
  }
}

export default QuestionActions;
