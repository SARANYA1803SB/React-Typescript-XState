import { getServices } from "../components/Order";
import {orderMachine} from "../machines/orderMachine";

it('should reach "cart" given "shopping" when the "ADD_TO_CART" event occurs', () => {
    const expectedValue = 'cart'; // the expected state value
  
    const actualState = orderMachine(getServices()).transition('shopping', { type: 'ADD_TO_CART' });

    expect(actualState.matches(expectedValue)).toBeTruthy();

});