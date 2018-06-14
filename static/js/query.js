'use strict';

let socket = io('ws://localhost:2222/');

let ul = document.body.querySelector('ul');
let textarea = document.body.querySelector('textarea');
    
textarea.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) { //Enter
    socket.emit('query', textarea.value);
    
    let li = document.createElement('li');
    li.innerHTML = textarea.value;
    ul.append(li);
    
    event.target.value = '';
  }
});
