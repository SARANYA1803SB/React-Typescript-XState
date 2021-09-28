import React from "react";
import Shopping from "../components/Shopping";
import { createModel } from '@xstate/test';
import { render, fireEvent,RenderResult,  waitFor} from '@testing-library/react';
import { createMachine, assign } from "xstate";


type PromiseCallbacks = {
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
};
  
type Shared = {
    submitOrderCallbacks?: PromiseCallbacks;
};
  
type TestCycleContext = {
    target: RenderResult;
    shared: Shared;
    setSubmitOrderCallbacks: (submitOrderCallbacks: PromiseCallbacks) => void;
    submitOrderMock: jest.Mock<any, any>;
};

const getTestMachine = ()=>createMachine({
    id :"shopping",
    initial:"choice",
    context: {
        cartsCanceled: 0,
        ordersCompleted: 0,
        ordersFailed: 0,
        anotherChoices:0,
        cancelLists:0,
        continueToLists:0
      },
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
                        CANCEL:{ actions: ["cartCanceled"], target: "ordering" },
                    }
                },
                placingOrder:{
                    invoke:{
                        src:"submitOrder",
                        onDone:"ordered",
                        onError:{ actions: ["orderFailed"], target: "orderFailed" },
                    },
                },
                orderFailed:{
                    on:{
                     PLACE_ORDER:"placingOrder",
                     CANCEL:{ actions: ["cartCanceled"], target: "ordering" },
                    },
                 },
         
                ordered:{
                     on:{
                         CONTINUE_SHOPPING:{actions: ["orderCompleted"],target: "ordering"},
                     }
                },
            },                      
        },
        cashierMode:{
            initial:"viewList",
            on:{
                GO_TO_CHOICE:{actions:["anotherChoice"],target:"choice"},
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
                        CANCEL:{actions:["cancelList"],target:"viewList"},
                    }
                },
                displayingTotal:{
                    on:{
                        CONTINUE:{actions:["continueToList"],target:"viewList"},
                    }
                },
            }
        }
    },
},
{
    actions: {
      cartCanceled: assign((context) => ({
        cartsCanceled: context.cartsCanceled + 1,
      })),
      orderCompleted: assign((context) => ({
        ordersCompleted: context.ordersCompleted + 1,
      })),
      orderFailed: assign((context) => ({
        ordersFailed: context.ordersFailed + 1,
      })),
      anotherChoice: assign((context) => ({
        anotherChoices: context.anotherChoices + 1,
      })),
      cancelList: assign((context) => ({
        cancelLists: context.cancelLists + 1,
      })),
      continueToList: assign((context) => ({
        continueToLists: context.continueToLists + 1,
      })),
    },
  }
);

