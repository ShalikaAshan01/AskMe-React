import React, {Component} from 'react';
import {MDBInput, MDBBtn, MDBCardBody, MDBIcon, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter} from 'mdbreact';
import Particles from 'particlesjs';
import {fn_getimage} from "../functions/backgroundServices";
import { fn_login, fn_sendResetPasswordLink} from "../functions/memberServices";
import jwt  from 'jsonwebtoken';
import Swal from 'sweetalert2'


class Signin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bg_img: "",
            isError:false,
            username:"",
            password:"",
            photographer:"",
            photographer_url:"",
            modal: false,
            forgot:"",
            sendEmail:"Send Email"
        };
        this.handelSignin = this.handelSignin.bind(this);
        this.handelFacebook = this.handelFacebook.bind(this);
        Signin.handelGoogle = Signin.handelGoogle.bind(this);
        this.onChange = this.onChange.bind(this);
        this.sendLink= this.sendLink.bind(this);

    }

    componentDidMount() {
        document.title = process.env.REACT_APP_BRAND + ": Login to the Site";
        fn_getimage()
            .then(data=>{
                data = data.data;
                this.setState({
                    bg_img: data.src,
                    photographer:data.photographer,
                    photographer_url:data.photographer_url
                });
            })
            .catch(()=>{
                this.setState({
                    bg_img: "https://images.pexels.com/photos/2168974/pexels-photo-2168974.jpeg",
                    photographer:"Mohamed Almari",
                    photographer_url:"https://www.pexels.com/@maoriginalphotography"
                });
            });
        Particles.init({
            selector: '.background',
            speed: 1,
            color: "#ffffff",

        });

    }
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    sendLink(e){
        this.setState({
            sendEmail:"Sending..."
        });
        fn_sendResetPasswordLink(this.state.forgot)
            .then(()=>{
                this.setState({
                    sendEmail:"Send Email",
                    modal:false
                });
                Swal.fire('Great...', 'We send you to email', 'success')
            })
            .catch(()=>{
                this.setState({
                    sendEmail:"Send Email",
                    modal:false
                });
                Swal.fire('Oops...', 'Something went wrong!', 'error')
            })
    }

    onChange(e){
        this.setState({
            [e.target.name]:e.target.value.trim()
        })
    }

    handelSignin(){
        let payload = {
            username : this.state.username,
            password : this.state.password,
        };
        fn_login(payload)
            .then(data=>{
                let token = data.data.token;

                if(data.data.activated){
                    localStorage.setItem('user',token);

                    let to="/";
                    if(this.props.location.state!== undefined)
                        to = this.props.location.state.from=== undefined?'/':this.props.location.state.from;
                    this.props.history.push(to);
                }else{
                    let decoded = jwt.decode(token);

                    this.props.history.push('/members/verify',{
                        email:decoded.email,
                        _id:decoded._id,
                        username : `${decoded.firstName} ${decoded.lastName}`
                    });
                }


            })
            .catch(()=>{
                this.setState({
                    isError:true
                })
            })

    }
    handelFacebook(){
        window.open("https://askme-248409.appspot.com/users/auth/facebook", "_self");
    }
    static handelGoogle(){
            window.open("https://askme-248409.appspot.com/users/auth/google", "_self");
    }

    render() {
        return (
            <div>
                <canvas className="background" style={{backgroundImage: 'url(' + this.state.bg_img + ')'}}>

                </canvas>

                <div className="container">
                    <div className="mt-4">
                        <div className="row">
                            <div className="col-3"/>
                            <div className="col-6">
                                <div className="card signin">
                                    <MDBCardBody>
                                        <form>
                                            <p className="h4 text-center py-4">Sign In</p>
                                                {this.state.isError?
                                                    <div className="text-center alert alert-warning ml-2" role="alert">
                                                    <span>
                                                    <MDBIcon icon="exclamation-triangle" /> Invalid username or password
                                                    </span></div>:''}
                                            <div className="black-text">
                                                <MDBInput
                                                    label="Enter Your Email or Username"
                                                    icon="user"
                                                    group
                                                    type="text"
                                                    validate
                                                    error="wrong"
                                                    success="right"
                                                    className={!this.state.username?'is-invalid':''}
                                                    onChange={this.onChange}
                                                    name="username"
                                                    value={this.state.username}
                                                >
                                                    <div className="invalid-feedback">* Username is required.!</div>
                                                </MDBInput>
                                                <MDBInput
                                                    label="Enter Your password"
                                                    icon="lock"
                                                    group
                                                    type="password"
                                                    validate
                                                    className={!this.state.password?'is-invalid':''}
                                                    onChange={this.onChange}
                                                    name="password"
                                                    value={this.state.password}
                                                >
                                                    <div className="invalid-feedback">* Password is required.!</div>
                                                </MDBInput>
                                            </div>
                                            <div className="text-center">
                                                <MDBBtn color="primary" type="button" className="w-100" onClick={this.handelSignin}>
                                                    <MDBIcon icon="envelope" className="pr-1"/>
                                                    Sign in with email
                                                </MDBBtn>
                                                <MDBBtn color="red accent-4" type="button" className="w-100" onClick={Signin.handelGoogle}>
                                                    <MDBIcon fab icon="google" className="pr-1"/>
                                                    Continue with Google
                                                </MDBBtn>
                                                <MDBBtn color="blue darken-4" type="button" className="w-100" onClick={this.handelFacebook}>
                                                    <MDBIcon fab icon="facebook-f" className="pr-1"/>
                                                    Continue with Facebook
                                                </MDBBtn>
                                                <a href="/signup" className="text-dark text-underline-hover">Not on {process.env.REACT_APP_BRAND} Yet? Sign up Now</a>
                                                <br/>
                                                <p className="cursor-pointer text-success text-underline-hover" onClick={this.toggle}>Forgot Password?</p>
                                            </div>
                                        </form>
                                    </MDBCardBody>
                                </div>

                                <div className="text-center font-small text-dark">
                                    {process.env.REACT_APP_BRAND} © {new Date().getFullYear()}. Photo by <a href={this.state.photographer_url}>{this.state.photographer}</a> on <a href="https://www.pexels.com">Pexel</a>
                                </div>

                                {/*  Modal  */}
                                <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                                    <MDBModalHeader toggle={this.toggle}>Reset Password</MDBModalHeader>
                                    <MDBModalBody>
                                        <MDBInput label="Email Address" type="text" name="forgot" value={this.state.forgot} onChange={this.onChange}/>
                                    </MDBModalBody>
                                    <MDBModalFooter>
                                        <MDBBtn color="primary" onClick={this.sendLink}>{this.state.sendEmail}</MDBBtn>
                                    </MDBModalFooter>
                                </MDBModal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Signin;
