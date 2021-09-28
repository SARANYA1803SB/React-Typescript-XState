import { createMachine } from "xstate";

export type ShoppingServices ={
    submitOrder:()=>Promise<any>;
}
export const shoppingMachine=(services:ShoppingServices)=>createMachine({
    id :"shopping",
    initial:"choice",
    states:{
                choice:{
                    on:{
                        CUSTOMER:"customerMode",
                        CASHIER:"cashierMode"
                    }        
                },
                customerMode:{
                    initial:"ordering",
                    on:{
                        GO_TO_CASHIER:"cashierMode"
                    },
                    states:{
                        ordering:{
                            on:{
                                ADD_TO_CART:"cart"
                            }
                        },
                        cart:{
                            on:{
                                PLACE_ORDER:"placingOrder",
                                CANCEL:"ordering"
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
                             CANCEL:"ordering"
                            },
                         },
                 
                        ordered:{
                             on:{
                                 CONTINUE_SHOPPING:"ordering"
                             }
                        },
                    },                      
                },
                cashierMode:{
                    initial:"viewList",
                    on:{
                        GO_TO_CHOICE:"choice"
                    },
                    states:{
                        viewList:{
                            on:{
                                CALCULATE:"calculatingTotal",
                            }
                        },
                        calculatingTotal:{
                            on:{
                                DISPLAY:"displayingTotal",
                                CANCEL:"viewList"
                            }
                        },
                        displayingTotal:{
                            on:{
                                CONTINUE:"viewList"
                            }
                        },
                    }
                }
            },
},
{
   services: {
      ...services,
},});
        
 
        
 
        
 
        
 