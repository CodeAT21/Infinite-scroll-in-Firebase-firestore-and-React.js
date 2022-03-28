import React, { useState, useEffect } from 'react';
import db from './firebase-config'
import './App.css';

const App = () => {
  const [Listofcolors, setListofcolors] = useState([]);
  const [lastKey, setLastKey] = useState();
  const [isLoading, setLoading] = useState(false);
  const [isEmpty, setEmpty] = useState(false);

  const colorRef = db.collection('users').orderBy('datetime', 'desc');

  useEffect(() => {
    colorRef.limit(3).get().then((collections)=>{
      updateState(collections);
    });
  }, []);

  const updateState = (collections) =>{
    const isCollectionEmpty = collections.size === 0;
    if(!isCollectionEmpty){
      const colors= collections.docs.map((color) => color.data()); 
      const Lastdoc = collections.docs[collections.docs.length -1];
      setListofcolors((Listofcolors)=>[...Listofcolors, ...colors]);
      setLastKey(Lastdoc);
    }else {
      setEmpty(true);
    }
    setLoading(false);
  }

  const fetchMorePosts = () =>{
    setLoading(true);
    colorRef.startAfter(lastKey).limit(3).get().then((collections)=>{
      updateState(collections);
    });
  }

  if(Listofcolors.length === 0){
    return <h1> Loading... </h1>
  }

  return (<>
    <div className="App">
      <h1> Infinite scroll in Firebase (firestore) and React.js  </h1>
      <div className="wrapper">
        {Listofcolors.map((item,index)=>( 
          <div key={index} >
            <div className="wrapper__list">
              <p><b> Title : </b> {item.title}</p>
              <p><b> Description : </b>{item.description}</p>
              <p><b> Date : </b>{item.datetime?.toDate().toLocaleDateString("en-US")}</p>
            </div>    
          </div>
        ))} 
        {isLoading && <h1> Loading... </h1>}
        {!isLoading && !isEmpty && <button onClick={() => fetchMorePosts()} className="btn__default">More Posts</button> }
        {isEmpty && <h1> There are no more data </h1>}
      </div>
    </div>
  </>)
}

export default App
