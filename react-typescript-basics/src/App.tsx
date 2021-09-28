import React, { useState } from 'react';
import './App.css';
import {User} from "./interfaces";
interface AppProps{
  headerText:string; //Props
  optText?:string; //Optional props
}


function App({headerText,optText}:AppProps) {
  const [user,setUser]=useState<User | null>(null);
  const fetchUser=()=>setUser({
    name:'Saranya',
    age:21,
    country:'India',
    address:{
      street:'main st',
      number:58,
      zip:'603102'
    },
    admin:false
  })
  return (
   <>
   <h1>{headerText}</h1>
   {optText && <p>{optText}</p>}
   <button onClick={fetchUser}>Fetch</button>

   {user && <p>{`Welcome ${user.name}`}</p>}
   </>
  );
}

export default App;
