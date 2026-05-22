import {useEffect,useState}
from "react";

import api
from "../api/client";

export default function Routes(){

const[
routes,
setRoutes
]=useState([]);

const[
driverId,
setDriverId
]=useState("");

const[
orderId,
setOrderId
]=useState("");

async function load(){

try{

const r=

await api.get(
"/routes/assignments"
);

setRoutes(

r.data.items||
r.data||
[]

);

}
catch(err){

console.log(err);

alert(

err?.response?.data?.detail||
"Failed loading routes"

);

}

}

useEffect(()=>{

load();

},[]);

async function assignDriver(){

if(
!driverId||
!orderId
){

alert(
"Driver ID and Order ID required"
);

return;

}

try{

await api.post(

"/routes/assignments",

{

driver_id:
Number(
driverId
),

order_id:
Number(
orderId
)

}

);

setDriverId("");
setOrderId("");

load();

}
catch(err){

alert(

err?.response?.data?.detail||
"Assignment failed"

);

}

}

async function updateStatus(
id,
status
){

try{

await api.patch(

`/routes/assignments/${id}`,

{

status

}

);

load();

}
catch(err){

alert(

err?.response?.data?.detail||
"Update failed"

);

}

}

async function removeAssignment(id){

if(

!window.confirm(
"Delete assignment?"
)

){

return;

}

try{

await api.delete(

`/routes/assignments/${id}`

);

load();

}
catch(err){

alert(

err?.response?.data?.detail||
"Delete failed"

);

}

}

return(

<div>

<h1>

Driver Routes

</h1>

<div
style={{
marginBottom:20
}}
>

<input

placeholder=
"Driver ID"

value={
driverId
}

onChange={e=>

setDriverId(
e.target.value
)

}

/>

<input

placeholder=
"Order ID"

value={
orderId
}

onChange={e=>

setOrderId(
e.target.value
)

}

/>

<button

onClick={
assignDriver
}

>

Assign

</button>

</div>

{

routes.map(x=>(

<div

key={x.id}

style={{

border:
"1px solid gray",

padding:10,

margin:10

}}

>

<h3>

Route #

{x.id}

</h3>

<p>

Status:

{x.status}

</p>

<p>

Driver:

{x.driver_id}

</p>

<p>

Order:

{x.order_id}

</p>

<button

onClick={()=>

updateStatus(

x.id,

"ASSIGNED"

)

}

>

Assigned

</button>

<button

onClick={()=>

updateStatus(

x.id,

"PICKED_UP"

)

}

>

Picked Up

</button>

<button

onClick={()=>

updateStatus(

x.id,

"DELIVERED"

)

}

>

Delivered

</button>

<button

onClick={()=>

removeAssignment(
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