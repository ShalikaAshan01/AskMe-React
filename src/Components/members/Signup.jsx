import React, {Component} from 'react';
import {MDBBtn, MDBCardBody, MDBIcon, MDBInput} from 'mdbreact';
import Particles from 'particlesjs';
import Swal from 'sweetalert2'
import '../CSS/md-radio.scss';
import {fn_emailValidator, fn_signup, fn_usernameValidator} from '../functions/memberServices'
import {fn_getimage} from "../functions/backgroundServices";

const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
class Signup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bg_img: "",
            firstName:"",
            lastName:"",
            email:"",
            gender:"male",
            password:"",
            confirmPassword:"",
            username:"",
            errorFirstName:"First Name is Required!",
            errorLastName:"Last Name is Required!",
            errorUsername:"User Name is Required!",
            errorEmail:"Email Address is Required!",
            errorPassword:"Password is Required!",
            errorConfirmPassword:"Confirm Password is Required!",
            continue:false,
            btnSignup:"Sign up with email",
            photographer:"",
            photographer_url:"",
            checkbox:false
        };
        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleCheckboxChange= this.handleCheckboxChange.bind(this);

    }

    componentDidMount() {
        document.title = process.env.REACT_APP_BRAND + ": Register to the Site";

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
    handleCheckboxChange(e){
        this.setState({
            checkbox:e.target.checked
        })
    }

    handleChange(e) {
        this.setState({
            [e.target.name]:e.target.value.trim(),
        });

        if(e.target.value===null || e.target.value === ""){
            let element = e.target.name;
            element = element.charAt(0).toUpperCase() + element.slice(1);
            let name =
                element==="FirstName"?'First Name' :
                    element==="LastName"? "Last Name":
                    element==="Username"? "User Name":
                    element==="Username"? "User Name":
                    element==="ConfirmPassword"? "Confirm Password": element;
            let errorState = "error" + element;
            this.setState({
                [errorState]: name + " is Required!",
                
            })
        }else{
            let element = e.target.name;
            element = element.charAt(0).toUpperCase() + element.slice(1);
            let errorState = "error" + element;
            this.setState({
                [errorState]: null,
                
            })
        }

        if(e.target.name==="email"){
            if( emailRegex.test(e.target.value.toLowerCase())){
                this.setState({
                    errorEmail:"Checking..."
                });
                fn_emailValidator(e.target.value)
                    .then(data=>{
                        this.setState({
                            errorEmail:data.data.message
                        });
                    }).catch(()=>{
                    this.setState({
                        errorEmail:null
                    });
                    console.clear();
                })
            }else{
                this.setState({
                    errorEmail:"Invalid Email Address..."
                })
            }
        }

        if(e.target.name==="confirmPassword"){
            this.setState({
                errorConfirmPassword:this.state.password===e.target.value? null : "Password doesn't match",
                
            });
            if(this.state.password === null || this.state.password===""){
                this.setState({
                    errorConfirmPassword:"Password doesn't match",
                    
                })
            }
        }

        if(e.target.name==="password"){
            this.setState({
                errorConfirmPassword:this.state.confirmPassword===e.target.value? null : "Password doesn't match",
                errorPassword: passwordRegex.test(e.target.value.toLowerCase())? null : "Password must have one uppercase letter, one lowercase letter, one number and one character!",
                
            });
            if(e.target.value === null || e.target.value===""){
                this.setState({
                    errorConfirmPassword:"Password doesn't match",
                    
                })
            }
            if(e.target.value.length > 16){
                this.setState({
                    errorPassword:"Password length must have 16",
                    
                })
            }else if(e.target.value < 6){
                this.setState({
                    errorPassword:"Password length at least 6",
                    
                })
            }
        }

        if(e.target.name==="username"){
            this.setState({
                errorUsername:"Checking..."
            });
            fn_usernameValidator(e.target.value)
                .then(data=>{
                    this.setState({
                        errorUsername:data.data.message
                    });
                }).catch(()=>{
                this.setState({
                    errorUsername:null
                });
                console.clear();
            })
        }
    }

    handleRadioChange(e){
        this.setState({
            gender:e.target.value
        });
    }
    handleSignUp(){
        let success = this.state.errorFirstName===null && this.state.errorLastName === null &&
            this.state.errorUsername === null && this.state.errorEmail === null &&
            this.state.errorPassword === null && this.state.errorConfirmPassword===null;

        let canContinue = this.state.errorFirstName===null && this.state.errorLastName === null &&
            this.state.errorUsername === null && this.state.errorEmail === null;

        if(!this.state.continue &&canContinue){
            this.setState({
                continue:true
            })
        }else if(success && this.state.checkbox){
            this.setState({
                btnSignup:"Creating..."
            });
            let payload = {
                firstName:this.state.firstName,
                lastName:this.state.lastName,
                username:this.state.username,
                email:this.state.email,
                password:this.state.password,
                gender:this.state.gender,
            };
            fn_signup(payload)
                .then(data=>{
                    this.setState({
                        btnSignup:"Sign up with email"
                    });

                    this.props.history.push('/members/verify',{
                        email:data.data.user.email,
                        _id:data.data.user._id,
                        username : `${data.data.user.firstName} ${data.data.user.lastName}`
                    });
                })
                .catch(()=>{
                    this.setState({
                        btnSignup:"Sign up with email"
                    });
                    Swal.fire('Oops...', 'Something went wrong!', 'error')
                })
        }
    }
    render() {
        let signup1=(
            <div>
            <div className="row">
                <div className="col-6">
                    <MDBInput
                        label="First Name"
                        icon="user"
                        group
                        type="text"
                        validate
                        success="right"
                        name="firstName"
                        value={this.state.firstName}
                        onChange={this.handleChange}
                        className={this.state.errorFirstName?'is-invalid':'is-valid'}
                    >
                        <div className="valid-feedback">Valid FirstName!</div>
                        <div className="invalid-feedback">{this.state.errorFirstName}</div>
                    </MDBInput>
                </div>
                <div className="col-6">
                    <MDBInput
                        label="Last Name"
                        icon="user"
                        group
                        type="text"
                        validate
                        success="right"
                        name="lastName"
                        value={this.state.lastName}
                        onChange={this.handleChange}
                        className={this.state.errorLastName?'is-invalid':'is-valid'}
                    >
                        <div className="valid-feedback">Valid LastName!</div>
                        <div className="invalid-feedback">{this.state.errorLastName}</div>
                    </MDBInput>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <MDBInput
                        label="Username"
                        icon="user"
                        group
                        type="text"
                        validate
                        success="right"
                        name="username"
                        value={this.state.username}
                        onChange={this.handleChange}
                        className={this.state.errorUsername?'is-invalid':'is-valid'}
                    >
                        <div className="valid-feedback">Valid UserName!</div>
                        <div className="invalid-feedback">{this.state.errorUsername}</div>
                    </MDBInput>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <MDBInput
                        label="Email Address"
                        icon="envelope"
                        group
                        type="email"
                        validate
                        success="right"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        className={this.state.errorEmail?'is-invalid':'is-valid'}
                    >
                        <div className="valid-feedback">Valid Email Address!</div>
                        <div className="invalid-feedback">{this.state.errorEmail}</div>
                    </MDBInput>
                </div>
            </div>
        </div>);
        let signup2=(
            <div>
            <div className="row">
                <div className="col-12 row">

                    <div className="md-radio col-3">
                        <input id="1" value="male" type="radio" name="gender" defaultChecked onChange={this.handleRadioChange}/>
                        <label htmlFor="1">Male</label>
                    </div>
                    <div className="md-radio col-3">
                        <input id="2" type="radio" name="gender" value="female" onChange={this.handleRadioChange}/>
                        <label htmlFor="2">Female</label>
                    </div>
                    <div className="md-radio col-5">
                        <input id="3" type="radio" name="gender" value="unknown" onChange={this.handleRadioChange}/>
                        <label htmlFor="3">Rather not say</label>
                    </div>

                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <MDBInput
                        label="Password"
                        icon="lock"
                        group
                        type="text"
                        validate
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        className={this.state.errorPassword?'is-invalid':'is-valid'}
                    >
                        <div className="valid-feedback">Valid Password!</div>
                        <div className="invalid-feedback">{this.state.errorPassword}</div>
                    </MDBInput>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <MDBInput
                        label="Confirm Password"
                        icon="lock"
                        group
                        type="password"
                        validate
                        name="confirmPassword"
                        value={this.state.confirmPassword}
                        onChange={this.handleChange}
                        className={this.state.errorConfirmPassword?'is-invalid':'is-valid'}
                    >
                        <div className="valid-feedback">Password match!</div>
                        <div className="invalid-feedback">{this.state.errorConfirmPassword}</div>
                    </MDBInput>
                    <div className="ml-4">
                        <input type="checkbox" className="custom-control-input" id="defaultUnchecked"  onChange={this.handleCheckboxChange}/>
                        <label className={this.state.checkbox?'text-success custom-control-label':'text-danger custom-control-label' } htmlFor="defaultUnchecked">I agree to the terms and conditions</label>
                    </div>

                </div>
            </div>
        </div>);
        return (
            <div>
                <canvas className="background" style={{backgroundImage: 'url(' + this.state.bg_img + ')'}}>

                </canvas>

                <div className="container">
                    <div className="mt-1">
                        <div className="row">
                            <div className="col-3"/>
                            <div className="col-6">
                                <div className="card signin">
                                    <MDBCardBody>
                                        <p className="h4 d-flex-inline text-center">
                                                Sign Up
                                        </p>
                                            <div className="black-text">
                                                {!this.state.continue?signup1:signup2}
                                            </div>
                                            <div className="text-center">
                                                <MDBBtn color="primary" className="w-100 waves-button" onClick={this.handleSignUp}>
                                                    <MDBIcon
                                                        icon=    {!this.state.continue?'forward':'envelope'}
                                                        className="pr-1"/>
                                                    {!this.state.continue?'Continue':this.state.btnSignup}
                                                </MDBBtn>
                                                {!this.state.continue?<a href="/signin" className="text-dark text-underline-hover">Already have an Account? Sign in here</a>:''}
                                            </div>
                                    </MDBCardBody>
                                </div>

                                <div className="text-center font-small text-dark">
                                    {process.env.REACT_APP_BRAND} © {new Date().getFullYear()}. Photo by <a href={this.state.photographer_url}>{this.state.photographer}</a> on <a href="https://www.pexels.com">Pexel</a>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Signup;
