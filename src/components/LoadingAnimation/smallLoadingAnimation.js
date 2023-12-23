// import LoadingSpin from "react-loading-spin"; // npm install react-loading-spin
// import Navbar from '../Navbar/navbar';
import {Progress} from 'reactstrap'

export default function loadingFun() {

     const divstyle = {
          // zoom: '150%',
          width: '40%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
     }

     // const divspace = {
     //      width: '10px'
     // }
     
     return (
          <>   
               {/* <Navbar /> */}

               <div style={divstyle}>
                    <Progress
                         animated
                         color="primary"
                         value={100}
                    />
               </div>

               {/* <div style={divstyle}>
                    <Card
                         style={{
                              width: '12rem'
                         }}
                    >
                         <CardBody>
                              <Placeholder
                                   animation="glow"
                              >
                                   <Placeholder xs={8} />
                              </Placeholder>
                              <Placeholder
                                   animation="glow"
                              >
                                   <Placeholder xs={12} />
                              </Placeholder>
                              <Placeholder
                                   animation="glow"
                              >
                                   <Placeholder xs={4} />
                              </Placeholder>
                         </CardBody>
                    </Card>
                    <div style={divspace}></div>
                    <Card
                         style={{
                              width: '12rem'
                         }}
                    >
                         <CardBody>
                              <Placeholder
                                   animation="glow"
                              >
                                   <Placeholder xs={8} />
                              </Placeholder>
                              <Placeholder
                                   animation="glow"
                              >
                                   <Placeholder xs={12} />
                              </Placeholder>
                              <Placeholder
                                   animation="glow"
                              >
                                   <Placeholder xs={4} />
                              </Placeholder>
                         </CardBody>
                    </Card>
                    </div> */}
</>
     )

}