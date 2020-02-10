import { shallow } from "enzyme";
import React from 'react';
import { Search } from './search.component'

describe('<Search />', () => {
    // snapshot testing
    it('expect to render Search component', () => {
        expect(shallow(<Search />)).toMatchSnapshot()
    })

    it('correctly updates first name', () => {
        const wrapper = shallow(<Search />);
        expect(wrapper.find('input').at(0).prop('value')).toEqual('')
        wrapper.find('input').at(0).simulate('change', { target: {name: 'fname', value: 'Zoe'}})
        expect(wrapper.find('input').at(0).prop('value')).toEqual('Zoe')
    })

    it('correctly updates last name', () => {
        const wrapper = shallow(<Search />);
        expect(wrapper.find('input').at(1).prop('value')).toEqual('')
        wrapper.find('input').at(1).simulate('change', { target: {name: 'lname', value: 'Kimmel'}})
        expect(wrapper.find('input').at(1).prop('value')).toEqual('Kimmel')
    })

    it('correctly updates company', () => {
        const wrapper = shallow(<Search />);
        expect(wrapper.find('select').prop('value')).toEqual('')
        wrapper.find('select').simulate('change', { target: {name: 'company', value: 'Chevron'}})
        expect(wrapper.find("select").prop("value")).toEqual("Chevron");
    })
})

