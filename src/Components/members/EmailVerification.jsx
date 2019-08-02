import React,{Component} from 'react';
import axios from 'axios'
import OtpInput from "react-otp-input";
import {MDBAlert}from 'mdbreact';
import {fn_resendCode, fn_validateCode} from "../functions/memberServices";
import Swal from "sweetalert2";

class EmailVerification extends Component{

    constructor(props){
        document.title = `${process.env.REACT_APP_BRAND}: Verify Account`;
        super(props);
        this.state = {
            fact:"",
            code:"",
            hasError:false,
            alert:null,
            btn:"Activate"
        };
        this.onChange = this.onChange.bind(this);
        this.onClickLink = this.onClickLink.bind(this);
        this.onActivate = this.onActivate.bind(this);
    }
    componentDidMount() {
        if(this.props.history.action!=="PUSH" || this.props.location.state === undefined){
             this.props.history.push('/');
        }else{
            axios.get('http://numbersapi.com/random/trivia')
                .then(data=>{
                    this.setState({
                        fact:data.data,
                    })
                });
        }

    }
    onClickLink(e){
        e.preventDefault();
        this.setState({
            alert:null
        });
        fn_resendCode(this.props.location.state._id)
            .then(()=>{
                this.setState({
                    alert:"Email was send"
                })
            }).catch(()=>{
                Swal.fire('Oops...', 'Something went wrong!', 'error')
        })

    }

    onChange(value){
        this.setState({
            code:value,
            hasError:!value
        })
    }

    onActivate(e) {
        this.setState({
            hasError: this.state.code.length !== 6
        });

        if (this.state.code.length === 6){
            this.setState({
                btn: "Checking...",
            });
            fn_validateCode(this.props.location.state._id, {code: this.state.code})
                .then(data => {

                    Swal.fire({
                        title: 'Hurrah.!',
                        text: 'Your account is activated please sign in again!',
                        type: 'success',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, Log in Please!',
                        cancelButtonText: 'No, I do not want to login'
                    }).then((result) => {
                        if (result.value) {
                            localStorage.setItem('user',data.data.user);
                            this.props.history.push('/');
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            this.props.history.push('/');
                        }
                    });

                    this.setState({
                        btn: "Activate",
                    })
                })
                .catch(err => {
                    err = err.response;
                    let status = err.status;
                    this.setState({
                        btn: "Activate",
                    });

                    if(status===500){
                        Swal.fire('Oops...', 'Something went wrong!', 'error')
                    }else if(status === 401){
                        this.props.history.push('/');
                    }else if(status === 400){
                        Swal.fire('Oops...', err.data.error, 'warning')
                    }else if(status===409){
                        Swal.fire({
                            title: 'Oops...',
                            text: err.data.error,
                            type: 'warning',
                            confirmButtonText: 'Resend Code!'
                        }).then((result) => {
                            fn_resendCode(this.props.location.state._id)
                                .then(()=>{
                                    Swal.fire(
                                        'Success!',
                                        'We have send you to new code',
                                        'success'
                                    )
                                }).catch(()=>{
                                Swal.fire('Oops...', 'Something went wrong!', 'error')
                            });
                        })
                    }
                })
        }
    }

    render() {
        return(
            <div className="container mb-2">
            <div className="mt-5 h2 text-success">Check your email!</div>
                {this.state.alert?<MDBAlert color={"success"}>{this.state.alert}</MDBAlert>:''}
                {this.props.location.state !== undefined ?
                    <div className="h4-responsive mt-4 font-weight-bold">Hi! {this.props.location.state.username},We’ve sent a confirmation code to {this.props.location.state.email}.
                        Enter it below to activate your account.<a href="/" onClick={this.onClickLink}>Click here to resend</a>
                    </div>:''}
                <div className="mt-5 mb-5">
                    <OtpInput
                        onChange={this.onChange}
                        numInputs={6}
                        inputStyle="divider-6"
                        separator={<span className="m-2"/>}
                        value={this.state.code}
                        hasErrored={this.state.hasError}
                        errorStyle="error-otp"
                        shouldAutoFocus={true}
                    />

                    <button className="btn btn-outline-success mt-3" onClick={this.onActivate}>{this.state.btn}</button>
                </div>
                {this.state.fact ?
                    <div className="alert alert-light border-info pl-3 pt-4 pb-4 pr-2">
                    <span className="h5">{this.state.fact}</span><br/>
                        <span className="text-dark font-smaller">Fact for your knowledge</span>
                    </div>:''}

                <div className="font-small text-dark copyright">
                    {process.env.REACT_APP_BRAND} © {new Date().getFullYear()}. Fact provided by <a href="http://numbersapi.com">NUMBERS API</a>
                </div>
            </div> )
    }
}
export default EmailVerification;
