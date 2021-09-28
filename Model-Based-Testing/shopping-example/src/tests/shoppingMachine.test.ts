import { getServices } from "../components/Shopping";
import { shoppingMachine } from "../machines/shoppingMachine";



it('should reach "low" given "high" when the "LOW" event occurs', () => {
    const expectedValue = "choice"; // the expected state value
  
    const actualState = shoppingMachine(getServices()).transition({cashierMode:"displayingTotal"}, { type:'GO_TO_CHOICE'  });

    expect(actualState.matches(expectedValue)).toBeTruthy();

});