import React from "react";

import{

BrowserRouter,

Routes,

Route,

Navigate

}

from

"react-router-dom";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";

import Restaurants from "./pages/Restaurants";

import Orders from "./pages/Orders";

import Donations from "./pages/Donations";

import FoodBatches from "./pages/FoodBatches";

import RoutesPage from "./pages/Routes";

import Profile from "./pages/Profile";

import ProtectedRoute from "./pages/ProtectedRoute";

export default function(){

return(

<BrowserRouter>

<Routes>

<Route

path="/"

element={<Login/>}

/>

<Route

path="/dashboard"

element={

<ProtectedRoute>

<Dashboard/>

</ProtectedRoute>

}

/>

<Route

path="/profile"

element={

<ProtectedRoute>

<Profile/>

</ProtectedRoute>

}

/>

<Route

path="/restaurants"

element={

<ProtectedRoute>

<Restaurants/>

</ProtectedRoute>

}

/>

<Route

path="/food"

element={

<ProtectedRoute>

<FoodBatches/>

</ProtectedRoute>

}

/>

<Route

path="/orders"

element={

<ProtectedRoute>

<Orders/>

</ProtectedRoute>

}

/>

<Route

path="/donations"

element={

<ProtectedRoute>

<Donations/>

</ProtectedRoute>

}

/>

<Route

path="/routes"

element={

<ProtectedRoute>

<RoutesPage/>

</ProtectedRoute>

}

/>

<Route

path="*"

element={

<Navigate

to="/"

/>

}

/>

</Routes>

</BrowserRouter>

)

}