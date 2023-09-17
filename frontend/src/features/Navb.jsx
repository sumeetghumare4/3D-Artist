import React from "react";
import './Style/navbar.css'
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

const Navb = () => {
  return (
    <div>
      <Navbar bg="light" variant="light" expand="lg">
        <Container>
          <Navbar.Brand href="/" className="logo">Designdive</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <div className="header-btn">
              {/* This class aligns items to the right */}
              {/* Replace '#' with the actual URL */}
              <a
                className="btn-default btn-small round btn-grad"
                href="/generate"
              >
                Generate
              </a>
              {/*               <button type="submit" value="Generate" onClick={handleSubmit}></button> */}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Navb;
