!function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=9)}([function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});n.default=function(){var e=new Date,n="["+e.getHours()+":"+e.getMinutes()+":"+e.getSeconds()+"]";return":"===n[2]&&(n="[0"+n.substring(1)),":"===n[5]&&(n=n.substring(0,4)+"0"+n.substring(4)),"]"===n[8]&&(n=n.substring(0,7)+"0"+n.substring(7)),n}},function(e,n){e.exports=require("js-base64")},function(e,n){e.exports=require("promise-mysql")},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=t(2),r={host:"128.199.39.117",user:"node",password:"edon",database:"pretty_chat",port:3306};n.default=function(e){return o.createConnection(r).then(function(n){var t=n.query(e);return n.end(),t}).catch(function(e){throw e})}},function(e,n,t){"use strict";var o=this&&this.__awaiter||function(e,n,t,o){return new(t||(t=Promise))(function(r,s){function u(e){try{a(o.next(e))}catch(e){s(e)}}function i(e){try{a(o.throw(e))}catch(e){s(e)}}function a(e){e.done?r(e.value):new t(function(n){n(e.value)}).then(u,i)}a((o=o.apply(e,n||[])).next())})},r=this&&this.__generator||function(e,n){var t,o,r,s,u={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return s={next:i(0),throw:i(1),return:i(2)},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s;function i(s){return function(i){return function(s){if(t)throw new TypeError("Generator is already executing.");for(;u;)try{if(t=1,o&&(r=2&s[0]?o.return:s[0]?o.throw||((r=o.return)&&r.call(o),0):o.next)&&!(r=r.call(o,s[1])).done)return r;switch(o=0,r&&(s=[2&s[0],r.value]),s[0]){case 0:case 1:r=s;break;case 4:return u.label++,{value:s[1],done:!1};case 5:u.label++,o=s[1],s=[0];continue;case 7:s=u.ops.pop(),u.trys.pop();continue;default:if(!(r=(r=u.trys).length>0&&r[r.length-1])&&(6===s[0]||2===s[0])){u=0;continue}if(3===s[0]&&(!r||s[1]>r[0]&&s[1]<r[3])){u.label=s[1];break}if(6===s[0]&&u.label<r[1]){u.label=r[1],r=s;break}if(r&&u.label<r[2]){u.label=r[2],u.ops.push(s);break}r[2]&&u.ops.pop(),u.trys.pop();continue}s=n.call(e,u)}catch(e){s=[6,e],o=0}finally{t=r=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}([s,i])}}},s=this;Object.defineProperty(n,"__esModule",{value:!0});var u=t(3),i=t(1).Base64,a={initSignIn:function(e){return o(s,void 0,void 0,function(){var n;return r(this,function(t){switch(t.label){case 0:return t.trys.push([0,5,,6]),[4,u.default('SELECT password FROM users WHERE name="'+i.encode(e.name)+'";')];case 1:return n=t.sent(),[4,function(n){if(void 0===n[0]||i.decode(n[0].password)!==e.password)throw new Error("signInError")}];case 2:return t.sent(),[4,u.default("UPDATE users SET status = 'online' WHERE name=\""+i.encode(e.name)+'";')];case 3:return n=t.sent(),[4,u.default('SELECT id, name, status FROM users WHERE name="'+i.encode(e.name)+'";')];case 4:return(n=t.sent())[0].name=i.decode(n[0].name),[2,n[0]];case 5:throw t.sent();case 6:return[2]}})})},initSignUp:function(e){return u.default('SELECT name FROM users WHERE name="'+i.encode(e.name)+'";').then(function(n){if(n[0])throw new Error("signUpError");return u.default("INSERT INTO users (name, password, status) VALUES ('"+i.encode(e.name)+"', '"+i.encode(e.password)+"', 'online');").then(function(){return u.default('SELECT id, name, status FROM users WHERE name="'+i.encode(e.name)+'"')}).then(function(e){return e[0]})}).catch(function(e){throw e})},initChat:function(){return u.default('SELECT *, NULL AS password FROM users, messages WHERE messages.author_id = users.id AND messages.room="public";').then(function(e){}).catch(function(e){throw e})},messageFromClient:function(e){var n=Date.now();return u.default("INSERT INTO messages (date, text, author_id) VALUES ("+n+",'"+i.encode(e.text)+"', '"+e.author_id+"');").then(function(){return u.default("SELECT *, NULL AS password FROM users, messages WHERE users.id = "+e.author_id+' AND messages.room="public" AND messages.date='+n+' AND messages.text="'+i.encode(e.text)+'";')}).then(function(e){return e[0].name=i.decode(e[0].name),e[0].text=i.decode(e[0].text),e[0]}).catch(function(e){throw e})},userLeave:function(e){return u.default("UPDATE users SET status = 'offline' WHERE id=\""+e.id+'";').catch(function(e){throw e})}};n.default=a},function(e,n){e.exports=require("http")},function(e,n){e.exports=require("path")},function(e,n){e.exports=require("socket.io")},function(e,n){e.exports=require("express")},function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var o=t(8),r=t(7),s=t(6),u=t(5),i=t(4),a=t(0),c=o().use(o.static(s.join(__dirname,"../static"))).use(o.json()).use(o.urlencoded({extended:!0})).get("/",function(e,n){n.sendFile(s.join(__dirname,"/../static/index.html"))}),l=new u.Server(c),f=r(l),d=process.env.PORT||3333;l.listen(d,function(){console.log("\n"+a.default()+" server listening on "+d)});var m={};f.on("connection",function(e){console.log(""),console.log(a.default()+" connected new client "+e.id),e.on("initSignIn",function(n){i.default.initSignIn(n).then(function(n){e.emit("signInSuccess",n),m[n.name]=e.id,e.broadcast.emit("user connected",n.name),console.log(""),console.log(a.default()+" "+n.name+" is online")}).catch(function(n){"signInError"===n.message?e.emit("signInError"):(console.log(""),console.log(a.default()+" error:"),console.log(n),e.emit("serverError"))})}),e.on("initSignUp",function(n){i.default.initSignUp(n).then(function(n){e.emit("signUpSuccess",n),m[n.name]=e.id,e.broadcast.emit("user created",n.name),console.log(""),console.log(a.default()+" new user "+n.name+" joined")}).catch(function(n){"signUpError"===n.message?e.emit("signUpError"):(console.log(""),console.log(a.default()+" error:"),console.log(n),e.emit("serverError"))})}),e.on("initChat",function(){i.default.initChat().then(function(n){e.emit("initChatResponse",n)}).catch(function(n){console.log(""),console.log(a.default()+" error:"),console.log(n),e.emit("serverError")})}),e.on("messageFromClient",function(n){i.default.messageFromClient(n).then(function(e){f.emit("messageFromServer",e)}).catch(function(n){console.log(""),console.log(a.default()+" error:"),console.log(n),e.emit("serverError")})}),e.on("user leave",function(e){"default"!==e.name&&i.default.userLeave(e).then(function(){console.log(""),console.log(a.default()+" "+e.name+" is offline"),delete m[e.name],f.emit("user leave",e.name)}).catch(function(e){console.log(""),console.log(a.default()+" error:"),console.log(e)})})})}]);