import {useEffect,useState}
from "react";

import api
from "../api/client";

export default function Orders(){

const[
orders,
setOrders
]=useState([]);

const[
batchId,
setBatchId
]=useState("");

const[
editingId,
setEditingId
]=useState(null);

const[
status,
setStatus
]=useState("");

async function load(){

try{

const r=

await api.get(
"/orders"
);

setOrders(

r.data.items||
r.data||
[]

);

}
catch(err){

console.log(err);

alert(

err?.response?.data?.detail||
"Failed loading orders"

);

}

}

useEffect(()=>{

load();

},[]);

async function createOrder(){

if(
!batchId
){

alert(
"Batch ID required"
);

return;

}

try{

await api.post(

"/orders",

{

batch_id:
Number(
batchId
)

}

);

setBatchId("");

load();

}
catch(err){

alert(

err?.response?.data?.detail||
"Create failed"

);

}

}

async function updateOrder(){

try{

await api.put(

`/orders/${editingId}`,

{

status

}

);

setEditingId(null);

setStatus("");

load();

}
catch(err){

alert(

err?.response?.data?.detail||
"Update failed"

);

}

}

async function removeOrder(id){

if(

!window.confirm(
"Delete order?"
)

){

return;

}

try{

await api.delete(

`/orders/${id}`

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

function edit(order){

setEditingId(
order.id
);

setStatus(
order.status||""
);

}

async function quickStatus(
id,
newStatus
){

try{

await api.patch(

`/orders/${id}`,

{

status:
newStatus

}

);

load();

}
catch(err){

alert(

err?.response?.data?.detail||
"Status update failed"

);

}

}

return(

<div>

<h1>

Orders

</h1>

<div
style={{
marginBottom:20
}}
>

<input

placeholder=
"Batch ID"

value={
batchId
}

onChange={e=>

setBatchId(
e.target.value
)

}

/>

<button

onClick={
createOrder
}

>

Create Order

</button>

</div>

{

editingId&&(

<div>

<input

placeholder=
"Status"

value={
status
}

onChange={e=>

setStatus(
e.target.value
)

}

/>

<button

onClick={
updateOrder
}

>

Save

</button>

</div>

)

}

{

orders.map(x=>(

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

Order #

{x.id}

</h3>

<p>

Status:

{x.status}

</p>

<p>

Batch:

{x.batch_id}

</p>

<button

onClick={()=>

edit(x)

}

>

Edit

</button>

<button

onClick={()=>

removeOrder(
x.id
)

}

>

Delete

</button>

<hr/>

<button

onClick={()=>

quickStatus(
x.id,
"PENDING"
)

}

>

Pending

</button>

<button

onClick={()=>

quickStatus(
x.id,
"ASSIGNED"
)

}

>

Assigned

</button>

<button

onClick={()=>

quickStatus(
x.id,
"COMPLETED"
)

}

>

Completed

</button>

</div>

))

}

</div>

)

}