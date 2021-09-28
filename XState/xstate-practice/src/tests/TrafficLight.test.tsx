import React from "react";
import TrafficLight from "../components/TrafficLight";
import { trafficLightMachine } from "../machines/traficLightMachine";
import { createModel } from '@xstate/test';
import { render, fireEvent, cleanup } from '@testing-library/react';


trafficLightMachine.states.red.meta={
    test:async({getByTestId}:any)=>{
        expect (getByTestId('current_state')).toHaveTextContent('red');
    }
};
trafficLightMachine.states.yellow.meta={
    test:async({getByTestId}:any)=>{
        expect (getByTestId('current_state')).toHaveTextContent('yellow');
    }
};
trafficLightMachine.states.green.meta={
    test:async({getByTestId}:any)=>{
        expect (getByTestId('current_state')).toHaveTextContent('green');
    }
};


const stateMachineModel = createModel(trafficLightMachine,
    {events:{
        NEXT: 
            ({ getByTestId}:any) => {fireEvent.click(getByTestId('next-button'))
    }
  }});
  
  describe('StateMachine', () => {
    const testPlans = stateMachineModel.getShortestPathPlans();
  
    testPlans.forEach((plan) => {
      describe(plan.description, () => {
        afterEach(cleanup);
        plan.paths.forEach((path) => {
          it(path.description, async () => {
            await path.test(render(<TrafficLight />));
          });
        });
      });
    });
  });
  

