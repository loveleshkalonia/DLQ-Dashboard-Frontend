
import Loading from '../LoadingAnimation/smallLoadingAnimation'
import React from 'react'

import {colors2} from "../Colors/colors.js"
import {Doughnut} from "react-chartjs-2";



export default function DoughNutChartq1(DParameter) {

     let myData = DParameter.QueueMessages;
    
     const [isLoading, setLoading] = React.useState(true)

     const [final, setfinal] = React.useState([])

     const allerrorcodes = ["400","401","429","404","403","405","409","415","500"]

     function step1Fun(errorcode) {
          return new Promise((resolve, reject) => {
               let c = 0
               for (let i = 0; i < myData.length; i++) {
                    if(myData[i].MessageAttributes.Error_Code.StringValue === errorcode)
                         c = c + 1
               }
               setfinal(final => [...final, {code: errorcode, count: c}])
               resolve("Step1Done")
          })
     }

     async function doWork() {
          let response1
          for (let i=0; i<allerrorcodes.length;i++){
               response1 = await step1Fun(allerrorcodes[i])
          }
          setLoading(false)
          console.log(response1)
     }

     React.useEffect(()=>{
          doWork()
     },[])

     // Preparing Color Palette for Chart as per number of queues.
     let colorp = [];
     let limit = 1;
     if (allerrorcodes.length <= 9) limit = 1;
     // else if (allerrorcodes.length <= 8) limit = 2;
     // else if (allerrorcodes.length <= 12) limit = 3;
     // else if (allerrorcodes.length <= 16) limit = 4;
     // else if (allerrorcodes.length <= 20) limit = 5;
     else if (allerrorcodes.length <= 18 & allerrorcodes.length > 18) limit = 2;
     
     for ( let i = 0; i < colors2.length; i++ ) {
          for ( let j = 0 ; j < limit ; j++ ) {
               colorp.push(colors2[i][j]);
          }
     }

     return (

          (isLoading === true)
          ?
          <Loading />
          :
          <>
          {console.log("final",final)}
          <Doughnut
               data = {{
                    labels: final.map((it,ke)=>(it.code)),
                    datasets: [{
                         label: 'Clickable',
                         data: final.map((it,ke)=>(it.count)),
                         backgroundColor: colorp,
                         borderColor: colorp,
                         borderWidth: 1
                    },],
               }}
               // height = {"400"}
               options = {{
                    maintainAspectRatio : false,
               }}
          />
          </>

     )
}