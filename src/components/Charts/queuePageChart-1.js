import { Doughnut } from "react-chartjs-2";

import { colors2 } from "../Colors/colors.js"

export default function DoughNutChart(DParameter) {

     let myData = DParameter.QueueMessages;

     let labels = [];
     let data = [];
     let retriable = 0;

     for (let i = 0; i < myData.length; i++) {
          if (myData[i].messageAttributes.msgRetriable.stringValue === "true") {
               retriable = retriable + 1;
          }
     }

     let nonretriable = (myData.length) - retriable;
     labels = ["Retriable", "NonRetriable"]
     data = [retriable, nonretriable]

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
     // console.log("Current Color Palette : ",colorp);

     return (
          <>
               {console.log("Queue Page :: Chart1 ::\nLabels", labels, "\nData", data)}
               <Doughnut
                    data={{
                         labels: labels,
                         datasets: [{
                              label: 'Clickable',
                              data: data,
                              backgroundColor: colorp,
                              borderColor: colorp,
                              borderWidth: 1
                         },],
                    }}
                    // height = {"300"}
                    options={{
                         maintainAspectRatio: false,
                         // parsing: {
                         //      key : 'amount.msgCount'
                         // },
                         // onClick: OnClickAct
                    }}
               />
          </>
     )
}