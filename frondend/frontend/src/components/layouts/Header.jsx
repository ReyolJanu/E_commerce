import React from "react";
import Search from "./Search";
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { DropdownButton, Dropdown, Image } from 'react-bootstrap';
import { logout } from "../../actions/userActions";

export default function Header() {

  const navigate =useNavigate();

  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logout);
  }

  const { isAuthenticated, user } = useSelector(state => state.authState);
  return (
    <div className="App">
      <nav className="navbar row">
        <div className="col-12 col-md-3">
          <Link to={'/'} >
            <div className="navbar-brand">
              <img width="50px" alt="logo" src="/logo.png" />
            </div>
          </Link>
        </div>

        <div className="col-12 col-md-6 mt-2 mt-md-0">
          <Search />
        </div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 d-flex align-items-center gap-2">

          {isAuthenticated ? (
            <Dropdown className="d-inline">
              <Dropdown.Toggle variant="default text-white pr-5" id="dropdown-basic" className="d-flex align-items-center gap-2">
                <figure className="avatar avatar-nav m-0">
                  <Image width="40px" height="40px" roundedCircle src={user.avatar ?? './images/default_avatar.jpg'} />
                </figure>
                <span>{user.name}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={()=>{navigate('/myprofile')}} className="text-dark">Profile</Dropdown.Item>
                <Dropdown.Item onClick={logoutHandler} className="text-danger">Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Link to="/login">
              <button className="btn" id="login_btn">Login</button>
            </Link>
          )}

          <div className="d-flex align-items-center gap-2">
            <span id="cart">Cart</span>
            <span id="cart_count">2</span>
          </div>

        </div>



      </nav>
    </div>
  )
}