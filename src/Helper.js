import React from 'react';
import axios from 'axios';

import 'reactjs-popup/dist/index.css';
import Loading from './components/LoadingAnimation/loadingAnimation';
import { ToastContainer, toast } from 'react-toastify';   // npm install --save react-toastify
import 'react-toastify/dist/ReactToastify.css';           // npm install --save react-toastify
import './App.css'

import QueuePageChart1 from './components/Charts/queuePageChart-1'
import QueuePageChart2 from './components/Charts/queuePageChart-2'
import JSONPretty from 'react-json-pretty'; // npm install --save react-json-pretty

import {
  Card, CardTitle, Table, Badge, Button,
  UncontrolledPopover, PopoverHeader, PopoverBody,
  ModalHeader, ModalBody, ModalFooter, Modal,
  UncontrolledTooltip
} from 'reactstrap'


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
  margin: "auto",
  // overflow: "scroll",
  // height:"600px",
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
  toast.info("Request Sent. Please Wait...", { position: toast.POSITION.TOP_CENTER, autoClose: notiTimeout })
}

const nothingSelectedNotify = () => {
  toast.warn("Nothing Selected", { position: toast.POSITION.TOP_CENTER, autoClose: notiTimeout })
}

const deleteRequestNotify = () => {
  toast.success("Selected Items Deleted Successfully! Refreshing Page...", { position: toast.POSITION.TOP_CENTER, autoClose: notiTimeout })
}

const purgeRequestNotify = () => {
  toast.success("Queue Purged Successfully! Refreshing Page...", { position: toast.POSITION.TOP_CENTER, autoClose: notiTimeout })
}

const exportToMainRequestNotify = () => {
  toast.success("Selected Items Exported Successfully! Refreshing Page...", { position: toast.POSITION.TOP_CENTER, autoClose: notiTimeout })
}

const actionFailedNotify = () => {
  toast.error("Request Failed", { position: toast.POSITION.TOP_CENTER, autoClose: notiTimeout + 1000 })
}

// ************************************************** BACKEND URLs **************************************************

var muleGetQueueMessages = "http://localhost:8081/Queue/"
var mulePurgeQueue = "http://localhost:8081/Queue/Purge/"
var muleDeleteQueueMessages = "http://localhost:8081/Queue/Delete/"
var muleTransferQueueMessages = "http://localhost:8081/Queue/Transfer/"
var mainQueueName = "main-dlq.fifo"

// ******************************************************************************************************************

export default class SQSMessagesList extends React.Component {

  state = {
    qmessages: [],
    MasterChecked: false,
    SelectedList: [],

    qname: window.history.state.state.WindowVarQname, // From Interpage
    qcount: [],

    Loaded: "Loading",
    refreshTimeout: 5000, // This will set the time (in ms) to wait before page is refreshed. Keep this greater than notiTimeout
    CopyButtonText: "Copy",

    modaldelete: false,
    modalpurge: false,
    modalexport: false,
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
    this.setState({ CopyButtonText: "Copied!" })
    setTimeout(() => {
      this.setState({ CopyButtonText: "Copy" })
    }, 2000)
  }

  fetchData() {
    this.setState({ qmessages: [] });
    let a = axios.get(muleGetQueueMessages + this.state.qname)
      .then(res => {
        const qmessagestemp = res.data.firstTenMessages;
        this.setState({ SelectedList: [] });
        for (var i = 0, len = this.state.qmessages.length; i < len; ++i) {
          qmessagestemp[i]["selected"] = false;
        }
        console.log("Queue =", this.state.qname, "; Approx Msg Count =", res.data.approxMsgCount);
        this.setState({ qmessages: qmessagestemp, qcount: res.data.approxMsgCount });
      })

    Promise.all([a])
      .then(() => { this.setState({ Loaded: "Loaded" }); })
  }

  afterToast() {
    setTimeout(() => {
      this.setState({ Loaded: "Loading" })
      this.setState({ qcount: 0, qmessages: [] })
      setTimeout(() => { this.fetchData() }, 2000)
    }, this.state.refreshTimeout)
  }

  componentDidMount() {
    this.fetchData();
  }

  onMasterCheck(e) {

    let tempList = this.state.qmessages;

    tempList.map((user) => (user.selected = e.target.checked));

    //Update State
    this.setState({
      MasterChecked: e.target.checked,
      qmessages: tempList,
      SelectedList: this.state.qmessages.filter((e) => e.selected),
    });
  }

  onItemCheck(e, item) {
    let tempList = this.state.qmessages;
    tempList.map((user) => {
      if (user.id === item.id) {
        user.selected = e.target.checked;
      }
      return user;
    });

    //To Control Master Checkbox State
    const totalItems = this.state.qmessages.length;
    const totalCheckedItems = tempList.filter((e) => e.selected).length;
    // let receipthandles=[];

    // Update State
    this.setState({
      MasterChecked: totalItems === totalCheckedItems,
      qmessages: tempList,
      SelectedList: this.state.qmessages.filter((e) => e.selected),
    });
  }

