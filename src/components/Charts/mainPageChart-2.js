import { Bar } from "react-chartjs-2";
import axios from 'axios';
import Loading from '../LoadingAnimation/smallLoadingAnimation'
import React from 'react'

import { colors2 } from "../Colors/colors.js"

export default function BarChart(DParameter) {

     var MyData = DParameter.DataParameter

     var NumOfQueues
     var QNames

     const [QDataState, setQDataState] = React.useState([])

     const [isLoading, setLoading] = React.useState(true)

     // ************************************************** BACKEND URLs **************************************************

     let muleGetQueueMessages = "http://localhost:8081/Queue/"

     // ******************************************************************************************************************

     function getCount(para) {
          return para.length
     }

     function step1Fun() {
          return new Promise((resolve, reject) => {
               // Initialize QDataState to Empty Array
               setQDataState(QDataState => [])
               NumOfQueues = getCount(MyData)
               console.log("Chart2 :: Step 1 :: NumOfQueues", NumOfQueues)
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
               console.log("Chart2 :: Step 2 :: QNames", QNames)
               resolve("Step 2 Done")
          })
     }

     async function setQDataStateFun(para) {
          // console.log("Pushing result of Object Maker to the state")
          setQDataState(QDataState => [...QDataState, para])
          setLoading(false)
     }

     async function makeObject(res, para) {
          // console.log("Object Maker Started")
          let RTC = 0
          var tempObject = {}
          tempObject.QName = para
          tempObject.Data = res.data.firstTenMessages
          // console.log("Look here", res, para)
          for (let j = 0; j < getCount(res.data.firstTenMessages); j++) {
               RTC = RTC + Number(res.data.firstTenMessages[j].messageAttributes.retryCount.stringValue)
          }
          tempObject.RetryCount = RTC
          // console.log("Object Maker Finished", tempObject)
          await setQDataStateFun(tempObject)
     }

     async function callingAxios(para) {
          const res = await axios.get(muleGetQueueMessages + para)
          // console.log("Axios Request Done, Now calling Object Maker")
          await makeObject(res, para)
     }

     async function startingLoop(para, num) {
          for (let i = 0; i < num; i++) {
               // console.log("Calling Axios Function for ", para[i])
               callingAxios(para[i]); // Just add await in front of it to make axios requests sequential
          }
     }

     function step3Fun() {
          return new Promise((resolve, reject) => {
               startingLoop(QNames, NumOfQueues)
               resolve("Step 3 Done")
          })
     }

     async function doWork() {
          await step1Fun()
          await step2Fun()
          await step3Fun()
     }

     React.useEffect(() => {
          doWork()
     }, [])

     // Preparing Color Palette for Chart as per number of queues.
     let colorp = [];
     let limit = 1;
     if (MyData.length <= 9) limit = 1;
     // Feel free to use the code below if you are going to use "colors" array from "color.js" but remember the 2D array size for that is different. But as of now, we are using "colors2" array.
     // else if (MyData.length <= 8) limit = 2;
     // else if (MyData.length <= 12) limit = 3;
     // else if (MyData.length <= 16) limit = 4;
     // else if (MyData.length <= 20) limit = 5;
     else if (MyData.length <= 18 & MyData.length > 18) limit = 2;

     for (let i = 0; i < colors2.length; i++) {
          for (let j = 0; j < limit; j++) {
               colorp.push(colors2[i][j]);
          }
     }
     // console.log("Current Color Palette From Main Page Chart 2: ", colorp);

     return (

          (isLoading === true)
               ?
               <Loading />
               :
               <>
                    {console.log("Chart2 :: Step 3 :: QDataState", QDataState)}
                    <Bar
                         data={{
                              labels: QDataState.sort((a, b) => a.QName.localeCompare(b.QName)).map((it, key) => (it.QName)),
                              datasets: [{
                                   label: "Retry Count (Based on first 10 messages)",
                                   data: QDataState.sort((a, b) => a.QName.localeCompare(b.QName)).map((it, key) => (it.RetryCount)),
                                   backgroundColor: colorp,
                                   borderColor: colorp,
                                   borderWidth: 0.5,
                              },],
                         }}
                         options={{
                              maintainAspectRatio: false
                         }}
                    />
               </>

     )
}