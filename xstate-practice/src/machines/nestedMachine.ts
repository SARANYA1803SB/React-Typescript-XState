import { createMachine } from "xstate";

type StateType = {
    context: null;
    value:
      | "unpowered"
      | {
          powered: "low" | "high";
        };
  };
  
interface OnButtonClickedEventType {
    type: "ON_BUTTON_CLICKED";
  }
  
interface OffButtonClickedEventType {
    type: "OFF_BUTTON_CLICKED";
  }
  
interface LowButtonClickedEventType {
    type: "LOW_BUTTON_CLICKED";
  }
  
interface HighButtonClickedEventType {
    type: "HIGH_BUTTON_CLICKED";
  }
  
type EventType =
    | OnButtonClickedEventType
    | OffButtonClickedEventType
    | LowButtonClickedEventType
    | HighButtonClickedEventType;



export const nestedMachine = createMachine<null, EventType, StateType>({
        id: "nestedMachine",
        initial: "unpowered",
        states: {
            unpowered: {
                on: {
                    ON_BUTTON_CLICKED: "powered"
                }
            },
            powered: {
                on: {
                    OFF_BUTTON_CLICKED: "unpowered"
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
                            LOW_BUTTON_CLICKED: "low"
                        }
                    }
                }
            }
        }
 });
    
  