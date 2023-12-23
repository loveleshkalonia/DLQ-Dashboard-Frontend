import {Doughnut} from "react-chartjs-2";

import {colors2} from "../Colors/colors.js"

export default function DoughNutChart(DParameter) {

     let myData = DParameter.QueueMessages;

     let Labels=[];
     let data=[];
     let  retriable = 0;

     for (let i = 0; i < myData.length; i++) {
          // console.log(myData[i].MessageAttributes.isMsgRetriable.StringValue)
          if(myData[i].MessageAttributes.isMsgRetriable.StringValue==="Yes") {
               retriable=retriable+1;
          }
     } 

     let nonretriable = (myData.length) - retriable;
     Labels = ["Retriable", "NonRetriable"]
     data = [retriable, nonretriable]

     // Preparing Color Palette for Chart as per number of queues.
     let colorp = [];
     let limit = 1;
     if (myData.length <= 9) limit = 1;
     // else if (myData.length <= 8) limit = 2;
     // else if (myData.length <= 12) limit = 3;
     // else if (myData.length <= 16) limit = 4;
     // else if (myData.length <= 20) limit = 5;
     else if (myData.length <= 18 & myData.length > 18) limit = 2;
     
     for ( let i = 0; i < colors2.length; i++ ) {
          for ( let j = 0 ; j < limit ; j++ ) {
               colorp.push(colors2[i][j]);
          }
     }
     console.log("Current Color Palette : ",colorp);

     return (

          <Doughnut
               data = {{
                    labels: Labels,
                    datasets: [{
                         label: 'Clickable',
                         data: data,
                         backgroundColor: colorp,
                         borderColor: colorp,
                         borderWidth: 1
                    },],
               }}
               // height = {"300"}
               options = {{
                    maintainAspectRatio : false,
                    // parsing: {
                    //      key : 'amount.msgCount'
                    // },
                    // onClick: OnClickAct
               }}
          />

     )
}