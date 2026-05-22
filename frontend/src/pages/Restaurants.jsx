import API from "../api/client";
import {useEffect,useState} from "react";

export default function Restaurants(){

const[restaurants,setRestaurants]=useState([]);

const[name,setName]=useState("");
const[address,setAddress]=useState("");

const[editingId,setEditingId]=useState(null);

async function load(){

try{

const response=
await API.get(
"/restaurants"
);

setRestaurants(

response.data.items||
response.data||
[]

);

}
catch(err){

console.log(err);

alert(

err?.response?.data?.detail||
"Load failed"

);

}

}

useEffect(()=>{

load();

},[]);

async function createRestaurant(){

try{

if(
!name||
!address
){

alert(
"Fill fields"
);

return;

}

await API.post(

"/restaurants",

{

name,
address

}

);

setName("");
setAddress("");

load();

}
catch(err){

alert(

err?.response?.data?.detail||
"Create failed"

);

}

}

async function updateRestaurant(id){

try{

await API.put(

`/restaurants/${id}`,

{

name,
address

}

);

setEditingId(null);

setName("");
setAddress("");

load();

}
catch(err){

alert(

err?.response?.data?.detail||
"Update failed"

);

}

}

async function removeRestaurant(id){

if(

!window.confirm(
"Delete restaurant?"
)

){

return;

}

try{

await API.delete(

`/restaurants/${id}`

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

function edit(item){

setEditingId(
item.id
);

setName(
item.name||""
);

setAddress(
item.address||""
);

}

return(

<div>

<h1>

Restaurants

</h1>

<div
style={{
marginBottom:20
}}
>

<input

value={name}

onChange={e=>

setName(
e.target.value
)

}

placeholder="Name"

/>

<input

value={address}

onChange={e=>

setAddress(
e.target.value
)

}

placeholder="Address"

/>

{

editingId?

<button

onClick={()=>

updateRestaurant(
editingId
)

}

>

Save

</button>

:

<button

onClick={
createRestaurant
}

>

Create

</button>

}

</div>

{

restaurants.map(r=>(

<div

key={r.id}

style={{

border:
"1px solid gray",

padding:10,

margin:10

}}

>

<h3>

{r.name}

</h3>

<p>

{r.address}

</p>

<button

onClick={()=>

edit(r)

}

>

Edit

</button>

<button

onClick={()=>

removeRestaurant(
r.id
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