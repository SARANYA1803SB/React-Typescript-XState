import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import {shallow ,configure} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });

test("renders App component",()=>{
    const wrapper = shallow(<App />);
    expect(wrapper.exists()).toBe(true);
});