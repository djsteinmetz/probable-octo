const malarkey = require('malarkey');
const element = document.querySelector('.typewriter');
function callback(text) {
  element.textContent = text;
}
const options = {
  typeSpeed: 50,
  deleteSpeed: 50,
  pauseDuration: 2000,
  repeat: true
};
malarkey(callback, options)
  .type('Say hello')
  .pause()
  .delete()
  .type('Wave goodbye')
  .pause()
  .delete();