import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { Container, Nav, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';

import Encode from './Encode';
import Decode from './Decode';

import 'bootstrap/dist/css/bootstrap.css';
import 'tui-image-editor/dist/tui-image-editor.css';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Container>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">Document defender</NavbarBrand>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/">Encode document</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/decode">Decode document</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </Container>
      <Switch>
        <Route path="/" exact>
          <Encode />
        </Route>
        <Route path="/decode">
          <Decode />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
