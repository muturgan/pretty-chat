'use strict';

let socket = io();

let click = new Event("click");

let greetingField = document.body.querySelector('[data-component="greeting-field"]');
let chooseSignUpButton = document.body.querySelector('[data-form="choose-sign-up-button"]');
let chooseSignInButton = document.body.querySelector('[data-form="choose-sign-in-button"]');

let signUpField = document.body.querySelector('[data-component="sign-up-field"]');
let signUpLogin = document.body.querySelector('[data-form="sign-up-login"]');
let signUpPassword = document.body.querySelector('[data-form="sign-up-password"]');
let signUpConfirmPassword = document.body.querySelector('[data-form="sign-up-confirm-password"]');
let signUpOutput = document.body.querySelector('[data-form="sign-up-output"]');
let signUpButton = document.body.querySelector('[data-form="sign-up-button"]');
let signUpBackButton = document.body.querySelector('[data-form="sign-up-back-button"]');

let signInField = document.body.querySelector('[data-component="sign-in-field"]');
let signInLogin = document.body.querySelector('[data-form="sign-in-login"]');
let signInPassword = document.body.querySelector('[data-form="sign-in-password"]');
let signInOutput = document.body.querySelector('[data-form="sign-in-output"]');
let signInButton = document.body.querySelector('[data-form="sign-in-button"]');
let signInBackButton = document.body.querySelector('[data-form="sign-in-back-button"]');

let chat = document.body.querySelector('[data-component="chat"]');
let ul = document.body.querySelector('[data-component="message-list"]');
let textarea = document.body.querySelector('textarea');
let sendMessageButton = document.body.querySelector('[data-form="send-message-button"]');


let updateStatus = (userName, status) => {
  let lis = document.body.querySelectorAll('li');
  for (let currentLi of lis) {
    let userNameSpan = currentLi.querySelector('[data-message="user-name"]');
    let statusMarker = currentLi.querySelector('b');
    
    if ( (userNameSpan.textContent === userName) && (statusMarker.classList.contains(`${status}`)) ) {
      statusMarker.classList.toggle('online');
      statusMarker.classList.toggle('offline');
    }
  }
}


chooseSignUpButton.addEventListener('click', () => {
  greetingField.classList.add('js-hidden');
  signUpField.classList.remove('js-hidden');
});

chooseSignInButton.addEventListener('click', () => {
  greetingField.classList.add('js-hidden');
  signInField.classList.remove('js-hidden');
});
//--------------------------------------------------------------------------------------
signUpBackButton.addEventListener('click', () => {
  greetingField.classList.remove('js-hidden');
  signUpField.classList.add('js-hidden');
});

signInBackButton.addEventListener('click', () => {
  greetingField.classList.remove('js-hidden');
  signInField.classList.add('js-hidden');
});
//-------------------------------------------------------------------------------------------
let checkSignInStatus = () => {
  if (signInLogin.value && signInPassword.value) {
    signInButton.removeAttribute('disabled');
  } else {
    signInButton.setAttribute('disabled', true);
  }
};

signInLogin.addEventListener('input', checkSignInStatus);
signInPassword.addEventListener('input', checkSignInStatus);

signInLogin.addEventListener('keydown', (event) => {
  if ((event.keyCode === 13) && (!signInButton.hasAttribute('disabled'))) { //Enter
    signInButton.dispatchEvent(click);
  }
});

signInPassword.addEventListener('keydown', (event) => {
  if ((event.keyCode === 13) && (!signInButton.hasAttribute('disabled'))) { //Enter
    signInButton.dispatchEvent(click);
  }
});

signInButton.addEventListener('click', () => {
  signInOutput.value = `Your personal data is being sent to the server.
Wait a minute please.`;
  signInOutput.classList.remove('js-warning');
  
  socket.emit('initSignIn', {name: signInLogin.value, password: signInPassword.value});
});

//----------------------------------------------------------------------------------------


let checkSignUpStatus = () => {
  if (signUpLogin.value && signUpPassword.value && signUpConfirmPassword.value) {
    signUpButton.removeAttribute('disabled');
  } else {
    signUpButton.setAttribute('disabled', true);
  }
};

signUpLogin.addEventListener('input', checkSignUpStatus);
signUpPassword.addEventListener('input', checkSignUpStatus);
signUpConfirmPassword.addEventListener('input', checkSignUpStatus);


signUpLogin.addEventListener('keydown', (event) => {
  if ((event.keyCode === 13) && (!signUpButton.hasAttribute('disabled'))) { //Enter
    signUpButton.dispatchEvent(click);
  }
});

signUpPassword.addEventListener('keydown', (event) => {
  if ((event.keyCode === 13) && (!signUpButton.hasAttribute('disabled'))) { //Enter
    signUpButton.dispatchEvent(click);
  }
});

signUpConfirmPassword.addEventListener('keydown', (event) => {
  if ((event.keyCode === 13) && (!signUpButton.hasAttribute('disabled'))) { //Enter
    signUpButton.dispatchEvent(click);
  }
});

signUpButton.addEventListener('click', () => {
  if (signUpPassword.value !== signUpConfirmPassword.value) {
    signUpOutput.value = `The entered values of field "Password" and "Confirm password" do not match.
Try again please.`;
  signUpOutput.classList.add('js-warning');
  } else {
    signUpOutput.value = `Your personal data is being sent to the server.
Wait a minute please.`;
  signUpOutput.classList.remove('js-warning');
  
    socket.emit('initSignUp', {name: signUpLogin.value, password: signUpPassword.value});
  }
});

