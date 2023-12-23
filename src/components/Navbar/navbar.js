import React from 'react'
import {Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink, NavbarText, Collapse} from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

import { createBrowserHistory } from 'history'

const browserHistory = createBrowserHistory();

export default function ReactstrapNav() {

     var [date,setDate] = React.useState(new Date());
     React.useEffect(() => {
          var timer = setInterval(()=>setDate(new Date()), 1000 )
          return function cleanup() {
               clearInterval(timer)
          }
     });

     return (
          <>
               <Navbar
                    color="dark"
                    dark
                    expand
                    fixed="top"
                    full
               >
                    <NavbarBrand href="/" onClick={() => {{browserHistory.push({pathname: '/'})}; window.location.reload()}}>
                         SQS Monitor Dashboard
                    </NavbarBrand>

                    <NavbarToggler onClick={function noRefCheck(){}} />
                    <Collapse navbar>
                         <Nav
                         className="me-auto"
                         navbar
                         >
                         <NavItem>
                              <NavLink href="/" onClick={() => {{browserHistory.push({pathname: '/'})}; window.location.reload()}}>
                                   Home
                              </NavLink>
                         </NavItem>
                         {/* <NavItem>
                              <NavLink href="https://github.com/reactstrap/reactstrap">
                                   GitHub
                              </NavLink>
                         </NavItem> */}
                         {/* <UncontrolledDropdown
                              inNavbar
                              nav
                         >
                              <DropdownToggle
                              caret
                              nav
                              >
                              Options
                              </DropdownToggle>
                              <DropdownMenu right>
                              <DropdownItem>
                              Option 1
                              </DropdownItem>
                              <DropdownItem>
                              Option 2
                              </DropdownItem>
                              <DropdownItem divider />
                              <DropdownItem>
                              Reset
                              </DropdownItem>
                              </DropdownMenu>
                         </UncontrolledDropdown> */}
                         </Nav>
                         <NavbarText>
                              {date.toLocaleTimeString()}
                         </NavbarText>
                    </Collapse>

               </Navbar>
          </>
     )

}