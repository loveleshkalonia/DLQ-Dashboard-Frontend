import './App.css';
import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import SQSMessagesList from './Helper';
import './App.css';

import Navbar from './components/Navbar/navbar';

import { createBrowserHistory } from 'history'

const browserHistory = createBrowserHistory();

export default function Interpage(props) {

   console.log("Parameters Sent from Home to Queue Page", props);
   let Qname = props.Qname;

   return (

      <>
         <Navbar />

         {console.log("This is Interpage")}
         {browserHistory.push({ pathname: '/Queue/' + Qname, state: { WindowVarQname: Qname } })}
         <Router>
            <Route path="/Queue/">{console.log("Value of WindowVarQname = ", window.history.state.state.WindowVarQname)}<SQSMessagesList /></Route>
         </Router>

      </>

   );

}