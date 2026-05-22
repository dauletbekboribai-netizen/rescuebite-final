import { useEffect, useState } from "react";
import api from "../api/client";

export default function Donations(){

const [claims,setClaims]=useState([]);
const [batchId,setBatchId]=useState("");
const [loading,setLoading]=useState(false);

async function load(){

setLoading(true);

try{

const r=await api.get("/donations/claims");

setClaims(
r.data?.items||
r.data||
[]
);

}
catch(e){

alert(
e?.response?.data?.detail||
JSON.stringify(e?.response?.data)||
"Failed loading claims"
);

}

setLoading(false);

}

useEffect(()=>{

load();

},[]);

async function createClaim(){

if(!batchId){

alert("Batch ID required");
return;

}

try{

await api.post(
"/donations/claims",
{
batch_id:Number(batchId)
}
);

setBatchId("");

load();

}
catch(e){

alert(
e?.response?.data?.detail||
JSON.stringify(e?.response?.data)||
"Create failed"
);

}

}

async function updateStatus(id,status){

try{

await api.patch(
`/donations/claims/${id}`,
{
status
}
);

load();

}
catch(e){

alert(
e?.response?.data?.detail||
JSON.stringify(e?.response?.data)||
"Update failed"
);

}

}

async function removeClaim(id){

if(
!window.confirm(
"Delete claim?"
)
){

return;

}

try{

await api.delete(
`/donations/claims/${id}`
);

load();

}
catch(e){

alert(
e?.response?.data?.detail||
JSON.stringify(e?.response?.data)||
"Delete failed"
);

}

}

return(

<div style={{padding:20}}>

<h1>

Donation Claims

</h1>

<div
style={{
marginBottom:20
}}
>

<input
placeholder="Food Batch ID"
value={batchId}
onChange={e=>
setBatchId(
e.target.value
)
}
/>

<button
onClick={
createClaim
}
>

Create Claim

</button>

<button
onClick={
load
}
style={{
marginLeft:10
}}
>

Refresh

</button>

</div>

{

loading

?

<p>

Loading...

</p>

:

claims.length===0

?

<p>

No claims found

</p>

:

claims.map(x=>(

<div
key={x.id}
style={{
border:"1px solid gray",
padding:10,
margin:10
}}
>

<h3>

Claim #

{x.id}

</h3>

<p>

Status:

{x.status||"UNKNOWN"}

</p>

<p>

Food Batch:

{x.batch_id||"-"}

</p>

<p>

User:

{x.user_id||"-"}

</p>

<button
onClick={()=>
updateStatus(
x.id,
"PENDING"
)
}
>

Pending

</button>

<button
onClick={()=>
updateStatus(
x.id,
"APPROVED"
)
}
>

Approve

</button>

<button
onClick={()=>
updateStatus(
x.id,
"COMPLETED"
)
}
>

Complete

</button>

<button
onClick={()=>
removeClaim(
x.id
)
}
>

Delete

</button>

</div>

))

}

</div>

)

}