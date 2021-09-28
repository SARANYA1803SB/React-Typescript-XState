import React from 'react';
import { IState as Props } from '../App';


const List:React.FC<Props>=({ people })=>{
    const renderList =()=>{
        return people.map(p=>{
            return(
                <li className="List">
                    <div className="List-header">
                        <img className="List-img" src={p.img}/>
                        <h2>{p.name}</h2>
                    </div>
                    <p>{p.age} years old</p>
                    <p className="List-note">{p.note}</p>
                </li>
            )
        })
    }
    return (
        <ul>
        {renderList()}
        </ul>
    )
}

export default List;