  Transfer_to_main(messages) {
    requestSentNotify();
    const message_ids = [];
    console.log("Messages Export", messages)
    // Extracting Message Ids out of incoming messages to an array
    for (var i = 0, len = messages.length; i < len; ++i) {
      message_ids.push((messages[i].id))
    }
    console.log("Selected Message Ids = ", message_ids)
    // Pass the array of message ids to endpoint which is dybamically generated
    axios({
      method: "post",
      url: muleTransferQueueMessages + "?srcQueue=" + this.state.qname + "&destQueue=" + mainQueueName,
      data: message_ids,
      headers: { "Content-Type": "application/json" },
    })
      .then(response => {
        console.log(response);
        //handle success
        if (
          (response.data.deleteFromSrcQueue.successful.length === message_ids.length) &&
          (response.data.sendToDestQueue.successful.length === message_ids.length)
        ) { exportToMainRequestNotify(); this.afterToast(); }
        //handle error
        else { actionFailedNotify(); }
      })
  }

  Purge_queue() {
    requestSentNotify();
    axios({
      method: "get",
      url: mulePurgeQueue + this.state.qname
    })
      .then(response => {
        console.log(response);
        //handle success
        if (response.data.message === this.state.qname + " has been purged.") { purgeRequestNotify(); this.afterToast(); }
        //handle error
        else { actionFailedNotify(); }
      })
  }

  Delete_items(messages) {
    requestSentNotify();
    const message_ids = [];
    console.log("Messages Delete", messages)
    // Extracting Message Ids out of incoming messages to an array
    for (var i = 0, len = messages.length; i < len; ++i) {
      message_ids.push((messages[i].id))
    }
    console.log("Selected Message Ids = ", message_ids)
    // Pass the array of message ids to endpoint which is dybamically generated
    axios({
      method: "post",
      url: muleDeleteQueueMessages + this.state.qname,
      data: message_ids,
      headers: { "content-type": "application/json" },
    })
      .then(response => {
        console.log(response);
        //handle success
        if (response.data.successful.length === message_ids.length) { deleteRequestNotify(); this.afterToast(); }
        //handle error
        else { actionFailedNotify(); }
      })
  }

  getSelectedRows() {
    this.setState({
      SelectedList: this.state.qmessages.filter((e) => e.selected),
    });
  }

