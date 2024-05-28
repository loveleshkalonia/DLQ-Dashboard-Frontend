import './App.css';
import React from 'react'
import axios from 'axios';

// DO NOT COMMENT BELOW CODE //////////////////////////////////
import Line from "./ChartsJSRegister/Line";
import Barchart from "./ChartsJSRegister/Barcharts";
import DoughNutchart from "./ChartsJSRegister/DoughNutCharts";
import PieChart from "./ChartsJSRegister/Pie";
// DO NOT COMMENT ABOVE CODE //////////////////////////////////

import Interpage from './Inter';
import Navbar from './components/Navbar/navbar';

import MainPageChart1 from './components/Charts/mainPageChart-1';
import MainPageChart2 from './components/Charts/mainPageChart-2';

import Loading from './components/LoadingAnimation/loadingAnimation';

import { Card, CardTitle } from 'reactstrap'

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

  const [myData, setData] = React.useState([{}])
  const [isLoading, setLoading] = React.useState(true)

  // ************************************************** BACKEND URLs **************************************************

  let muleGetActiveQueues = "http://localhost:8081/Queue/Active"

  // ******************************************************************************************************************

  React.useEffect(() => {
    // Sending GET request and saving its response
    axios.get(muleGetActiveQueues).then(
      response => {
        setData(response.data)
        setLoading(false)
      }
    )
  }, [])

  if (isLoading) return <Loading />

  return (

    (queueState === "") ?
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
                  Approx Msg Count
                </CardTitle>
              </div>
              <div style={divcardchart}>
                <MainPageChart1
                  DataParameter={myData}
                  OnClickActions={

                    function (evt, item, data) {
                      queueNameFun(data.config._config.data.datasets[0].data[item[0].index].name);
                      queueMsgCountFun(data.config._config.data.datasets[0].data[item[0].index].approxMsgCount)
                    }

                  }
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
                  Message Retry Count
                </CardTitle>
              </div>
              <div style={divcardchart}>
                <MainPageChart2
                  DataParameter={myData}

                // This code is not working. I was not able to make the second chart clickable.
                // OnClickActions = {

                //   function (evt, item , data) {
                //     queueNameFun(data.config._config.data.datasets[0].data[item[0].index].QName);
                //     queueMsgCountFun(data.config._config.data.datasets[0].data[item[0].index].data.RetriableCount)
                //   }

                // }
                />
              </div>
            </Card>
          </div>
        </div>
      </>

      : <Interpage Qname={queueState} Qcount={queueMsgCountState} />

  )
}

export default App;