const getEventConfigs = () => {
    const eventConfigs = {
      CUSTOMER: {
            exec: async ({ target: { getByText } }: TestCycleContext) => {
              fireEvent.click(getByText("Customer"));
            },
      },
      CASHIER: {
            exec: async ({ target: { getByText } }: TestCycleContext) => {
              fireEvent.click(getByText("Cashier"));
            },
      },
      ADD_TO_CART: {
        exec: async ({ target: { getByText } }: TestCycleContext) => {
          fireEvent.click(getByText("Add to Cart"));
        },
      },
      PLACE_ORDER: {
        exec: async ({
          target: { getByText },
          submitOrderMock,
          setSubmitOrderCallbacks,
        }: TestCycleContext) => {
          const submitOrderPromise = new Promise((resolve, reject) => {
            setSubmitOrderCallbacks({ resolve, reject });
          });
  
          submitOrderMock.mockReturnValueOnce(submitOrderPromise);
  
          fireEvent.click(getByText("Place Order"));
        },
      },
      "done.invoke.submitOrder": {
        exec: async ({ shared: { submitOrderCallbacks } }: TestCycleContext) => {
          if (submitOrderCallbacks) {
            submitOrderCallbacks.resolve();
          }
        },
      },
      "error.platform.submitOrder": {
        exec: async ({ shared: { submitOrderCallbacks } }: TestCycleContext) => {
          if (submitOrderCallbacks) {
            submitOrderCallbacks.reject(new Error());
          }
        },
      },
      CONTINUE_SHOPPING: {
        exec: async ({ target: { getByText } }: TestCycleContext) => {
          fireEvent.click(getByText("Continue Shopping"));
        },
      },
      CANCEL: {
        exec: async ({ target: { getByText } }: TestCycleContext) => {
          fireEvent.click(getByText("Cancel"));
        },
      },
      GO_TO_CASHIER: {
        exec: async ({ target: { getByText } }: TestCycleContext) => {
          fireEvent.click(getByText("Go To Cashier"));
        },
      },
      CALCULATE:{
        exec: async ({ target: { getByText } }: TestCycleContext) => {
          fireEvent.click(getByText("Calculate Total"));
        },
      },
      DISPLAY:{
        exec: async ({ target: { getByText } }: TestCycleContext) => {
            fireEvent.click(getByText("Display Total"));
          },
      },
      CONTINUE:{
        exec: async ({ target: { getByText } }: TestCycleContext) => {
            fireEvent.click(getByText("Continue"));
          },
      },
      GO_TO_CHOICE:{
        exec: async ({ target: { getByText } }: TestCycleContext) => {
            fireEvent.click(getByText("Choice"));
          },
      },
    };
  
    return eventConfigs;
  };

  const choiceTest = {
    test: async ({ target: { getByText } }: TestCycleContext) => {
      await waitFor(() => expect(() => getByText("choice")).not.toThrowError());
    },
  };
  const orderingTest = {
    test: async ({ target: { getByText } }: TestCycleContext) => {
      await waitFor(() => expect(() => getByText("customer: ordering")).not.toThrowError());
    },
  };
  const cartTest = {
    test: async ({ target: { getByText } }: TestCycleContext) => {
      await waitFor(() => expect(() => getByText("customer: cart")).not.toThrowError());
    },
  };
  const placingOrderTest = {
    test: async ({ target: { getByText } }: TestCycleContext) => {
      await waitFor(() => expect(() => getByText("customer: placingOrder")).not.toThrowError());
    },
  };
  const orderFailedTest = {
    test: async ({ target: { getByText } }: TestCycleContext) => {
      await waitFor(() => expect(() => getByText("customer: orderFailed")).not.toThrowError());
    },
  };
  const orderedTest = {
    test: async ({ target: { getByText } }: TestCycleContext) => {
      await waitFor(() => expect(() => getByText("customer: ordered")).not.toThrowError());
    },
  };
  const viewListTest = {
    test: async ({ target: { getByText } }: TestCycleContext) => {
      await waitFor(() => expect(() => getByText("cashier: viewList")).not.toThrowError());
    },
  };
  const calculatingTotalTest = {
    test: async ({ target: { getByText } }: TestCycleContext) => {
      await waitFor(() => expect(() => getByText("cashier: calculatingTotal")).not.toThrowError());
    },
  };
  const displayingTotalTest = {
    test: async ({ target: { getByText } }: TestCycleContext) => {
      await waitFor(() => expect(() => getByText("cashier: displayingTotal")).not.toThrowError());
    },
  };

  describe("Shopping", () => {
    describe("matches all paths", () => {
      const testMachine = getTestMachine();
  
      (testMachine.states.choice as any).meta = choiceTest;

      
      (testMachine.states.customerMode.states.ordering as any).meta = orderingTest;
      (testMachine.states.customerMode.states.cart as any).meta = cartTest;
      (testMachine.states.customerMode.states.placingOrder as any).meta = placingOrderTest;
      (testMachine.states.customerMode.states.orderFailed as any).meta = orderFailedTest;
      (testMachine.states.customerMode.states.ordered as any).meta = orderedTest;

      
      (testMachine.states.cashierMode.states.viewList as any).meta = viewListTest;
      (testMachine.states.cashierMode.states.calculatingTotal as any).meta = calculatingTotalTest;
      (testMachine.states.cashierMode.states.displayingTotal as any).meta = displayingTotalTest;

  
      const testModel = createModel(testMachine).withEvents(
        getEventConfigs() as any
      );
  
      const testPlans = testModel
        .getShortestPathPlans({
          filter: (state) =>
            state.context.ordersCompleted <= 1 &&
            state.context.cartsCanceled <= 1 &&
            state.context.ordersFailed <= 1 &&
            state.context.anotherChoices<=1 &&
            state.context.cancelLists<=1 &&
            state.context.continueToLists<=1,
        })
        .filter(
          (plan) =>
            plan.state.context.ordersCompleted === 1 &&
            plan.state.context.ordersFailed===1 &&
            plan.state.context.anotherChoices===1 &&
            plan.state.context.cancelLists===1 &&
            plan.state.context.continueToLists===1
        );
  
      testPlans.forEach((plan) => {
        describe(plan.description, () => {
          plan.paths.forEach((path) => {
            it(path.description, async () => {
              const submitOrderMock = jest.fn();
              
              const shared: Shared = {};
  
              const setSubmitOrderCallbacks = (
                submitOrderCallbacks: PromiseCallbacks
              ) => {
                shared.submitOrderCallbacks = submitOrderCallbacks;
              };
  
              await path.test({
                target: render(
                  <Shopping services={{ submitOrder: submitOrderMock as any }} />
                ),
                shared,
                setSubmitOrderCallbacks,
                submitOrderMock,
              } as TestCycleContext);
            });
          });
        });
      });
  
    //   it("should have full coverage", () => {
    //     return testModel.testCoverage();
    //   });
    });
  });
  

