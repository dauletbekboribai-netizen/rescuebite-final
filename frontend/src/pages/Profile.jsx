import{

useEffect,

useState

}

from

"react";

import api,

{

getError

}

from

"../api/client";

export default function(){

const[

user,

setUser

]=useState(null);

const[

loading,

setLoading

]=useState(true);

const[

error,

setError

]=useState("");

useEffect(()=>{

load();

},[]);

async function load(){

try{

const r=

await api.get(

"/users/me"

);

setUser(

r.data

);

}
catch(e){

setError(

getError(

e

)

);

}

setLoading(

false

);

}

if(loading){

return(

<h2>

Loading...

</h2>

)

}

if(error){

return(

<h2>

{error}

</h2>

)

}

return(

<div>

<h1>

Profile

</h1>

<p>

Email:

{user.email}

</p>

<p>

Username:

{user.username}

</p>

<p>

Role:

{user.role}

</p>

<p>

Status:

{user.status}

</p>

</div>

)

}