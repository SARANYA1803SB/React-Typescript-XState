import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import List from './components/List';
import AddToList from './components/AddToList';

export interface IState {
  people: {
      name: string
      age: number
      img: string
      note?: string
  }[]
}


function App() {

  const [people, setPeople] = useState<IState["people"]>([
    {
      name: "Iron man",
      age: 50,
      img: "https://play-lh.googleusercontent.com/g5iVUnbbD85ps2LsqZUElWt4jgeryIBfvwY22oI1cgY_MWWKtQ8rxvXzurTlgShdfBU9bqLQp_Qp5zgsKYo",
      note: "Marvel super hero",
    },
    {
      name: "Dhoni",
      age: 42,
      img: "https://www.deccanherald.com/sites/dh/files/styles/article_detail/public/articleimages/2020/08/16/ms%20dhoni%20reuters-1597591291.jpg?itok=wLO62Wto",
      note:"Former Indian Cricket team captain"
    }
  ])

  return (
    <div className="App">
      <h1>People Invited to my Party</h1>
      <List people={people}/>
      <AddToList setPeople={setPeople} people={people}/>
    </div>
  );
}

export default App;