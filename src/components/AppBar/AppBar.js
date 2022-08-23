import React from "react";
import "./AppBar.scss";
import {
  Container as BootstrapContainer,
  Row,
  Col,
  Button,
} from "react-bootstrap";

function AppBar(props) {
  return (
    <nav className="navbar-app">
      {/* <Row>
        <Col xs={12} md={8} className="col-no-padding">
          <div className="app-actions">
            <div className="item all">
              <i className="fa fa-th"></i>
            </div>
            <div className="logo-trello-app">
              <image alt="logo" />
            </div>
            <div className="app-bar-view">
              <p>Cac khong gian lam viec</p>
              <i className="fa fa-angle-down" aria-hidden="true"></i>
            </div>
            <div className="app-bar-view">
              <p>Gan day</p>
              <i className="fa fa-angle-down" aria-hidden="true"></i>
            </div>
            <div className="app-bar-view">
              <p>Da danh dau sao</p>
              <i className="fa fa-angle-down" aria-hidden="true"></i>
            </div>
            <div className="app-bar-view">
              <p>Mau</p>
              <i className="fa fa-angle-down" aria-hidden="true"></i>
            </div>
            <div>
              <Button>Tao moi</Button>
            </div>
          </div>
        </Col>
        <Col xs={6} md={4}></Col>
      </Row> */}
    </nav>
  );
}

export default AppBar;
