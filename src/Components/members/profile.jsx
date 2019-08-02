import React, {Component} from 'react';
import {fn_getUserByUSername, fn_sendResetPasswordLink, fn_updateProfile} from "../functions/memberServices";
import jwt from 'jsonwebtoken'
import {fn_getAnswerByUID, fn_getBestAnswerByUID} from "../functions/answerService";
import {MDBTabPane, MDBTabContent, MDBNav, MDBNavItem, MDBNavLink, MDBIcon, MDBInput} from 'mdbreact';
import md5 from "md5";
import '../CSS/card-style.css';
import {fn_getQuestionByUID} from "../functions/questionServices";
import moment from "moment";
import ReactHtmlParser from 'react-html-parser';
import Swal from "sweetalert2";

class profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user:{},
            private:false,
            answers:[],
            bestAnswers:[],
            questions:[],
            activeItem: "1",
            profilePic:"",
            gender:"",
            errorFirstName:"",
            errorLastName:"",
            firstName:"",
            lastName:""
        };
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    componentDidMount() {
        document.title = process.env.REACT_APP_BRAND +" : User Profile - "+this.props.match.params.username;

        //get user data
        fn_getUserByUSername(this.props.match.params.username)
            .then(data=>{
                let user = data.data.user;
                let gender = data.data.user.gender;
                user.gender = gender.charAt(0).toUpperCase() + gender.slice(1);

                if(gender==="male"){
                    document.getElementById("1").checked = true;
                }
                if(gender==="female"){
                    document.getElementById("2").checked = true;
                }
                if(gender==="unknown"){
                    document.getElementById("3").checked = true;
                }

                this.setState({
                    user:user,
                    gender:gender,
                    firstName:data.data.user.firstName,
                    lastName:data.data.user.lastName,
                    profilePic:`https://www.gravatar.com/avatar/${md5(data.data.user.email)}?d=wavatar`
                });

                let uid = data.data.user._id;
                fn_getAnswerByUID(uid)
                    .then(data=>{
                        this.setState({
                            answers:data.data.answers
                        })
                    });
                fn_getBestAnswerByUID(uid)
                    .then(data=>{
                        this.setState({
                            bestAnswers:data.data.answers
                        })
                    });
                fn_getQuestionByUID(uid)
                    .then(data=>{
                        // console.log(data.data.questions)
                        this.setState({
                            questions:data.data.questions
                        })
                    });
            })
            .catch(err=>{
                err = err.response;
                if(err.status===404)
                    this.props.history.push('/errors/404');
                if(err.status ===500)
                    this.props.history.push('/errors/500');
            });

        //check user's profile or not
        if(localStorage.getItem('user')) {
            let decoded = jwt.verify(localStorage.getItem('user'), process.env.REACT_APP_KEY);
            if(decoded){
                if(decoded.username===this.props.match.params.username)
                    this.setState({
                        private:true
                    })
            }
        }

    }
    toggle = tab => e => {
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
        }
    };
    handleRadioChange(e){
        this.setState({
            gender:e.target.value
        });
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value.trim(),
        });
        if(e.target.name==="firstName" && e.target.value===""){
            this.setState({
                errorFirstName:"First Name is Required"
            })
        }else{
            this.setState({
                errorFirstName:""
            })
        }
        if(e.target.name==="lastName" && e.target.value===""){
            this.setState({
                errorLastName:"Last Name is Required"
            })
        }else{
            this.setState({
                errorLastName:""
            })
        }
    }
    changePassword(){
        fn_sendResetPasswordLink(this.state.user.email)
            .then(()=>{
                Swal.fire('Great...', 'We send you to email', 'success')
            })
    }
    update(){
        let payload = {
            gender:this.state.gender,
            firstName:this.state.firstName,
            lastName:this.state.lastName,
        };

        let headers = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('user')
            }
        };
        fn_updateProfile(this.state.user._id,payload,headers)
            .then(()=>{
                this.componentDidMount();
            })
    }
    render() {
        return (
            <div className="container">
                <MDBNav className="nav-tabs mt-5">
                    <MDBNavItem>
                        <MDBNavLink to="#" active={this.state.activeItem === "1"} onClick={this.toggle("1")} role="tab" >
                            About
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink to="#" active={this.state.activeItem === "2"} onClick={this.toggle("2")} role="tab" >
                            Questions
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink to="#" active={this.state.activeItem === "3"} onClick={this.toggle("3")} role="tab" >
                            Answers
                        </MDBNavLink>
                    </MDBNavItem>
                    <MDBNavItem>
                        <MDBNavLink to="#" active={this.state.activeItem === "4"} onClick={this.toggle("4")} role="tab" >
                            Best Answers
                        </MDBNavLink>
                    </MDBNavItem>
                    {this.state.private?
                        <MDBNavItem>
                        <MDBNavLink to="#" active={this.state.activeItem === "5"} onClick={this.toggle("5")} role="tab" >
                            Settings
                        </MDBNavLink>
                    </MDBNavItem>
                    :''}
                </MDBNav>
                <MDBTabContent activeItem={this.state.activeItem} >
                    <MDBTabPane tabId="1" role="tabpanel">
                        <div className="row">
                            <div className="col-3 pt-4">

                                <div className="card bg-custom p-3">
                                    <img
                                        className="img-fluid z-depth-1 rounded-circle float-right double-border"
                                        src={this.state.profilePic} alt="Profile"/>
                                    <div className="text-center">
                                        <div className="h5 mt-1">
                                            {`${this.state.user.firstName} ${this.state.user.lastName}`}
                                        </div>
                                        <div className="h6 mt-1">
                                            {this.state.user.gender}
                                        </div>
                                        <p>{this.state.user.email}</p>
                                    </div>
                                </div>

                            </div>


                            <div className="col-9">
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="card-counter warning" onClick={this.toggle("2")}>
                                            <MDBIcon icon="question" />
                                            <span className="count-numbers">{this.state.questions.length}</span>
                                            <span className="count-name">Questions</span>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card-counter info" onClick={this.toggle("3")}>
                                            <MDBIcon far icon="edit" />
                                            <span className="count-numbers">{this.state.answers.length}</span>
                                            <span className="count-name">Answers</span>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card-counter success" onClick={this.toggle("4")}>
                                            <MDBIcon icon="check-double" />
                                            <span className="count-numbers">{this.state.bestAnswers.length}</span>
                                            <span className="count-name">Best Answers</span>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>
                    </MDBTabPane>
                    <MDBTabPane tabId="2" role="tabpanel">

                        {this.state.questions.map((value, index) => {
                            if(!this.state.private && value.user.anonymous==="true")
                                return false;
                            else
                                return(
                                <div key={index} className="mt-3">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="ml-3 cursor-pointer">
                                                <span className="question-asked">
                                                    Last Modified:<span className="question-asked-date">{moment(value.updated_at).format('MMMM Do YYYY, h:mm:ss a')}</span>
                                                </span>
                                            </div>
                                            <h5 className="card-title mt-2">
                                                <a className="question-text" target="_blank" rel="noopener noreferrer" href={`/questions/${value.question.split(' ').join('-').replace('?','')}`}>{value.question}</a>
                                            </h5>
                                            <div className="m-2">
                                                {value.tags.map((value1, index1) => {
                                                    return(
                                                        <a href={`/tag/${value1[0].name}`} key={index1}>
                                                    <span className="badge badge-question p-1 mr-2">
                                                    {value1[0].name}
                                                    </span>
                                                        </a>
                                                    )
                                                })}

                                            </div>
                                            <div className="question-footer w-100 pl-3">
                                                <div className="row">
                                                    <button type="button"
                                                            className={value.answered!==null?'btn btn-sm btn-outline-success waves-effect answer-btn':
                                                                'btn btn-sm btn-outline-mdb-color waves-effect no-answer-btn'
                                                            }
                                                    >
                                                        <MDBIcon far icon="comment" /> {value.answers} Answers
                                                    </button>
                                                    <button type="button" className="btn cursor-default btn-sm btn-outline-primary waves-effect ml-3 view-btn">
                                                        <MDBIcon icon="eye" /> {value.views} Views
                                                    </button>
                                                    <button type="button" className="btn cursor-default btn-sm btn-outline-black waves-effect ml-3">
                                                        <MDBIcon icon="poll" /> {value.vote.upVote.length-value.vote.downVote.length} Vote
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={
                                                            value.follow.some(item => item._id === this.state.id)?
                                                                'btn btn-sm btn-success waves-effect ml-3 star-btn-selected':
                                                                "btn btn-sm btn-outline-mdb-color waves-effect ml-3 star-btn"
                                                        }
                                                    >
                                                        <MDBIcon icon="star" /> {value.follow.length} Stars
                                                    </button>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                    </MDBTabPane>
                    <MDBTabPane tabId="3" role="tabpanel">
                        {this.state.answers.map((value, index) => {
                            if(!this.state.private && value.user.anonymous==="true")
                                return false;
                            else
                                return(
                                    <div key={index} className="mt-3">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="ml-3 cursor-pointer">
                                                <span className="question-asked">
                                                    Last Modified:<span className="question-asked-date">{moment(value.updated_at).format('MMMM Do YYYY, h:mm:ss a')}</span>
                                                </span>
                                                </div>
                                                <h5 className="card-title mt-2">
                                                    <a className="question-text" target="_blank" rel="noopener noreferrer" href={`/questions/${value.qid}`}>{ReactHtmlParser(value.answer)}</a>
                                                </h5>
                                                <div className="question-footer w-100 pl-3">
                                                    <div className="row">
                                                        <button type="button" className="btn cursor-default btn-sm btn-outline-black waves-effect ml-3">
                                                            <MDBIcon icon="poll" /> {value.vote.upVote.length-value.vote.downVote.length} Vote
                                                        </button>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                )
                        })}
                    </MDBTabPane>
                    <MDBTabPane tabId="4" role="tabpanel">
                        {this.state.bestAnswers.map((value, index) => {
                            if(!this.state.private && value.user.anonymous==="true")
                                return false;
                            else
                                return(
                                    <div key={index} className="mt-3">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="ml-3 cursor-pointer">
                                                <span className="question-asked">
                                                    Last Modified:<span className="question-asked-date">{moment(value.updated_at).format('MMMM Do YYYY, h:mm:ss a')}</span>
                                                </span>
                                                </div>
                                                <h5 className="card-title mt-2">
                                                    <a className="question-text" target="_blank" rel="noopener noreferrer" href={`/questions/${value.qid}`}>{ReactHtmlParser(value.answer)}</a>
                                                </h5>
                                                <div className="question-footer w-100 pl-3">
                                                    <div className="row">
                                                        <button type="button" className="btn cursor-default btn-sm btn-outline-black waves-effect ml-3">
                                                            <MDBIcon icon="poll" /> {value.vote.upVote.length-value.vote.downVote.length} Vote
                                                        </button>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                )
                        })}
                    </MDBTabPane>

                    {this.state.private?
                        <MDBTabPane tabId="5" role="tabpanel">
                            <div className="card bg-custom">

                                <div className="row p-5">
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
                                    <div>
                                        <button className="btn btn-sm btn-primary" onClick={()=>this.update()}>Update Profile</button>
                                        <button className="btn btn-sm btn-warning" onClick={()=>this.changePassword()}>Change Password</button>
                                    </div>
                                </div>
                            </div>
                        </MDBTabPane>
                        :''}

                </MDBTabContent>
            </div>
        );
    }

}

export default profile;
