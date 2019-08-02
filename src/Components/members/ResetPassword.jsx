import React, {Component} from 'react';
import { ScaleLoader as Spinner} from 'react-spinners';
import {fn_changePassword, fn_validate_resetPassword} from "../functions/memberServices";
import {MDBAlert, MDBInput} from 'mdbreact'
import Swal from 'sweetalert2'

const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
class ResetPassword extends Component {
    constructor(props) {
        super(props);
        document.title = process.env.REACT_APP_BRAND + ": Reset Password";
        this.state = {
            loading:true,
            loadingText:"Validating...",
            password:"",
            confirmPassword:"",
            errorPassword:"Password is Required!",
            errorConfirmPassword:"Confirm Password is Required!",
            id:'',
            btn:"Change Password"
        };
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        fn_validate_resetPassword(this.props.match.params.hash,this.props.match.params.shortID)
            .then((data)=>{
                this.setState({
                    loading:false,
                    id:data.data.id
                })
            })
            .catch(()=>{
                this.setState({
                    loading:false
                });
                this.props.history.push('/errors/404');
            })
    }
    handleChange(e) {
        this.setState({
            [e.target.name]:e.target.value.trim(),
        });
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
    }
    onSubmit(e){
        e.preventDefault();
        this.setState({
            btn:"Changing..."
        });
        if(this.state.errorConfirmPassword === null && this.state.errorConfirmPassword === null){
            fn_changePassword(this.state.id,{password:this.state.password})
                .then(()=>{
                    this.setState({
                        btn:"Change Password"
                    });
                    Swal.fire({
                        title: 'Hurrah.!',
                        text: 'Your Password have been changed.!',
                        type: 'success',
                        confirmButtonText: 'Click here to Login',
                    }).then(() => {
                            this.props.history.push('/signin');

                    });
                })
                .catch(()=>{
                    this.setState({
                        btn:"Change Password"
                    });
                    Swal.fire('Oops...', 'Something went wrong!', 'error')
                })
        }
    }

    render() {
        let form = (
            <div>
                <h2 className="ml-3 mt-3">Rest Password</h2>
                <MDBAlert color="warning" >
                    <h2>Simplify your life.</h2>
                    <p>
                        <strong>LastPass</strong> remembers all your passwords, so you don't have to.
                        Check it out
                    </p>
                    <span className="font-smaller">Sponsored by LastPass</span>
                </MDBAlert>
                <form>

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
                        </div>
                        <button className="w-100 btn btn-success" onClick={this.onSubmit}>{this.state.btn}</button>
                    </div>
                </form>
            </div>
        );
        return (
            <div className="container">
                {this.state.loading?
                    <div className='sweet-loading'>
                    <Spinner
                    sizeUnit={"px"}
                    size={150}
                    color={'#ff1744'}
                    loading={this.state.loading}
                    />
                    <h5>{this.state.loadingText}</h5>
                    </div>
                    :
                    form
                }
            </div>
        );
    }

}

export default ResetPassword;
