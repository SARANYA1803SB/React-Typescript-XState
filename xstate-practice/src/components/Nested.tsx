import * as React from "react";
import { useMachine } from "@xstate/react";
import { nestedMachine } from "../machines/nestedMachine";
import "./Nested.css";

const Nested = () => {
  const [state, send] = useMachine(nestedMachine);

  return (

    <section>
    <output>
      {state.matches("unpowered") && "unpowered"}
      {state.matches({powered:"low"}) && "powered"}
      {state.matches({powered:"high"}) && "powered"}
    </output>
    <button onClick={() => send("ON_BUTTON_CLICKED")}>ON</button>
    <button onClick={() => send("OFF_BUTTON_CLICKED")}>OFF</button>
    <output>
      {state.matches({powered:"low"}) && "low"}
      {state.matches({powered:"high"}) && "high"}
    </output>
    <button onClick={() => send("LOW_BUTTON_CLICKED")}>LOW</button>
    <button onClick={() => send("HIGH_BUTTON_CLICKED")}>HIGH</button>
  </section>


  );
};

export default Nested;


