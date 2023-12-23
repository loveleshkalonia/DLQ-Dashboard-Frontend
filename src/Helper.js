import React from 'react';
import axios from 'axios';
// import Popup from 'reactjs-popup';
// import {BrowserRouter as Router,Link,Route} from 'react-router-dom'
import 'reactjs-popup/dist/index.css';
import Loading from './components/LoadingAnimation/loadingAnimation';
import { ToastContainer, toast } from 'react-toastify';   // npm install --save react-toastify
import 'react-toastify/dist/ReactToastify.css';           // npm install --save react-toastify
import './App.css'
// import Interpage from './Inter';
// import table from './App.css'
import QueuePageChart1 from './components/Charts/queuePageChart-1'
import QueuePageChart2 from './components/Charts/queuePageChart-2'
import JSONPretty from 'react-json-pretty'; // npm install --save react-json-pretty
// import { createBrowserHistory } from 'history'

import {Card, CardTitle, Table, Badge, Button,
  UncontrolledPopover, PopoverHeader, PopoverBody,
  ModalHeader, ModalBody, ModalFooter, Modal,
  UncontrolledTooltip} from 'reactstrap'

// import Badge from 'react-bootstrap/Badge';
// import * as ReactBootStrap from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const browserHistory = createBrowserHistory();

const divstyleparent = {
  display: 'flex',
  paddingTop: '15px',
  alignItems: 'center',
  justifyContent: 'center',
  textalign: 'center'
}

const recenter = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const divstyle = {
  // display: 'flex',
  width: 'fit-content',
  alignItems: 'center',
  justifyContent: 'center',
}

const divstyleforcards = {
  display: 'flex',
  width: 'fit-content',
  alignItems: 'center',
  justifyContent: 'center',
}

const divcard = {
  width: '350px'
}

const divcardchart = {
  width: '350px',
  height: '350px'
}

const divspace = {
  width: '15px'
}

const divspaceV = {
  height: '15px'
}

const divScroll = {
  margin:"auto",
  overflow: "scroll",
  height:"600px",
  overflowX: "hidden"
}

const pstyle = {
  fontSize: '140%',
  textAlign: 'center',
}

const badgestyle = {
  fontSize: '120%',
}

const pstyle2 = {
  fontSize: '100%',
}

const notiTimeout = 4000 // This will set the duration (in ms) of pop up notification

const requestSentNotify = () => {
  toast.info("Request Sent. Please Wait...",{position:toast.POSITION.TOP_CENTER, autoClose: notiTimeout})
}

const nothingSelectedNotify = () => {
  toast.warn("Nothing Selected",{position:toast.POSITION.TOP_CENTER, autoClose: notiTimeout})
}

const deleteRequestNotify = () => {
  toast.success("Selected Items Deleted Successfully! Refreshing Page...",{position:toast.POSITION.TOP_CENTER, autoClose: notiTimeout})
}

const purgeRequestNotify = () => {
  toast.success("Queue Purged Successfully! Refreshing Page...",{position:toast.POSITION.TOP_CENTER, autoClose: notiTimeout})
}

const exportToMainRequestNotify = () => {
  toast.success("Selected Items Exported Successfully! Refreshing Page...",{position:toast.POSITION.TOP_CENTER, autoClose: notiTimeout})
}

const actionFailedNotify = () => {
  toast.error("Request Failed",{position:toast.POSITION.TOP_CENTER, autoClose: notiTimeout + 1000})
}

export default class PersonList extends React.Component {

  state = {
    persons: [],
    MasterChecked: false,
    SelectedList: [],
    Apidata: [],
    qname: window.history.state.state.WindowVarQname,
    qcount: [],
    // qcount: window.history.state.state.WindowVarQcount,
    Loaded: "Loading",
    refreshTimeout: 5000, // This will set the time (in ms) to wait before page is refreshed. Keep this greater than notiTimeout
    CopyButtonText: "Copy",

    modaldelete: false,    
    modalpurge: false,
    modalexport: false,

    qcountold: []

  }

  toggledelete = () => {
    this.setState({
      modaldelete: !this.state.modaldelete
    });
  }

  togglepurge = () => {
    this.setState({
      modalpurge: !this.state.modalpurge
    });
  }

  toggleexport = () => {
    this.setState({
      modalexport: !this.state.modalexport
    });
  }

