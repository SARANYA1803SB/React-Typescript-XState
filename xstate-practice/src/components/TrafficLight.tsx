import { useMachine } from '@xstate/react';
import React from 'react';
import '../App.css';
import { trafficLightMachine } from "../machines/traficLightMachine";

const TrafficLight:React.FC=()=>{
const [state,send]=useMachine(trafficLightMachine);
return (
    <div className="container">
      <p data-testid="current_state">{state.value}</p>
      <div className="pole"/>
      <div className="traffic-light">
        <input
          type="radio"
          readOnly
          className="light red"
          checked={state.matches("red")}
        />
        <input
          type="radio"
          readOnly
          className="light yellow"
          checked={state.matches("yellow")}
        />
        <input
          type="radio"
          readOnly
          className="light green"
          checked={state.matches("green")}
        />
        <button data-testid="next-button" onClick={()=>send("NEXT")}>NEXT</button>
      </div>
    </div>
    
  );
}
export default TrafficLight;
