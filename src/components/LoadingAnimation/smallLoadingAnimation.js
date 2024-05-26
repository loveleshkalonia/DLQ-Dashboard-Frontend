import { Progress } from 'reactstrap'

export default function loadingFun() {

     const divstyle = {
          width: '40%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
     }

     return (
          <>

               <div style={divstyle}>
                    <Progress
                         animated
                         color="primary"
                         value={100}
                    />
               </div>


          </>
     )

}