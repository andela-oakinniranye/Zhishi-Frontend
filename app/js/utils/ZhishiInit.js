import QuestionActions from "../actions/QuestionActions.js";
import webAPI from "./webAPI.js";

module.exports = {
  getInitData: function() {
    webAPI.processRequest("/questions", "GET", "", QuestionActions.receiveInitData);
  }
};