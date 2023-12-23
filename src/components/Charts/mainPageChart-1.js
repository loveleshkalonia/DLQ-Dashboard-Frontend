import React from 'react'

import {Doughnut} from "react-chartjs-2";

import {colors2} from "../Colors/colors.js"

import Loading from '../LoadingAnimation/smallLoadingAnimation'

export default function DoughNutChart(DParameter) {

     let myData = DParameter.DataParameter;
     let OnClickAct = DParameter.OnClickActions;

     const [isLoading, setLoading] = React.useState(true)

     let counts = [];
     const [final, setfinal] = React.useState([]);
   
     function step1Fun() {
          return new Promise((resolve, reject) => {
               for (let i = 0; i < myData.length; i++) {
                    counts.push(myData[i].msq_count);
                    setfinal(final => [...final, {"name":myData[i].name, "amount" :{ "msgCount" : myData[i].msq_count }}])
                  }
               resolve("Step 1 Done")
          })
     }

     async function doWork() {
          const response = await step1Fun()
          setLoading(false)
          console.log("Chart1:",response)
     }

     React.useEffect(()=>{
          doWork()
     },[])

     // Preparing Color Palette for Chart as per number of queues.
     let colorp = [];
     let limit = 1;
     if (myData.length <= 9) limit = 1;
     // else if (myData.length <= 14) limit = 2;
     // else if (myData.length <= 12) limit = 3;
     // else if (myData.length <= 16) limit = 4;
     // else if (myData.length <= 20) limit = 5;
     else if (myData.length <= 18 & myData.length > 18) limit = 2;
     
     for ( let i = 0; i < colors2.length; i++ ) {
          for ( let j = 0 ; j < limit ; j++ ) {
               colorp.push(colors2[i][j]);
          }
     }
     // console.log("Current Color Palette From Main Page Chart 1: ",colorp);

     return (

          (isLoading === true)
          ?
          <Loading />
          :
          <Doughnut
               data = {{
                    labels: final.map((it,ke)=>(it.name)),
                    datasets: [{
                         label: 'Clickable',
                         data: final,
                         backgroundColor: colorp,
                         borderColor: colorp,
                         borderWidth: 1
                    },],
               }}
               // height = {"400"}
               options = {{
                    maintainAspectRatio : false,
                    parsing: {
                         key : 'amount.msgCount'
                    },
                    onClick: OnClickAct
               }}
          />

     )
}