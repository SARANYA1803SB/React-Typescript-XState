import { createMachine } from "xstate";

type TrafficLightEvents={type:"NEXT"};

type TrafficLightStates=
|{value:"green"; context: undefined}
|{value:"yellow"; context: undefined}
|{value:"red"; context: undefined};

export const trafficLightMachine=createMachine<undefined, TrafficLightEvents, TrafficLightStates>({
    id:"trafficLight",
    initial:"red",
    states:{
        green:{
            on:{NEXT:"yellow"}
        },
        yellow:{
            on:{NEXT:"red"}
        },
        red:{
            on:{NEXT:"green"}
        }
    }
});
