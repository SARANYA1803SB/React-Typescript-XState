import { useMachine } from "@xstate/react";
import React from "react";
import {shoppingMachine, ShoppingServices} from "../machines/shoppingMachine";
import "../Shopping.css";

type OrderProps={
 services?:ShoppingServices;
}

export const getServices=():ShoppingServices=>({
submitOrder:()=>{
   const d=1000;

   if(Math.random()<0.5){
       return new Promise((resolve)=>setTimeout(resolve,d));
   }
   return new Promise((_,reject)=>setTimeout(()=>reject(new Error("Failed")),d));
},
});
//{JSON.stringify(State.value, null, 2)}
const Shopping:React.FC<OrderProps>=({services})=>{
    const [State, send]= useMachine(
        shoppingMachine(services??getServices())
    );

    return (
        <div className="container">
            <h1 data-testid="current_state">
            {State.matches("choice") && "choice"}

            {(State.matches({customerMode:"ordering"}) ||
            State.matches({customerMode:"cart"})||
            State.matches({customerMode:"placingOrder"})||
            State.matches({customerMode:"orderFailed"}) ||
            State.matches({customerMode:"ordered"})) && "customer: "}

            {State.matches({customerMode:"ordering"}) && "ordering"}
            {State.matches({customerMode:"cart"}) && "cart"}
            {State.matches({customerMode:"placingOrder"}) && "placingOrder"}
            {State.matches({customerMode:"orderFailed"}) && "orderFailed"}
            {State.matches({customerMode:"ordered"}) && "ordered"}

            {(State.matches({cashierMode:"viewList"})||
            State.matches({cashierMode:"calculatingTotal"})||
            State.matches({cashierMode:"displayingTotal"})) && "cashier: "}
            
            {State.matches({cashierMode:"viewList"}) && "viewList"}
            {State.matches({cashierMode:"calculatingTotal"}) && "calculatingTotal"}
            {State.matches({cashierMode:"displayingTotal"}) && "displayingTotal"}
            </h1>
            <div className="buttons">
                {State.value==="choice" && (
                    <button 
                    onClick={() => send("CUSTOMER")}
                    >
                    Customer
                    </button>
                )}
                {State.value==="choice" && (
                    <button 
                    onClick={() => send("CASHIER")}
                    >
                    Cashier
                    </button>
                )}
                {State.matches({customerMode:"ordering"}) && (
                    <button 
                    onClick={() => send("ADD_TO_CART")}
                    >
                    Add to Cart
                    </button>
                )}
                {State.matches({customerMode:"cart"})&& (
                    <button 
                    onClick={() => send("PLACE_ORDER")}
                    >
                    Place Order
                    </button>
                )}
                {State.matches({customerMode:"cart"})&& (
                    <button 
                    onClick={() => send("CANCEL")}
                    >
                    Cancel
                    </button>
                )}
                {State.matches({customerMode:"orderFailed"})&& (
                    <button 
                    onClick={() => send("PLACE_ORDER")}
                    >
                    Place Order
                    </button>
                )}
                {State.matches({customerMode:"orderFailed"})&& (
                    <button 
                    onClick={() => send("CANCEL")}
                    >
                    Cancel
                    </button>
                )}
                {State.matches({customerMode:"ordered"}) && (
                    <button 
                    onClick={() => send("CONTINUE_SHOPPING")}
                    >
                    Continue Shopping
                    </button>
                )}
                {(State.matches({customerMode:"ordered"}) ||
                State.matches({customerMode:"orderFailed"})||
                State.matches({customerMode:"cart"})||
                State.matches({customerMode:"ordering"})) && (
                    <button 
                    onClick={() => send("GO_TO_CASHIER")}
                    >
                    Go To Cashier
                    </button>
                )}

                {State.matches({cashierMode:"viewList"}) && (
                    <button 
                    onClick={() => send("CALCULATE")}
                    >
                    Calculate Total
                    </button>
                )}
                {State.matches({cashierMode:"calculatingTotal"}) && (
                    <button 
                    onClick={() => send("DISPLAY")}
                    >
                    Display Total
                    </button>
                )}
                {State.matches({cashierMode:"calculatingTotal"}) && (
                    <button 
                    onClick={() => send("CANCEL")}
                    >
                    Cancel
                    </button>
                )}
                {State.matches({cashierMode:"displayingTotal"}) && (
                    <button 
                    onClick={() => send("CONTINUE")}
                    >
                    Continue
                    </button>
                )}
                {(State.matches({cashierMode:"displayingTotal"}) || 
                State.matches({cashierMode:"calculatingTotal"}) ||
                State.matches({cashierMode:"viewList"})) && (
                    <button 
                    onClick={() => send("GO_TO_CHOICE")}
                    >
                    Choice
                    </button>
                )}

            </div>
        </div>
    );
};

export default Shopping;