  render() {

    return (

      (this.state.Loaded === "Loading")
        ?
        <Loading />
        :
        <div style={divstyleparent} >
          <div style={divstyle}>
            <ToastContainer />
            {console.log("Rendering Class Component")}
            <div style={recenter}>
              <Card
                body
                style={{ maxWidth: '783px' }}
              >
                <div style={pstyle}>
                  <b>Queue Name:</b> {this.state.qname}<br /><b>Approx Msg Count:</b> {this.state.qcount}
                </div>
              </Card>
            </div>
            <div style={divspaceV}></div>
            <div style={recenter}>
              <div style={divstyleforcards}>
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
                    <QueuePageChart1 QueueMessages={this.state.qmessages} />
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
                  <CardTitle tag="h5">
                    Error Code Count
                  </CardTitle>
                  <div style={divcardchart}>
                    <QueuePageChart2 QueueMessages={this.state.qmessages} />
                  </div>
                </Card>
              </div>
            </div>
            <div style={divspaceV}></div>

            <div style={recenter}>
              <Card
                body
                style={{ maxWidth: "95%" }}
              >
                <div style={recenter}>
                  <CardTitle tag="h5">
                    First 10 Messages
                  </CardTitle>
                </div>
                <div style={divScroll}>
                  <Table
                    bordered
                    hover
                    responsive
                  >
                    <thead>
                      <tr>
                        <th scope="col" rowSpan="2" style={{ paddingLeft: "10px", paddingRight: "10px" }}>

                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={this.state.MasterChecked || false}
                            id="mastercheck"
                            onChange={(e) => this.onMasterCheck(e)}
                          />

                        </th>
                        <th scope="col" rowSpan="2">Message ID</th>
                        <th scope="col" rowSpan="2">Body</th>
                        <th scope="col" colSpan="6">Message Attributes</th>
                      </tr><tr>

                        <th>Retry Count</th>
                        <th>Error Code</th>
                        <th>Error Message</th>
                        <th>Msg Retriable</th>

                      </tr>
                    </thead>
                    <tbody>
                      {console.log("Table Data = ", this.state.qmessages)}
                      {this.state.qmessages.map((user, k) => (
                        <tr key={k} className={user.selected ? "selected" : ""}>
                          <td>
                            <input
                              type="checkbox"
                              checked={user.selected}
                              className="form-check-input"
                              id="rowcheck{user.id}"
                              onChange={(e) => this.onItemCheck(e, user)}
                            />
                          </td>
                          <td>{user.id}</td>
                          <td>
                            <Button id={"Popover" + (k + 1)} color="primary">View</Button>
                            {/* {console.log("Popover"+(k+1))} */}
                            <UncontrolledTooltip target={"Popover" + (k + 1)}>
                              Click to view message body
                            </UncontrolledTooltip>
                            <UncontrolledPopover
                              target={"Popover" + (k + 1)}
                              trigger='legacy'
                            >
                              <PopoverHeader>
                                Message ID:<br></br>{user.id}
                              </PopoverHeader>
                              <PopoverBody >
                                <div style={{ fontSize: "110%", overflow: "scroll", height: "350px", overflowX: "hidden" }}>
                                  <JSONPretty data={user.body} />
                                </div>
                                {/* <div style={{height: '15px'}}></div> */}
                                <hr></hr>
                                <Button id="CopyButton" color="primary" onClick={() => { navigator.clipboard.writeText(JSON.stringify(user.body, null, 2)); this.CopyButtonTextFun() }}>{this.state.CopyButtonText}</Button>
                                <UncontrolledTooltip target="CopyButton">
                                  Click to copy the contents to clipboard
                                </UncontrolledTooltip>
                              </PopoverBody>
                            </UncontrolledPopover>

                          </td>

                          <td>{user.messageAttributes.retryCount.stringValue}</td>

                          <td><div style={badgestyle}><Badge pill color="warning"><font color="black">{user.messageAttributes.errorCode.stringValue}</font></Badge></div></td>
                          <td>{user.messageAttributes.errorMessage.stringValue}</td>


                          {
                            user.messageAttributes.msgRetriable.stringValue === 'true' ?
                              <td><div style={badgestyle}><Badge pill color="success" text="light">{user.messageAttributes.msgRetriable.stringValue}</Badge></div></td>
                              :
                              <td><div style={badgestyle}><Badge pill color="danger" text="light">{user.messageAttributes.msgRetriable.stringValue}</Badge></div></td>

                          }

                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <div style={recenter}>
                  <div style={pstyle2}><p><b>{this.state.SelectedList.length}</b> Items Selected</p></div>
                </div>
                {/* Button to delete */}
                <div style={recenter}>

                  <Button id="Delete" color='primary' onClick={() => {
                    if (this.state.SelectedList.length !== 0) this.toggledelete()
                    else nothingSelectedNotify()
                  }}>Delete</Button>

                  <div style={divspace}></div>

                  <Button id="Purge" color='primary' onClick={this.togglepurge}>Purge</Button>

                  <div style={divspace}></div>

                  <Button id="Export" color='primary' onClick={() => {
                    if (this.state.SelectedList.length !== 0) this.toggleexport()
                    else nothingSelectedNotify()
                  }}>Export to Main</Button>

                  <div style={divspace}></div>

                  <Button id="Refresh" color='primary' onClick={() => {
                    this.setState({ Loaded: "Loading" }); this.fetchData();
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

                  <Modal funk isOpen={this.state.modaldelete} toggle={this.toggledelete}>
                    <ModalHeader toggle={this.toggledelete}>Delete</ModalHeader>
                    <ModalBody id="Delete">
                      <font color={'#d50000'}><b>WARNING:</b> You can't undo this action.</font><br></br>
                      Proceed to delete the selected message(s) permanently?<br></br>
                      <b>{this.state.SelectedList.length}</b> message(s) selected.
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" onClick={() => { this.toggledelete(); this.Delete_items(this.state.SelectedList); }} >Delete</Button>
                      <div style={{ width: "0px" }}></div>
                      <Button color="secondary" onClick={this.toggledelete}>Cancel</Button>
                    </ModalFooter>
                  </Modal>

                  <Modal funk isOpen={this.state.modalpurge} toggle={this.togglepurge}>
                    <ModalHeader toggle={this.togglepurge}>Purge Queue</ModalHeader>
                    <ModalBody>
                      <font color={'#d50000'}><b>WARNING:</b> You can't undo this action.</font><br></br>
                      Proceed to Purge/Delete all message(s) from <b>{this.state.qname}</b> queue permanently?
                      <br></br>
                      Approx <b>{this.state.qcount}</b> message(s) will be deleted.
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" onClick={() => { this.togglepurge(); this.Purge_queue(); }} >Purge</Button>
                      <div style={{ width: "0px" }}></div>
                      <Button color="secondary" onClick={this.togglepurge}>Cancel</Button>
                    </ModalFooter>
                  </Modal>

                  <Modal funk isOpen={this.state.modalexport} toggle={this.toggleexport}>
                    <ModalHeader toggle={this.toggleexport}>Export To Main Queue</ModalHeader>
                    <ModalBody id="Delete">
                      <font color={'#d50000'}><b>WARNING:</b> You can't undo this action.</font><br></br>
                      Proceed to move selected message(s) to the main queue?<br></br>
                      <b>{this.state.SelectedList.length}</b> message(s) selected.
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" onClick={() => { this.toggleexport(); this.Transfer_to_main(this.state.SelectedList); }} >Export</Button>
                      <div style={{ width: "0px" }}></div>
                      <Button color="secondary" onClick={this.toggleexport}>Cancel</Button>
                    </ModalFooter>
                  </Modal>

                </div>
              </Card>
            </div>



            <div>

            </div>
            <br></br>

            <div className="row">
              {/* <p>For Debugging Use Only:</p>
              <b>Selected Messages :</b>
              <code>{JSON.stringify(this.state.SelectedList)}</code> */}
            </div>

          </div>
        </div>
    )
  }
}


