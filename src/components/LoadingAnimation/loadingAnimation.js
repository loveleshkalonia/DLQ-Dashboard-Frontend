// import LoadingSpin from "react-loading-spin"; // npm install react-loading-spin
import Navbar from '../Navbar/navbar';
import {Progress, Card, CardBody, Placeholder} from 'reactstrap'

export default function loadingFun() {

     const divstyle = {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zoom: '150%',
          paddingTop: '10px',
          // height: '25vh',
     }

     const divspace = {
          width: '10px'
     }
     
     return (
          <>   
               <Navbar />
               <Progress
                    animated
                    color="primary"
                    value={100}
               />
               <div style={divstyle}>
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
                    </div>
</>
     )

}