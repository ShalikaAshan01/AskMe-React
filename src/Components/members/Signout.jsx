import React, {Component} from 'react';
import {MDBCard,MDBCardBody,MDBCardTitle,MDBCardText,MDBBtn} from 'mdbreact'
import jwt from 'jsonwebtoken'
class Signout extends Component {
    constructor(props) {
        super(props);
        document.title = `${process.env.REACT_APP_BRAND}: Sign out`;
        this.state = {
            name:""
        };
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        let decoded = jwt.decode(localStorage.getItem('user'));
        this.setState({
            name:`${decoded.firstName} ${decoded.lastName}`
        });
    }
    logout(){
        localStorage.clear();
        this.props.history.push('/');
    }

    render() {
        return (
            <div className="container">
                <MDBCard className="mt-5">
                    <MDBCardBody className="mt-5">
                        <MDBCardTitle>{process.env.REACT_APP_BRAND} : Signout</MDBCardTitle>
                        <MDBCardText>
                            You are already logged in as {this.state.name}, you need to log out before logging in as different user.
                        </MDBCardText>
                        <MDBBtn href="/" color="danger">Cancel</MDBBtn>
                        <MDBBtn onClick={Signout.logout}>Sign out</MDBBtn>
                    </MDBCardBody>
                </MDBCard>
            </div>
        );
    }

}

export default Signout;