  CopyButtonTextFun() {
    this.setState({CopyButtonText: "Copied!"})
    setTimeout(() => {
    this.setState({CopyButtonText: "Copy"})
    }, 2000)
  }

  fetchData() {
    this.setState({ persons: [] });
    let a = axios.get('http://127.0.0.1:5000/Queue/' + this.state.qname)
    .then(res => {
      const personstemp = res.data;
      console.log("Called Queue/",this.state.qname,"endpoint...");
      this.setState({ SelectedList: [] });
      for (var i = 0, len = this.state.persons.length; i < len; ++i) {
        personstemp[i]["selected"]=false;
      }
      this.setState({ persons: personstemp, qcount: personstemp.length});
    })

    // BELOW COMMENTED OUT CODE CAUSED DISCREPANCY IN MESSAGE COUNT AFTER DOING DELETE/EXPORT/PURGE OPERATIONS
    //
    // let b = axios.get('http://127.0.0.1:5000/Queue/msg_count/' + this.state.qname)
    // .then(res => {
    //   console.log("Called Queue/Active endpoint...");     
    //   // this.setState({qcount: res.data})
    //       // console.log("Message count of ", queuestemp[i].name, " = ", this.state.qcount)
    // })
    // Promise.all([a, b])

    Promise.all([a])
    .then( () => { this.setState({ Loaded: "Loaded" }); } )
  }

  afterToast() {
    setTimeout(() => {
      // this.setState({Loaded: "Loading"})
      // console.log("qcountold = ",this.state.qcountold)
      // setTimeout(()=>{
      // while(this.state.Loaded === "Loading") {
      //   console.log("While Loop Running")
      //     axios.get('http://127.0.0.1:5000/Queue/msg_count/' + this.state.qname)
      //     .then(res => {
      //       this.setState({qcount: res.data})
      //       if (this.state.qcount < this.state.qcountold)
      //         {this.fetchData()}
      //     })
      // }
      // }, 500)
      this.setState({Loaded: "Loading"})
      this.setState({qcount: 0, persons: []})
      setTimeout(()=>{this.fetchData()}, 2000)
    }, this.state.refreshTimeout)
  }

  componentDidMount() {
    this.fetchData();
  }
  
  onMasterCheck(e) {

    let tempList = this.state.persons;
   
    tempList.map((user) => (user.selected = e.target.checked));

    //Update State
    this.setState({
      MasterChecked: e.target.checked,
      persons: tempList,
      SelectedList: this.state.persons.filter((e) => e.selected),
    });
  }

  onItemCheck(e, item) {
    let tempList = this.state.persons;
    tempList.map((user) => {
      if (user.MessageId === item.MessageId) {
        user.selected = e.target.checked;
      }
      return user;
    });

    //To Control Master Checkbox State
    const totalItems = this.state.persons.length;
    const totalCheckedItems = tempList.filter((e) => e.selected).length;
    // let receipthandles=[];

    // Update State
    this.setState({
      MasterChecked: totalItems === totalCheckedItems,
      persons: tempList,
      SelectedList: this.state.persons.filter((e) => e.selected),
    });
  }

  Transfer_to_main(messages) {
    requestSentNotify();
    axios({
      method: "post",
      url: "http://127.0.0.1:5000/Queue/Transfer?src_q="+this.state.qname+"&dest_q=main",
      data: messages,
      headers: { "Content-Type": "application/json" },
    })
      .then( response => {
        console.log(response);
        //handle success
        if (response.data === "messages deleted") { exportToMainRequestNotify(); this.afterToast();}
        //handle error
        else { actionFailedNotify(); }
      })
  }

  Purge_queue() {
    requestSentNotify();
    axios({
      method: "get",
      url: "http://127.0.0.1:5000/Queue/Purge/"+this.state.qname
    })
      .then( response => {
        console.log(response);
        //handle success
        if (response.data === "Deleted All Messages in Queue:" + this.state.qname) { purgeRequestNotify(); this.afterToast(); }
        //handle error
        else { actionFailedNotify(); }
      })
  }

