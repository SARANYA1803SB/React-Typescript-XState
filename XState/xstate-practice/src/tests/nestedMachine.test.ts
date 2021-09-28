import { nestedMachine } from "../machines/nestedMachine";

it('should reach "low" given "high" when the "LOW" event occurs', () => {
    //const expectedValue = {powered:"low"}; // the expected state value
  
    const actualState = nestedMachine.transition({powered:"high"}, { type: 'LOW_BUTTON_CLICKED' });

    expect(actualState.matches({powered:"low"})).toBeTruthy();

});