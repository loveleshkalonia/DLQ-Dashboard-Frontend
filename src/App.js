import './App.css';
import React from 'react'
// import {BrowserRouter as Router,Switch,Link,Route} from 'react-router-dom'
import axios from 'axios';
import './App.css';

// DO NOT COMMENT BELOW CODE //////////////////////////////////
import Line from "./ChartsJSRegister/Line";
import Barchart from "./ChartsJSRegister/Barcharts";
import DoughNutchart from "./ChartsJSRegister/DoughNutCharts";
import PieChart  from "./ChartsJSRegister/Pie";
// DO NOT COMMENT ABOVE CODE //////////////////////////////////

import Interpage from './Inter';
import Navbar from './components/Navbar/navbar';

import MainPageChart1 from './components/Charts/mainPageChart-1';
import MainPageChart2 from './components/Charts/mainPageChart-2';

import Loading from './components/LoadingAnimation/loadingAnimation';
// import { ToastContainer, toast } from 'react-toastify';   // npm install --save react-toastify
import 'react-toastify/dist/ReactToastify.css';           // npm install --save react-toastify

import {Card, CardTitle} from 'reactstrap'

// import { createBrowserHistory } from 'history'

// const browserHistory = createBrowserHistory();

const divstyleparent = {
  display: 'flex',
  paddingTop: '15px',
  alignItems: 'center',
  justifyContent: 'center',
}

const divstyle = {
  display: 'flex',
  width: 'fit-content',
  alignItems: 'center',
  justifyContent: 'center',
}

const divcard = {
  width: '350px'
}

const divcardchart = {
  width: '350px',
  height: '350px'
}

const divspace = {
  width: '15px'
}

function App() {

  const [queueState, setQueueState] = React.useState(""); // This is a state initialized to blank string

  // Below is the function that will take some string as parameter and set value of "queueState"
  const queueNameFun = (queueName) => {
    console.log("Value of queueName = ", queueName)
    setQueueState(queueName)
  }
  
  const [queueMsgCountState, setQueueMsgCountState] = React.useState(""); // This is another state initialized to blank string

  // Below is the function that will take some number as parameter and set value of "queueMsgCountState"
  const queueMsgCountFun = (queueMsgCount) => {
    console.log("Value of queueMsgCount = ", queueMsgCount)
    setQueueMsgCountState(queueMsgCount)
  }

  // let user=[{"name": "Test-queue-1", "msq_count": "1"}, {"name": "Test-queue-2", "msq_count": "0"}, {"name": "Test-queue-3", "msq_count": "5"}]
  // http://127.0.0.1:5000/Queue/Active

	const [myData, setData] = React.useState([{}])
  const [isLoading, setLoading] = React.useState(true)

	let baseURL="http://127.0.0.1:5000/Queue/Active"

	React.useEffect(() => {
    // Sending GET request and saving its response
		axios.get(baseURL).then(
			response => {
				setData(response.data)
				console.log("Logging \"myData\"",response.data)

			  setLoading(false)
			}
		)
	}, [])

  if (isLoading) return <Loading />

  return (

    (queueState === "")?
    <>
      <Navbar />
      <div style={divstyleparent}>
        <div style={divstyle}>
          <Card
            body
            className="text-center"
            style={{
              width: 'fit-content',
            }}
          >
            <div style={divcard}>
              <CardTitle tag="h5">
                Active DLQs
              </CardTitle>
            </div>
            <div style={divcardchart}>
              <MainPageChart1 
                DataParameter = {myData}
                OnClickActions = {

                  function (evt, item , data) {
                    queueNameFun(data.config._config.data.datasets[0].data[item[0].index].name);
                    queueMsgCountFun(data.config._config.data.datasets[0].data[item[0].index].amount.msgCount)
                  
                  }}
              />
            </div>
          </Card>
          <div style={divspace}></div>
          <Card
            body
            className="text-center"
            style={{
              width: 'fit-content',
            }}
          >
            <div style={divcard}>
              <CardTitle tag="h5">
                Retriable Message Count
              </CardTitle>
            </div>
            <div style={divcardchart}>
              <MainPageChart2 
                DataParameter = {myData}
                OnClickActions = {

                  function (evt, item , data) {
                    queueNameFun(data.config._config.data.datasets[0].data[item[0].index].QName);
                    queueMsgCountFun(data.config._config.data.datasets[0].data[item[0].index].data.RetriableCount)
                  
                  }}
              />
            </div>
          </Card>
        </div>
      </div>
    </>

    :<Interpage Qname={queueState} Qcount={queueMsgCountState} />
  
  )
}

export default App;