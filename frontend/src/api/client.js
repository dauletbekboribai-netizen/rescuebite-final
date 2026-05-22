import axios from "axios";

const api=axios.create({

baseURL:

import.meta.env.VITE_API_URL ||

"http://localhost:8000"

});

api.interceptors.request.use(

config=>{

const token=

localStorage.getItem(
"token"
);

if(token){

config.headers.Authorization=

`Bearer ${token}`;

}

return config;

}

);

api.interceptors.response.use(

response=>response,

error=>{

if(

error?.response?.status===401

){

localStorage.clear();

window.location="/";

}

return Promise.reject(

error

);

}

);

export function getError(e){

return(

e?.response?.data?.detail||

e?.response?.data?.message||

JSON.stringify(

e?.response?.data

)||

e.message||

"Request failed"

);

}

export default api;