import { Link,useNavigate } from "react-router-dom";

export default function Dashboard(){

const nav=useNavigate();

const role=
localStorage.getItem(
"role"
)||"Unknown";

const email=
localStorage.getItem(
"email"
)||"Unknown";

function logout(){

localStorage.clear();

nav("/");

}

const cards=[

{
title:"Restaurants",
path:"/restaurants",
description:
"Manage partner restaurants"
},

{
title:"Food Batches",
path:"/food",
description:
"Manage rescued food"
},

{
title:"Orders",
path:"/orders",
description:
"Create and track orders"
},

{
title:"Donations",
path:"/donations",
description:
"Donation claim workflow"
},

{
title:"Routes",
path:"/routes",
description:
"Driver delivery routes"
}

];

return(

<div
style={{
padding:"30px",
background:"#f5f5f5",
minHeight:"100vh"
}}
>

<div
style={{
display:"flex",
justifyContent:
"space-between",
alignItems:
"center"
}}
>

<div>

<h1>

RescueBite Dashboard

</h1>

<p>

Logged in:

<b>

{email}

</b>

</p>

<p>

Role:

<b>

{role}

</b>

</p>

</div>

<button
onClick={logout}
style={{
padding:"10px",
cursor:"pointer"
}}
>

Logout

</button>

</div>

<hr/>

<div
style={{
display:"grid",
gridTemplateColumns:
"repeat(auto-fit,minmax(250px,1fr))",
gap:"20px",
marginTop:"30px"
}}
>

{

cards.map(card=>(

<div
key={card.path}
style={{
background:"white",
padding:"20px",
borderRadius:"12px",
boxShadow:
"0 2px 10px rgba(0,0,0,0.1)"
}}
>

<h2>

{card.title}

</h2>

<p>

{card.description}

</p>

<Link
to={card.path}
>

<button
style={{
padding:"10px",
marginTop:"10px",
cursor:"pointer"
}}
>

Open

</button>

</Link>

</div>

))

}

</div>

<div
style={{
marginTop:"40px"
}}
>

<h2>

System Status

</h2>

<ul>

<li>

Backend Connected

</li>

<li>

JWT Authentication Enabled

</li>

<li>

Redis Worker Active

</li>

<li>

Email Notifications Enabled

</li>

<li>

RBAC Protected Routes

</li>

</ul>

</div>

</div>

)

}