import { useMachine } from "@xstate/react";
import React from "react";
import {orderMachine, OrderServices} from "../machines/orderMachine";
import "../Order.css";

type OrderProps={
 services?:OrderServices;
}

export const getServices=():OrderServices=>({
submitOrder:()=>{
   const d=1000;

   if(Math.random()<0.5){
       return new Promise((resolve)=>setTimeout(resolve,d));
   }
   return new Promise((_,reject)=>setTimeout(()=>reject(new Error("Order failed")),d));
},
});

const Order:React.FC<OrderProps>=({services})=>{
        const [orderMachineState, send]= useMachine(
            orderMachine(services??getServices())
        );

        return (
            <div className="container">
                <h1 data-testid="current_state">{orderMachineState.value}</h1>
                <div className="buttons">
                    {orderMachineState.value==="shopping" && (
                        <button 
                        onClick={() => send("ADD_TO_CART")}
                        >
                        Add to Cart
                        </button>
                    )}
                    {(orderMachineState.value==="cart" ||
                    orderMachineState.value==="orderFailed" )&& (
                        <button 
                        onClick={() => send("PLACE_ORDER")}
                        >
                        Place Order
                        </button>
                    )}
                    {(orderMachineState.value==="cart" ||
                    orderMachineState.value==="orderFailed") && (
                        <button 
                        onClick={() => send("CANCEL")}
                        >
                        Cancel
                        </button>
                    )}
                    {orderMachineState.value==="ordered" && (
                        <button 
                        onClick={() => send("CONTINUE_SHOPPING")}
                        >
                        Continue Shopping
                        </button>
                    )}


                </div>
            </div>
        );
};

export default Order;