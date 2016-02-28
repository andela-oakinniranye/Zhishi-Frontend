var Common
import Assign from 'object-assign';
import Config from '../config/environment.js'

Common = {
  initTinyMceContent: function(resource_class){
    tinymce.init({
      selector: `${resource_class} .editor-content`,
      menubar: false,
      toolbar: "bold italic | bullist numlist | link image | codesample | undo redo | tools",
      plugins: ["link image wordcount spellchecker insertdatetime codesample code textpattern autosave autolink"],
      textpattern_patterns: [
         {start: '_', end: '_', format: 'italic'},
         {start: '*', end: '*', format: 'bold'},
         {start: '#', format: 'h1'},
         {start: '##', format: 'h2'},
         {start: '###', format: 'h3'},
         {start: '####', format: 'h4'},
         {start: '#####', format: 'h5'},
         {start: '######', format: 'h6'},
         {start: '`', end: '`', format: 'code'},
         {start: '```', end: '```', format: 'blockquote'},
         {start: '1. ', cmd: 'InsertOrderedList'},
         {start: '* ', cmd: 'InsertUnorderedList'},
         {start: '- ', cmd: 'InsertUnorderedList'}
      ],
      content_css: "/assets/css/tinymce.custom.css"
    })
  },

  initTinyMceTitle:() => {
    tinymce.init({
      selector: ".editor-title",
      inline: true,
      menubar: false,
    })
  },

  removeTinyMce: (resource_class) => {
    tinyMCE.remove(`${resource_class} .editor-content`)
  },

  serializeByKey: (array, key) => {
    var collection = {};
    array.map(item => Common.update(collection, item[key || 'id'], item))
    return collection;
  },

  update: (collection, id, updates, dont_reset_status) => {
    collection[id] = Assign({}, collection[id], updates);
    if (!dont_reset_status) {collection[id]['status'] = ''; }
  },

  createPermalink: (id, title) => {
    var sanitized_string = title.replace(/[^\w\s]/gi, '')
    var max_length = 100;
    var trimmed_string = sanitized_string.substring(0, max_length);
    if (sanitized_string.length > max_length) {
      sanitized_string = sanitized_string.substring(0, trimmed_string.lastIndexOf(' '))
    }
    sanitized_string = sanitized_string.trim().replace(/\s/g, "-");
    return `${id}-${sanitized_string}`;
  },

  sendToSlack: (question) => {
    let permalink = `http://${window.location.host}/questions/${Common.createPermalink(question.id || 2, question.title)}`
    let fallback = `${question.user.name} just asked a question. Can you help? Or know somebody who can help?`;
    let pretext = fallback;
    let color = "#666";
    let fields = [{title: 'New question', value: `<${permalink}|${question.title}>`, short: 'false'}]
    let data = { username: "zhishi-hook", attachments: [{
        fallback: fallback, pretext: pretext, color: color, fields: fields
    }]}
    data = JSON.stringify(data)
    $.ajax({url: Config.slackZhishiChannel, type: 'POST', data: data });
  }
}
export default Common;