//----------------------------------------------------------------------------------------

textarea.addEventListener('keydown', (event) => {
  if (event.keyCode === 13) { //Enter
    sendMessageButton.dispatchEvent(click);
  }
});

sendMessageButton.addEventListener('click', () => {
  if (textarea.value.trim()) {
    socket.emit('messageFromClient', {text: textarea.value.trim(), author_id: user.id});
  }
  textarea.value = null;
});


//------------------------------------------------------------------------------------

let user = {
  name: 'default',
}

let printMessage = (message) => {
  let now = Date.now();
  let dateString = '';
  let dateDifference = now - message.date;
  
  switch(true) {
    case ( (dateDifference < 86400000/*24 hours*/) && ((new Date(now)).getDate() === (new Date(message.date)).getDate()) ):
      dateString = `${(new Date(message.date)).getHours()}:${(new Date(message.date)).getMinutes()}`;
      if (dateString[1] === ':') {
        dateString = '0' + dateString;
      }
      if (dateString[4] === undefined) {
        dateString = dateString.substring(0,3) + '0' + dateString.substring(3);
      }
      break;
    
    
    case ( (dateDifference < 86400000/*24 hours*/) && ((new Date(now)).getDate() !== (new Date(message.date)).getDate()) ):
      dateString = `yesterday`;
      break;
      
    case ( (dateDifference >= 86400000/*24 hours*/) && (dateDifference < 172800000/*48 hours*/) ):
      dateString = `a day ago`;
      break;
      
    case ( (dateDifference >= 172800000/*48 hours*/) && (dateDifference < 2419200000/*1 month*/) ):
      dateString = `${Math.round(dateDifference/86400000) } days ago`;
      break;
      
    case ( (dateDifference >= 2419200000/*1 month*/) && (dateDifference < 31536000000/*1 year*/) ):
      dateString = `${Math.round(dateDifference/2419200000) } months ago`;
      break;
      
    case ( dateDifference >= 31536000000/*1 year*/ ):
      dateString = `${Math.round(dateDifference/31536000000) } years ago`;
      break;
      
    default:
      dateString = `${new Date(message.date) }`;
  }
  
  let li = document.createElement('li');
    li.innerHTML = `<span class="message-date">${ dateString }</span>
    <b data-message="status-marker">•</b>
    <span data-message="user-name">${ message.name }</span>
    <p>${ message.text }</p>`;
    
    if (message.status === 'online') {
      li.querySelector('b').classList.add('online');
    } else {
      li.querySelector('b').classList.add('offline');
    }
    
    if (message.name === user.name) {
      li.querySelector('[data-message="user-name"]').classList.add('my-message');
    }
    
    ul.append(li);
    
    if ((ul.scrollHeight - ul.scrollTop) < 500) {
      ul.scrollTo(0, ul.scrollHeight);
    }
};
    
socket.on('initChatResponse', (messages) => {
  ul.innerHTML = '';
  
  (() => {
    let i = 0;
    let timerId = setInterval(() => {
      if (messages[i]) {
        printMessage(messages[i]);
      } else {
        clearInterval(timerId);
      }
      i++;
    }, 20);
  })();
});

socket.on('signInSuccess', (data) => {
  user = data;
  
  signInOutput.value = `Login and password are correct.
Wellcome ${user.name} :)`;
  signInOutput.classList.remove('js-warning');
  signInOutput.classList.add('js-success');
  
  setTimeout(() => {
    chat.classList.remove('js-hidden');
    signInField.classList.add('js-hidden');
    socket.emit('initChat');
  }, 2000);
});

socket.on('signUpSuccess', (data) => {
  user = data;
  
  signUpOutput.value = `New user created.
Wellcome ${user.name} :)`;
  signUpOutput.classList.remove('js-warning');
  signUpOutput.classList.add('js-success');
  
  setTimeout(() => {
    chat.classList.remove('js-hidden');
    signUpField.classList.add('js-hidden');
    socket.emit('initChat', user.id);
  }, 2000);
});

socket.on('signInError', () => {
  signInOutput.value = `Login or password incorrect.
Please try again`;
  signInOutput.classList.add('js-warning');
});

socket.on('signUpError', () => {
  signUpOutput.value = `This login is taken.
Create different please`;
  signUpOutput.classList.add('js-warning');
});


socket.on('messageFromServer', (message) => {
  printMessage(message);
});

socket.on('serverError', () => {
  signUpOutput.value = `A thousand apologies. We have a problem on server.`;
  signUpOutput.classList.add('js-warning');
  
  signInOutput.value = `A thousand apologies. We have a problem on server.`;
  signInOutput.classList.add('js-warning');
  
  let li = document.createElement('li');
  li.textContent = `A thousand apologies. We have a problem on server.`;
  ul.append(li);
});

socket.on('user leave', (userName) => {
  updateStatus(userName, 'online');
});

socket.on('user connected', (userName) => {
  updateStatus(userName, 'offline');
});

window.onunload = () => {
  socket.emit('user disconnected', user);
  socket.disconnect();
};