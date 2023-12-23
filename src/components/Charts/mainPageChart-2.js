import {Bar} from "react-chartjs-2";
import axios from 'axios';
import Loading from '../LoadingAnimation/smallLoadingAnimation'
import React from 'react'
// import delayer from '../Misc/delayer'

// import JSONPretty from 'react-json-pretty';

import {colors2} from "../Colors/colors.js"

export default function BarChart(DParameter) {

     var MyData = DParameter.DataParameter
     
     // let OnClickAct = DParameter.OnClickActions;

     var NumOfQueues
     var QNames = []

     const [QDataState, setQDataState] = React.useState([])

     const [isLoading, setLoading] = React.useState(true)

     function getCount(z) {
          return z.length
     }

     function step1Fun() {
          return new Promise((resolve, reject) => {
               NumOfQueues = MyData.length
               console.log("MyData",MyData)
               resolve("Step 1 Done")
          })
     }
     
     function step2Fun() {
          return new Promise((resolve, reject) => {
               let temp = []
               for (let i = 0; i < NumOfQueues; i++) {
                    temp.push(MyData[i].name);
               }
               QNames = temp
               resolve("Step 2 Done")
          })                
     }

     async function setQDataStateFun(para) {
          console.log("Pushing result of Object Maker to the state")
          setQDataState(QDataState => [...QDataState, para])
          setLoading(false)
     }
     
     async function makeObject(para, res) {
          console.log("Object Maker Started")
          let RTC = 0
          var tempObject = {}
          tempObject.QName = para
          tempObject.Data = res.data
          for (let j = 0; j < getCount(res.data); j++) {
               if (res.data[j].MessageAttributes.isMsgRetriable.StringValue === "Yes") {
                    RTC = RTC + 1
               }
          }
          tempObject.RetriableCount = RTC
          console.log("Object Maker Finished")
          await setQDataStateFun(tempObject)
     }

     async function callingAxios(para) {
          const res = await axios.get('http://localhost:5000/Queue/' + para)
          console.log("Axios Request Done, Now calling Object Maker")
          await makeObject(para, res)
     }

     async function startingLoop(para, num) {
          for (let i = 0; i < num; i++) {
               console.log("Calling Axios Function for ", para[i])
               callingAxios(para[i]); // Just add await in front of it to make axios requests sequential
          }
     }

     function step3Fun() {
          return new Promise((resolve, reject) => {
               console.log("Step 3 Started")
               startingLoop(QNames, NumOfQueues)
               // for (let i = 0; i < NumOfQueues; i++) {
               //      callingAxios(QNames[i]);
               // }       
               resolve("Step 3 Done")
          })
     } 

     function step4Fun() {
          return new Promise((resolve, reject) => {
               // setLoading(false)
               resolve("Step 4 Done")
          })
     }

     async function doWork() {
          const response1 = await step1Fun()
          console.log("Chart2:",response1)
          const response2 = await step2Fun()
          console.log("Chart2:",response2)
          const response3 = await step3Fun()
          console.log("Chart2:",response3)
          const response4 = await step4Fun()
          console.log("Chart2:",response4)
     }

     React.useEffect(()=>{
          doWork()
     },[])
     
     // Preparing Color Palette for Chart as per number of queues.
     let colorp = [];
     let limit = 1;
     if (MyData.length <= 9) limit = 1;
     // else if (MyData.length <= 8) limit = 2;
     // else if (MyData.length <= 12) limit = 3;
     // else if (MyData.length <= 16) limit = 4;
     // else if (MyData.length <= 20) limit = 5;
     else if (MyData.length <= 18 & MyData.length > 18) limit = 2;
     
     for ( let i = 0; i < colors2.length; i++ ) {
          for ( let j = 0 ; j < limit ; j++ ) {
               colorp.push(colors2[i][j]);
          }
     }
     // console.log("Current Color Palette From Main Page Chart 2: ",colorp);

     return (

          (isLoading === true)
          ?
          <Loading />
          :
          <>
          {console.log("QDataState",QDataState)}
          {/* <div className = "div-1"><JSONPretty data = {QDataState}/></div> */}
          <Bar
               data = {{
                    labels: QDataState.sort((a,b)=>a.QName.localeCompare(b.QName)).map((it,key)=>(it.QName)),
                    datasets: [{
                         label: "Number of Messages Retriable",
                         data: QDataState.sort((a,b)=>a.QName.localeCompare(b.QName)).map((it,key)=>(it.RetriableCount)),
                         backgroundColor: colorp,
                    
                         borderColor: colorp,
                         borderWidth: 0.5,
                    },],
               }}
               // Height of graph
               // height = {400}
               options = {{
                    maintainAspectRatio: false,
                    scales: {
                    // yAxes: [{
                    //           ticks: {                              
                    //                beginAtZero: true,
                    //           },
                    //      },],
                    },
                    legend: {
                    // labels: {
                    //      fontSize: 15,
                    //      },
                    },
                    // events: ['click'],
                    onClick:  {function (evt) {{console.log("evt",evt)}}}
                    
               }}
		/>
          </>

     )
}