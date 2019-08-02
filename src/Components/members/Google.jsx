import React, {Component} from 'react';
import jwt from "jsonwebtoken";
import {MDBBtn, MDBCardBody, MDBIcon, MDBInput} from "mdbreact";
import {fn_0authCheck, fn_0authSignup, fn_usernameValidator} from "../functions/memberServices";
import {ScaleLoader as Spinner} from "react-spinners";

class Google extends Component {
    constructor(props) {
        super(props);
        this.state={
            user:{},
            bg_img: "",
            errorUsername:"User Name is Required!",
            username:"",
            password:"",
            photographer:"",
            photographer_url:"",
            gender:"male",
            loadingText:"Loading...",
            loading:true

        };

        this.handleChange = this.handleChange.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]:e.target.value.trim(),
        });
        if(e.target.value===null || e.target.value===""){
            this.setState({
                errorUsername:"Username cannot be empty"
            });
        }else{
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
    }

        handleRadioChange(e){
        this.setState({
            gender:e.target.value
        });
    }
    componentDidMount() {
        document.title = "Continue with AskMe";
        let decoded = jwt.decode(this.props.match.params.user);
        delete decoded["iat"];
        this.setState({
            user:decoded,
            loading:true,
            loadingText:"Validating..."
        });

        fn_0authCheck(decoded.email)
            .then(data=>{
                data = data.data;
                this.setState({
                    loading:false
                });
                localStorage.setItem('user',data.token);
                this.props.history.push("/");
            })
            .catch(()=>{
                this.setState({
                    loading:false
                })
            })
    }
    onSubmit(){
        if(!this.state.errorUsername) {
            let user = this.state.user;
            user.username = this.state.username;
            user.gender = this.state.gender;

            fn_0authSignup(user)
                .then(data=>{
                    data =data.data;
                    localStorage.setItem('user',data.token);
                    this.props.history.push("/");
                })
        }
    }

    render() {
        let container = (<div>
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
                                            <div className="invalid-feedback">* Username is required.!</div>
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
                                            <MDBBtn color="blue darken-4" type="button" className="w-100" onClick={()=>this.onSubmit()}>
                                                Continue
                                            </MDBBtn>
                                        </div>
                                    </form>
                                </MDBCardBody>
                            </div>

                            <div className="text-center font-small text-dark">
                                {process.env.REACT_APP_BRAND} © {new Date().getFullYear()}. Photo by <a href={this.state.photographer_url}>{this.state.photographer}</a> on <a href="https://www.pexels.com">Pexel</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
        let loader = (
            <div className='sweet-loading'>
                <Spinner
                    sizeUnit={"px"}
                    size={150}
                    color={'#ff1744'}
                    loading={this.state.loading}
                />
                <h5>{this.state.loadingText}</h5>
            </div>
        );
        return (
            <div>
                {this.state.loading?loader:container}
            </div>
        );
    }

}

export default Google;
