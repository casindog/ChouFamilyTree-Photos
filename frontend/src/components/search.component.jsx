import React, { useState, useEffect } from 'react'
import  './search.styles.css'
import * as APIutil from '../util/person_api_util'

// react hooks instead of class components
export const Search = () => {
    const [fname, updateFname] = useState('')
    const [lname, updateLname] = useState('')
    const [company, updateCompany] = useState('')
    const [people, updatePeople] = useState([])

    useEffect(() => {
        // IIFE - immediately invoted function exection
        (async () => {
            const res = await APIutil.getPersons();
            updatePeople(res.data);
        })();
    }, []); //same as componentdidMfount

/*
With class components, it is easy to filter an array based on state. But w/ react hooks, 
I wonder if there's a better way than the one I came up w/ on line 62.
*/
    return (
      <>
        <div id="searchBar">
          <div>
            A: Filter by first and last name
            <input
              type="text"
              placeholder="first name"
              value={fname}
              onChange={e => updateFname(e.target.value)}
            />
            <input
              type="text"
              placeholder="last name"
              value={lname}
              onChange={e => updateLname(e.target.value)}
            />
          </div>

          <div>
            B: Filter by Company Name
            <select value={company} onChange={e => updateCompany(e.target.value)}>
                <option value=''>No Selection</option>

              {people.filter(person => {
                return (
                  person.firstName.includes(fname) &&
                  person.lastName.includes(lname) &&
                  (company ? person.company === company : true)
                 ); 
                }).map(person => (person.company)).sort().map(company => (
                    <option value={company}>{company}</option>
                ))}
                
            </select>
          </div>

          <div>
            C: Sort - in dev
            <input/>
          </div>
        </div>

        <h2 id='firstRow' className="personRow">
            <div>First Name</div>
            <div>Last Name</div>
            <div>Company</div>
        </h2>

        {people.filter(person => {
            return (
              person.firstName.includes(fname) &&
              person.lastName.includes(lname) &&
              (company ? person.company === company : true)
            );
          }).map(person => (
            <h4 className="personRow" key={person._id}>
              <div>{person.firstName}</div>
              <div>{person.lastName}</div>
              <div>{person.company}</div>
            </h4>
          ))}
      </>
    );
}