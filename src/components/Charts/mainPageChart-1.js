import React from 'react'

import { Doughnut } from "react-chartjs-2";

import { colors2 } from "../Colors/colors.js"

import Loading from '../LoadingAnimation/smallLoadingAnimation'

export default function DoughNutChart(DParameter) {

     let myData = DParameter.DataParameter;
     let OnClickAct = DParameter.OnClickActions;

     const [isLoading, setLoading] = React.useState(true)

     function step1Fun() {
          return new Promise((resolve, reject) => {
               resolve(myData)
          })
     }

     async function doWork() {
          const response = await step1Fun()
          console.log("Chart1 :: Step 1 :: Data", response)
          setLoading(false)
     }

     React.useEffect(() => {
          doWork()
     }, [])

     // Preparing Color Palette for Chart as per number of queues.
     let colorp = [];
     let limit = 1;
     if (myData.length <= 9) limit = 1;
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
     // console.log("Current Color Palette From Main Page Chart 1: ", colorp);

     return (

          (isLoading === true)
               ?
               <Loading />
               :
               <Doughnut
                    data={{
                         labels: myData.map((it, ke) => (it.name)),
                         datasets: [{
                              label: 'Clickable',
                              data: myData,
                              backgroundColor: colorp,
                              borderColor: colorp,
                              borderWidth: 1
                         },],
                    }}
                    options={{
                         maintainAspectRatio: false,
                         parsing: {
                              key: 'approxMsgCount'
                         },
                         onClick: OnClickAct
                    }}
               />

     )
}