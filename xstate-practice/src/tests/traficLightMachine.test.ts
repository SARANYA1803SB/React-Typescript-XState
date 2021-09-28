 import { trafficLightMachine } from "../machines/traficLightMachine";


it('should reach "yellow" given "green" when the "NEXT" event occurs', () => {
  const expectedValue = 'yellow'; // the expected state value

  const actualState = trafficLightMachine.transition('green', { type: 'NEXT' });

  expect(actualState.matches(expectedValue)).toBeTruthy();
});

it('should reach "red" given "yellow" when the "NEXT" event occurs', () => {
    const expectedValue = 'red'; // the expected state value
  
    const actualState = trafficLightMachine.transition('yellow', { type: 'NEXT' });
  
    expect(actualState.matches(expectedValue)).toBeTruthy();
  });

it('should reach "green" given "red" when the "NEXT" event occurs', () => {
    const expectedValue = 'green'; // the expected state value
  
    const actualState = trafficLightMachine.transition('red', { type: 'NEXT' });
  
    expect(actualState.matches(expectedValue)).toBeTruthy();
  });

