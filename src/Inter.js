import './App.css';
import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import SQSMessagesList from './Helper';
import './App.css';

import Navbar from './components/Navbar/navbar';

import { createBrowserHistory } from 'history'

const browserHistory = createBrowserHistory();

export default function Interpage(props) {

   console.log("Logging props = ", props);
   let Qname = props.Qname;
   // let Qcount = props.Qcount;

   return (

      <>
         <Navbar />

         {console.log("This is interpage")}
         {browserHistory.push({ pathname: '/Queue/' + Qname, state: { WindowVarQname: Qname } })}
         {/* {browserHistory.push({pathname: '/Queue/'+ Qname, state:{WindowVarQname:Qname, WindowVarQcount:Qcount}})} */}
         <Router>
            <Route path="/Queue/">{console.log("Value of WindowVarQname = ", window.history.state.state.WindowVarQname)}<SQSMessagesList /></Route>
         </Router>

      </>

   );

}