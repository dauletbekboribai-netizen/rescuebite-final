import React,
{
useState,
useEffect
}
from "react";

import {
useNavigate,
useSearchParams
}
from "react-router-dom";

import api
from "../api/client";

export default function Auth(){

const nav=
useNavigate();

const[q]=
useSearchParams();

const[
mode,
setMode
]=useState(
"login"
);

const[
message,
setMessage
]=useState("");

const[
loading,
setLoading
]=useState(false);

const[
form,
setForm
]=useState({

email:"",
password:"",
username:"",
role:"consumer"

});

useEffect(()=>{

const token=
q.get(
"token"
);

if(token){

verifyEmail(
token
);

}

const jwt=

localStorage.getItem(
"token"
);

if(jwt){

nav(
"/dashboard"
);

}

},[]);

async function verifyEmail(token){

try{

await api.get(

`/auth/verify-email?token=${token}`

);

setMessage(
"Email verified successfully"
);

}
catch(err){

setMessage(

err?.response?.data?.detail||

"Verification failed"

);

}

}

async function login(){

const r=

await api.post(

"/auth/login",

{

email:
form.email,

password:
form.password

}

);

localStorage.setItem(

"token",

r.data.access_token

);

if(
r.data.refresh_token
){

localStorage.setItem(

"refresh",

r.data.refresh_token

);

}

localStorage.setItem(

"email",

form.email

);

try{

const me=

await api.get(
"/users/me"
);

localStorage.setItem(

"role",

me.data.role

);

}
catch{}

nav(
"/dashboard"
);

}

async function register(){

await api.post(

"/auth/register",

{

username:
form.username,

email:
form.email,

password:
form.password,

role:
form.role

}

);

setMessage(

"Registered. Check email."

);

}

async function forgotPassword(){

await api.post(

"/auth/forgot-password",

{

email:
form.email

}

);

setMessage(

"Reset email sent."

);

}

async function submit(){

setLoading(
true
);

setMessage("");

try{

if(
mode==="login"
){

await login();

}

else if(
mode==="register"
){

await register();

}

else{

await forgotPassword();

}

}
catch(e){

setMessage(

e?.response?.data?.detail||

"Operation failed"

);

}

setLoading(
false
);

}

return(

<div
style={{

background:"#0f172a",

height:"100vh",

display:"flex",

justifyContent:
"center",

alignItems:
"center"

}}
>

<div
style={{

background:"#1e293b",

padding:"30px",

borderRadius:"15px",

width:"420px",

display:"flex",

flexDirection:"column",

gap:"10px",

color:"white"

}}
>

<h1>

RescueBite

</h1>

<select

value={mode}

onChange={e=>

setMode(
e.target.value
)

}

>

<option>

login

</option>

<option>

register

</option>

<option>

forgot

</option>

</select>

{

mode==="register"

&&

<>

<input

placeholder=
"Username"

value={
form.username
}

onChange={e=>

setForm({

...form,

username:
e.target.value

})

}

/>

<select

value={
form.role
}

onChange={e=>

setForm({

...form,

role:
e.target.value

})

}

>

<option>

consumer

</option>

<option>

driver

</option>

<option>

restaurant_manager

</option>

<option>

shelter_coordinator

</option>

<option>

admin

</option>

</select>

</>

}

<input

placeholder=
"Email"

value={
form.email
}

onChange={e=>

setForm({

...form,

email:
e.target.value

})

}

/>

{

mode!=="forgot"

&&

<input

placeholder=
"Password"

type="password"

value={
form.password
}

onChange={e=>

setForm({

...form,

password:
e.target.value

})

}

/>

}

<button

disabled={
loading
}

onClick={
submit
}

>

{

loading

?

"Loading..."

:

"Submit"

}

</button>

{

message&&

<p>

{message}

</p>

}

</div>

</div>

)

}