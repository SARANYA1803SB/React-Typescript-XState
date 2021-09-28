import Nested from '../components/Nested';
import { createModel } from '@xstate/test';
import { render, fireEvent, cleanup, RenderResult,  waitFor ,act} from '@testing-library/react';
import { Machine, assign } from "xstate";

const getTestMachine=()=>
    Machine(
        {
            id: "nestedMachine",
            initial: "unpowered",
            context:{
                OnToOffCount:0,
                HighToLowCount:0
            },
            states: {
                unpowered: {
                    on: {
                        ON_BUTTON_CLICKED: "powered"
                    }
                },
                powered: {
                    on: {
                        OFF_BUTTON_CLICKED: {actions:["OnToOff"],target:"unpowered"}
                    },
                    initial: "low",
                    states: {
                        low: {
                            on: {
                                HIGH_BUTTON_CLICKED: "high"
                            }
                        },
                        high: {
                            on: {
                                LOW_BUTTON_CLICKED: {actions:["HighToLow"],target:"low"}
                            }
                        }
                    }
                }
            },
        },
        {
            actions:{
                OnToOff: assign((context) => ({
                    OnToOffCount: context.OnToOffCount + 1,
                })),
                HighToLow: assign((context) => ({
                    HighToLowCount: context.HighToLowCount + 1,
                })),
            },
        }
        );

const getEventConfigs=()=>{
    const eventConfigs = {
        ON_BUTTON_CLICKED: {
          exec: async ({ getByText }:any) => {
            fireEvent.click(getByText("ON"));
          },
        },
        OFF_BUTTON_CLICKED: {
            exec: async ({ getByText }:any) => {
              fireEvent.click(getByText("OFF"));
            },
          },
        HIGH_BUTTON_CLICKED: {
            exec: async ({ getByText }:any) => {
              fireEvent.click(getByText("HIGH"));
            },
          },
        LOW_BUTTON_CLICKED: {
            exec: async ({ getByText }:any) => {
              fireEvent.click(getByText("LOW"));
            },
          }, 
    };
    return eventConfigs;
};

const onTest = {
    test: async ({ getByText }:any) => {
      await waitFor(() => expect(() => getByText("powered")).not.toThrowError());
    },
};
const offTest = {
    test: async ({ getByText }:any) => {
      await waitFor(() => expect(() => getByText("unpowered")).not.toThrowError());
    },
};
const highTest = {
    test: async ({ getByText }:any) => {
      await waitFor(() => expect(() => getByText("high")).not.toThrowError());
    },
};
const lowTest = {
    test: async ({ getByText }:any) => {
      await waitFor(() => expect(() => getByText("low")).not.toThrowError());
    },
};

describe("NestState Test", () => {
    describe("matches all paths", () => {
      const testMachine = getTestMachine();
  
      (testMachine.states.powered as any).meta = onTest;
      (testMachine.states.unpowered as any).meta = offTest;
      (testMachine.states.powered.states.high as any).meta = highTest;
      (testMachine.states.powered.states.low as any).meta = lowTest;
     
      const testModel = createModel(testMachine).withEvents(
        getEventConfigs() as any
      );
  
      const testPlans = testModel.getShortestPathPlans({
        filter: (state) =>
          state.context.OnToOffCount <= 1 &&
          state.context.HighToLowCount <= 1
      });
       
      testPlans.forEach((plan) => {
        describe(plan.description, () => {
          plan.paths.forEach((path) => {
            it(path.description, async () => {
              await path.test(render(<Nested />));
            });
          });
        });
      });
  
      it("should have full coverage", () => {
        return testModel.testCoverage();
      });
    });
  });
  