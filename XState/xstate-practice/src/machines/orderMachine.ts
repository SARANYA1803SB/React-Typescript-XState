import { createMachine } from "xstate";

export type OrderServices ={
    submitOrder:()=>Promise<any>;
}


export const orderMachine=(services:OrderServices)=>createMachine({
   id :"order",
   initial:"shopping",
   states:{
       shopping:{
           on:{ADD_TO_CART:"cart"}
       },

       cart:{
           on:{
               PLACE_ORDER:"placingOrder",
               CANCEL:"shopping"
           }
       },

       placingOrder:{
           invoke:{
               src:"submitOrder",
               onDone:"ordered",
               onError:"orderFailed",
           },
       },

       orderFailed:{
           on:{
            PLACE_ORDER:"placingOrder",
            CANCEL:"shopping"
           },
        },

        ordered:{
            on:{
                CONTINUE_SHOPPING:"shopping"
            }
        },
       },
   },
   {
    services: {
      ...services,
    },}
);

