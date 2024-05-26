
import Loading from '../LoadingAnimation/smallLoadingAnimation'
import React from 'react'

import { colors2 } from "../Colors/colors.js"
import { Doughnut } from "react-chartjs-2";



export default function DoughNutChartq1(DParameter) {

     let myData = DParameter.QueueMessages;

     const [isLoading, setLoading] = React.useState(true)

     const [final, setfinal] = React.useState([])

     var allerrorcodes

     function step1Fun() {
          return new Promise((resolve, reject) => {
               setfinal(final => []) // Initilize to Blank Array
               allerrorcodes = []  // Initilize to Blank Array
               for (let i = 0; i < myData.length; i++) {
                    allerrorcodes.push(myData[i].messageAttributes.errorCode.stringValue)
               }
               allerrorcodes = allerrorcodes.filter((item, index) => allerrorcodes.indexOf(item) === index)
               resolve("Step 1 Done")
          })
     }

     function step2Fun() {
          return new Promise((resolve, reject) => {
               for (let i = 0; i < allerrorcodes.length; i++) {
                    stepSetFinalFun(allerrorcodes[i])
               }
               resolve("Step 2 Done")
          })
     }

     function stepSetFinalFun(errorcode) {
          return new Promise((resolve, reject) => {
               let c = 0
               for (let i = 0; i < myData.length; i++) {
                    if (myData[i].messageAttributes.errorCode.stringValue === errorcode)
                         c = c + 1
               }
               setfinal(final => [...final, { code: errorcode, count: c }])
          })
     }

     async function doWork() {
          await step1Fun()
          await step2Fun()
          setLoading(false)
     }

     React.useEffect(() => {
          doWork()
     }, [])

     // Preparing Color Palette for Chart as per number of queues.
     let colorp = [];
     let limit = 1;
     if (myData.length <= 9) limit = 1; // Ideally it should be "allerrorcodes" instead of "myData" but it will never break because number of error codes can never be more than the number of queue messages
     // Feel free to use the code below if you are going to use "colors" array from "color.js" but remember the 2D array size for that is different. But as of now, we are using "colors2" array.
     // else if (myData.length <= 14) limit = 2;
     // else if (myData.length <= 12) limit = 3;
     // else if (myData.length <= 16) limit = 4;
     // else if (myData.length <= 20) limit = 5;
     else if (myData.length <= 18 & myData.length > 18) limit = 2;

     for (let i = 0; i < colors2.length; i++) {
          for (let j = 0; j < limit; j++) {
               colorp.push(colors2[i][j]);
          }
     }

     return (

          (isLoading === true)
               ?
               <Loading />
               :
               <>
                    {console.log("Queue Page :: Chart2 :: Final Data", final)}
                    <Doughnut
                         data={{
                              labels: final.map((it, ke) => (it.code)),
                              datasets: [{
                                   label: 'Clickable',
                                   data: final.map((it, ke) => (it.count)),
                                   backgroundColor: colorp,
                                   borderColor: colorp,
                                   borderWidth: 1
                              },],
                         }}
                         // height = {"400"}
                         options={{
                              maintainAspectRatio: false,
                         }}
                    />
               </>

     )
}