import { useEffect, useState } from "react";
import api from "../api/client";

export default function FoodBatches(){

    const [batches,setBatches]=useState([]);

    const [title,setTitle]=useState("");
    const [price,setPrice]=useState("");

    const [editingId,setEditingId]=useState(null);

    async function load(){

        try{

            const r=
                await api.get("/batches");

            setBatches(
                r.data.items ||
                r.data ||
                []
            );

        }
        catch(err){

            console.log(err);

            alert(
                err?.response?.data?.detail ||
                "Failed loading batches"
            );

        }

    }

    useEffect(()=>{

        load();

    },[]);

    async function createBatch(){

        if(!title || !price){

            alert(
                "Fill fields"
            );

            return;

        }

        try{

            await api.post(
                "/batches",
                {
                    title,
                    price:Number(price)
                }
            );

            setTitle("");
            setPrice("");

            load();

        }
        catch(err){

            alert(
                err?.response?.data?.detail ||
                "Create failed"
            );

        }

    }

    async function updateBatch(){

        try{

            await api.put(
                `/batches/${editingId}`,
                {
                    title,
                    price:Number(price)
                }
            );

            setEditingId(null);

            setTitle("");
            setPrice("");

            load();

        }
        catch(err){

            alert(
                err?.response?.data?.detail ||
                "Update failed"
            );

        }

    }

    async function removeBatch(id){

        if(
            !window.confirm(
                "Delete batch?"
            )
        ){

            return;

        }

        try{

            await api.delete(
                `/batches/${id}`
            );

            load();

        }
        catch(err){

            alert(
                err?.response?.data?.detail ||
                "Delete failed"
            );

        }

    }

    function edit(batch){

        setEditingId(
            batch.id
        );

        setTitle(
            batch.title || ""
        );

        setPrice(
            batch.price || ""
        );

    }

    async function changeState(
        id,
        state
    ){

        try{

            await api.patch(
                `/batches/${id}/state`,
                {
                    state
                }
            );

            load();

        }
        catch(err){

            alert(
                err?.response?.data?.detail ||
                "State update failed"
            );

        }

    }

    return(

    <div>

        <h1>

            Food Batches

        </h1>

        <div
        style={{
            marginBottom:20
        }}
        >

            <input
            placeholder="Food title"
            value={title}
            onChange={e=>
            setTitle(
                e.target.value
            )}
            />

            <input
            placeholder="Price"
            type="number"
            value={price}
            onChange={e=>
            setPrice(
                e.target.value
            )}
            />

            {

            editingId ?

            <button
            onClick={
            updateBatch
            }
            >

            Save

            </button>

            :

            <button
            onClick={
            createBatch
            }
            >

            Create

            </button>

            }

        </div>

        {

        batches.map(x=>(

        <div
        key={x.id}
        style={{
            border:"1px solid gray",
            padding:10,
            margin:10
        }}
        >

            <h3>

                {x.title}

            </h3>

            <p>

                Price:
                {x.price}

            </p>

            <p>

                State:
                {x.state}

            </p>

            <p>

                Status:
                {x.status}

            </p>

            <button
            onClick={()=>
            edit(x)}
            >

            Edit

            </button>

            <button
            onClick={()=>
            removeBatch(
                x.id
            )}
            >

            Delete

            </button>

            <hr/>

            <button
            onClick={()=>
            changeState(
                x.id,
                "DISCOUNTED"
            )}
            >

            Discount

            </button>

            <button
            onClick={()=>
            changeState(
                x.id,
                "FREE"
            )}
            >

            Free

            </button>

            <button
            onClick={()=>
            changeState(
                x.id,
                "COMPOST"
            )}
            >

            Compost

            </button>

        </div>

        ))

        }

    </div>

    );

}