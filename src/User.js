
import {withRouter} from 'react-router-dom'

import './App.css';
import React from 'react'
import {BrowserRouter as Router,Link,Route} from 'react-router-dom'




function User(props)
{
    console.warn(props)
    return(
    <div><h1>Message Count:: {props.match.params.id}</h1>
    <h1>QueueName Name:: {props.match.params.name}</h1>
   
    <Link to={"/Queue"}>Home</Link>
    </div>
    
    )
}


export default withRouter(User);