  Delete_items(res={}) {
    const receipt_handles = [];
    console.log("Messages Delete",res)
    // Extracting Receipt handles out of incoming messages to an array
    for (var i = 0, len = res.length; i < len; ++i) {
      receipt_handles.push((res[i].ReceiptHandle))
    }
    console.log("Selected Receipt Handles = ",receipt_handles)
    //pass the array of receipt handles to endpoint which is dybamically generated
    if (receipt_handles.length > 0) {
      
      axios({
        method: "post",
        url: "http://127.0.0.1:5000/Queue/Del/"+this.state.qname,
        data: receipt_handles,
        headers: { "Content-Type": "application/json" },
      })
        .then( response => {
          requestSentNotify();
          console.log(response);
          //handle success
          if (response.data === "messages deleted") { this.setState({qcountold: this.state.qcount}); deleteRequestNotify(); this.afterToast(); }
          //handle error
          else { actionFailedNotify(); }
        })
    }
    else {
      nothingSelectedNotify();
    }
  }  

  getSelectedRows() {
    this.setState({
      SelectedList: this.state.persons.filter((e) => e.selected),
    });
  } 
  
  render() {

    return (

      (this.state.Loaded === "Loading")
      ?
      <Loading />
      :
      <div style = {divstyleparent} >
        <div style = {divstyle}>
        {console.log("CopyButtonText = ", this.CopyButtonText)}
        <ToastContainer />
        {console.log("Rendering Class Component")}
          <div style={recenter}>
          <Card
            body
            style={{maxWidth: '783px'}}
          >
          <div style = {pstyle}>
            <b>Queue Name:</b> {this.state.qname}<br/><b>Message Count:</b> {this.state.qcount}
          </div>
          </Card>
          </div>
          <div style={divspaceV}></div>
          <div style={recenter}>
            <div style = {divstyleforcards}>
              <Card
                body
                className="text-center"
                style={{
                  width: 'fit-content',
                }}
              >
                <div style={divcard}>
                  <CardTitle tag="h5">
                    Retriable Message Count
                  </CardTitle>
                </div>
                <div style={divcardchart}>
                  <QueuePageChart1 QueueMessages = {this.state.persons}/>
                </div>
              </Card>
              <div style={divspace}></div>
              <Card
                body
                className="text-center"
                style={{
                  width: 'fit-content',
                }}
              >
                <div style={divcard}>
                  <CardTitle tag="h5">
                    Error Code Count
                  </CardTitle>
                </div>
                <div style={divcardchart}>
                  <QueuePageChart2 QueueMessages = {this.state.persons}/>
                </div>
              </Card>
            </div>
          </div>
          <div style={divspaceV}></div>
        {/* <div className="row">
          <div className="col-md-12"> */}
            {/* <div style = {pstyle}><p><b>Queue Name:</b> {this.state.qname}<br/><b>Message Count:</b> {Object.keys(this.state.persons).length}</p></div> */}
            {/* <h3>Queuename:{this.state.qname}</h3>
            <h3>Message Count:{Object.keys(this.state.persons).length}</h3> */}
            <div style={recenter}>
            <Card
              body
              style={{maxWidth:"95%"}}
            >
            <div style={divScroll}>
            {/* <table >    */}
            <Table 
              bordered
              hover
              responsive
            >
            {/* <ReactBootStrap.Table > */}
              <thead>
                <tr>
                  <th scope="col" rowSpan="2" style={{paddingLeft:"10px", paddingRight:"10px"}}>
                    {/* <font color={"#1565c0"}>.</font> */}
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={this.state.MasterChecked}
                      id="mastercheck"
                      onChange={(e) => this.onMasterCheck(e)}
                    />
                    {/* <font color={"#1565c0"}>.</font> */}
                  </th>
                  <th scope="col" rowSpan="2" >Message ID</th>
                  <th scope="col" rowSpan="2">Body</th>
                  <th scope="col" colSpan="6">Message Attributes</th>
                  </tr><tr>
                  {/* <table className='nestedguy'>
                    <thead className='specialheader'>
                  */}    
                  <th>Redelivery Limit</th>
                  <th>Receive Count</th>
                  <th>Document Number</th>
                  <th>Error Code</th>
                  <th>Error Message</th>            
                  <th>Msg Retriable</th>
                  {/*                   
                    </thead>
                    </table> */}
                  {/*</th>
                    {/* <th scope="col">Attributes</th> */}
                </tr>
              </thead>
              <tbody>
                {console.log("Table Data = ", this.state.persons)}
                {this.state.persons.map((user, k) => (
                  <tr key = {k} className = {user.selected ? "selected" : ""}>
                    <td scope="row">
                      <input
                        type="checkbox"
                        checked={user.selected}
                        className="form-check-input"
                        id="rowcheck{user.id}"
                        onChange={(e) => this.onItemCheck(e, user)}
                      />
                    </td>
                    <td>{user.MessageId}</td>
                    <td>
                      <Button id={"Popover"+(k+1)} color="primary">View</Button>
                      {/* {console.log("Popover"+(k+1))} */}
                      <UncontrolledTooltip target={"Popover"+(k+1)}>
                        Click to view message body
                      </UncontrolledTooltip>
                      <UncontrolledPopover
                        target={"Popover"+(k+1)}
                        trigger='legacy'
                      >
                        <PopoverHeader>
                          Message ID:<br></br>{user.MessageId}
                        </PopoverHeader>
                        <PopoverBody >
                          <div style={{fontSize:"110%", overflow: "scroll", height:"350px", overflowX: "hidden"}}>
                            <JSONPretty data = {user.Body}/>
                          </div>
                          {/* <div style={{height: '15px'}}></div> */}
                          <hr></hr>
                          <Button id="CopyButton" color="primary" onClick={() =>{  navigator.clipboard.writeText(user.Body); this.CopyButtonTextFun() }}>{this.state.CopyButtonText}</Button>
                          <UncontrolledTooltip target="CopyButton">
                            Click to copy the contents to clipboard
                          </UncontrolledTooltip>
                        </PopoverBody>
                      </UncontrolledPopover>
                   
                      {/* <Popup trigger={a} contentStyle = {{ width: "25%" }} position = "right top" overlayStyle = {{ background: 'rgba(0, 0, 0, 0.25)' }}>
                        <div className = "div-1"><JSONPretty data = {user.Body}/>
                        <button className="btn btn-primary" onClick={() =>{  navigator.clipboard.writeText(user.Body); this.CopyButtonTextFun() }}>{this.state.CopyButtonText}</button>
                        </div>
                      </Popup> */}
                    </td>
                    {/* {console.log("exmaple of user.Body = ", user.Body)} */}
                    {/* <td>
                    <table className='nestedguy'>
                      <tbody>
                        <tr> */}
                    <td>{user.MessageAttributes.Redelivery_Limit.StringValue}</td>
                    <td>{user.MessageAttributes.Receive_Count.StringValue}</td>
                    <td>{user.MessageAttributes.Document_Number.StringValue}</td>
                    {/* <td>{user.MessageAttributes.Error_Code.StringValue}</td> */}
                    
                    <td><div style={badgestyle}><Badge pill color="warning"><font color="black">{user.MessageAttributes.Error_Code.StringValue}</font></Badge></div></td>
                    <td>{user.MessageAttributes.Error_Message.StringValue}</td>      

                  
                    {
                      user.MessageAttributes.isMsgRetriable.StringValue==='Yes'?
                      <td><div style={badgestyle}><Badge pill color="success" text="light">{user.MessageAttributes.isMsgRetriable.StringValue}</Badge></div></td>
                      :
                      <td><div style={badgestyle}><Badge pill color="danger" text="light">{user.MessageAttributes.isMsgRetriable.StringValue}</Badge></div></td>
                      
                    }




 

                     
                    {/* {
                      user.MessageAttributes.isMsgRetriable.StringValue=='Yes'?
                      <td><Badge pill bg="success" text="light">{user.MessageAttributes.isMsgRetriable.StringValue}</Badge></td>
                      :
                      <td><Badge pill bg="danger" text="light">{user.MessageAttributes.isMsgRetriable.StringValue}</Badge></td>
                      
                    } */}
                    {/* </tr>
                      </tbody>
                      </table>
                      </td>*/}
                    {/* <td>{user.Attributes}</td> */}
                  </tr>
                ))}
              </tbody>
            {/* </table> */}
            </Table>
            {/* </ReactBootStrap.Table> */}
            </div>
            <hr></hr>
            {/* </Card></div> */}
            {/* <div style={divspaceV}></div> */}
            {/* <div style={recenter}>
          <Card
            body
            style={{maxWidth:"fit-content"}}
          > */}
            <div style={recenter}>
            <div style={pstyle2}><p><b>{this.state.SelectedList.length}</b> Items Selected</p></div>
            </div>
            {/* Button to delete */}
            <div style={recenter}>
   
        <Button id="Delete" color='primary' onClick={ () => {
            if (this.state.SelectedList.length !== 0 ) this.toggledelete()
            else nothingSelectedNotify()
          }}>Delete</Button>

        <div style={divspace}></div>

        <Button id="Purge" color='primary' onClick={this.togglepurge}>Purge</Button>

        <div style={divspace}></div>

        <Button id="Export" color='primary' onClick={ () => {
            if (this.state.SelectedList.length !== 0 ) this.toggleexport()
            else nothingSelectedNotify()
          }}>Export to Main</Button>

        <div style={divspace}></div>

        <Button id="Refresh"color='primary' onClick={()=> {
          this.setState({Loaded: "Loading"}); this.fetchData();
          }}>Refresh Page</Button>

        <UncontrolledTooltip autohide={false} target="Delete">
          Deletes selected message(s) from queue
        </UncontrolledTooltip>

        <UncontrolledTooltip autohide={false} target="Purge">
          Deletes all message(s) from queue
        </UncontrolledTooltip>

        <UncontrolledTooltip autohide={false} target="Export">
          Moves selected message(s) to the main queue
        </UncontrolledTooltip>

        <UncontrolledTooltip autohide={false} target="Refresh">
          Refreshes the above data
        </UncontrolledTooltip>

        <Modal funk={true} isOpen={this.state.modaldelete} toggle={this.toggledelete}>
          <ModalHeader toggle={this.toggledelete}>Delete</ModalHeader>
          <ModalBody id="Delete">
            <font color={'#d50000'}><b>WARNING:</b> You can't undo this action.</font><br></br>
            Proceed to delete the selected message(s) permanently?<br></br>
            <b>{this.state.SelectedList.length}</b> message(s) selected.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => {this.toggledelete();this.Delete_items(this.state.SelectedList);}} >Delete</Button>
            <div style={{width:"0px"}}></div>
            <Button color="secondary" onClick={this.toggledelete}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal funk={true} isOpen={this.state.modalpurge} toggle={this.togglepurge}>
          <ModalHeader toggle={this.togglepurge}>Purge Queue</ModalHeader>
          <ModalBody>
            <font color={'#d50000'}><b>WARNING:</b> You can't undo this action.</font><br></br>
            Proceed to Purge/Delete all message(s) from <b>{this.state.qname}</b> queue permanently?
            <br></br>
            Total <b>{this.state.qcount}</b> message(s) will be deleted.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => {this.togglepurge();this.Purge_queue();}} >Purge</Button>
            <div style={{width:"0px"}}></div>
            <Button color="secondary" onClick={this.togglepurge}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Modal funk={true} isOpen={this.state.modalexport} toggle={this.toggleexport}>
          <ModalHeader toggle={this.toggleexport}>Export To Main Queue</ModalHeader>
          <ModalBody id="Delete">
            <font color={'#d50000'}><b>WARNING:</b> You can't undo this action.</font><br></br>
            Proceed to move selected message(s) to the main queue?<br></br>
            <b>{this.state.SelectedList.length}</b> message(s) selected.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => {this.toggleexport();this.Transfer_to_main(this.state.SelectedList);}} >Export</Button>
            <div style={{width:"0px"}}></div>
            <Button color="secondary" onClick={this.toggleexport}>Cancel</Button>
          </ModalFooter>
        </Modal>

      </div>
    </Card>
  </div>
            


            <div>
              {/* <button className="btn-home">
                <Link to={'/'} className = "homepagelink" onClick={() => {{browserHistory.push({pathname: '/'})}; window.location.reload()}}>Home Page</Link>
              </button> */}
              {/* <Popup trigger={<button> Click to open popup </button>} 
                position="right center">
                <div>{user.Body}</div>
                </Popup> */}
            </div>    
            <br></br>
            {/* <div className="row">
              <b>All Row Items:</b> */}
            {/* <code>{JSON.stringify(this.state.List)}</code> */}
            {/* </div> */}
            <div className="row">
              {/* <p>For Debugging Use Only:</p>
              <b>Selected Messages :</b>
              <code>{JSON.stringify(this.state.SelectedList)}</code> */}
              {/* //Button to Refresh the page       */}
              {/* <button onClick={() => {this.Delete_items(JSON.stringify(this.state.SelectedList));this.getSelectedRows()}}>Click to reload!</button> */}
            </div>
          {/* </div>
        </div> */}
        </div>
      </div>
    )
  }
}


