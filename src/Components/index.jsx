import React, {Component} from 'react';
import {
    fn_downVoteQuestion, fn_followQuestion,
    fn_getAllQuestions, fn_getQuestionByID,
    fn_upVoteQuestion
} from "./functions/questionServices";
import './CSS/question-style.css';
import moment from 'moment';
import {MDBIcon} from "mdbreact";
import md5 from 'md5';
import jwt from 'jsonwebtoken'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure({
    position:"bottom-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
});

class index extends Component {
    constructor(props) {
        super(props);
        document.title = `${process.env.REACT_APP_BRAND}`;
        this.state = {
            questions: [],
            id:"",
            loading:true
        };
        this.upVote = this.upVote.bind(this);
        this.downVote = this.downVote.bind(this);
        this.follow = this.follow.bind(this);
        this.updateQuestion = this.updateQuestion.bind(this);
    }

    componentDidMount() {
        if(localStorage.getItem('user'))
            this.setState({
                id:jwt.decode(localStorage.getItem('user'))._id
            });
        fn_getAllQuestions()
            .then(data => {
                this.setState({
                    questions: data.data.questions
                });
            })
            .catch((err) => {
                err = err.response;
                if(err.status===500)
                    this.props.history.push('/errors/500');
            })
    }
    updateQuestion(key,id){
        let question = this.state.questions;
        delete question[key];
        fn_getQuestionByID(id)
            .then(data=>{
                question[key] = data.data.question;
                this.setState({
                    questions:question
                })
            })
    }
    upVote(id,index){
        let headers = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('user')
            }
        };
        fn_upVoteQuestion(id,headers)
            .then(()=>{
                this.updateQuestion(index,id);
            })
            .catch(err=>{
                err = err.response;
                this.updateQuestion(index,id);
                if(err.status===406)
                    toast.error(err.data.error,{className:'notification-bottom-right',position: "bottom-right"});
                if(err.status===401)
                    toast.error("Thanks for the feedback.Please sign in for record your feedback",{className:'notification-bottom-right',position: "bottom-right"});
            })
    }
    downVote(id,index){
        let headers = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('user')
            }
        };
        fn_downVoteQuestion(id,headers)
            .then(()=>{
                this.updateQuestion(index,id);
            })
            .catch(err=>{
                err = err.response;
                this.updateQuestion(index,id);
                if(err.status===406)
                    toast.error(err.data.error,{className:'notification-bottom-right',position: "bottom-right"});
                if(err.status===401)
                    toast.error("Thanks for the feedback.Please sign in for record your feedback",{className:'notification-bottom-right',position: "bottom-right"});
            })
    }
    follow(id,index){
        let headers = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('user')
            }
        };
        fn_followQuestion(id,headers)
            .then(()=>{
                this.updateQuestion(index,id);
            })
            .catch(err=>{
                err = err.response;
                this.updateQuestion(index,id);
                if(err.status===406)
                    toast.error(err.data.error,{className:'notification-bottom-right',position: "bottom-right"});
                if(err.status===401)
                    toast.error("Please sign in to favourite this question",{className:'notification-bottom-right',position: "bottom-right"});
            })
    }

    render() {
        return (
            <div className="container">
                {this.state.questions.map((value, index) => {
                    return (
                        <div className="row question-content mt-3" key={index}>
                            <div className={value.answered==="true"?'card col-12 border-success':'card col-12'}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="d-flex">
                                            <img
                                                src={value.user.anonymous==="true"?
                                                    `https://www.gravatar.com/avatar/${md5("mp")}?d=mp`
                                               :`https://www.gravatar.com/avatar/${md5(value.user.userInfo.email)}?d=wavatar`
                                            }
                                               className="img-fluid z-depth-1 rounded-circle float-right double-border"
                                                 width="45"
                                                 alt="Profile"/>
                                        {/*  check anonymous question or not  */}
                                            <span className="ml-2">
                                                {value.user.anonymous==="true"?
                                                    <a className="question-username" href={`/user/${value.user.userInfo.username}`}> Anonymous</a>:
                                                    <a className="question-username" href={`/user/${value.user.userInfo.username}`}> {`${value.user.userInfo.firstName} ${value.user.userInfo.lastName}`}</a>
                                                }
                                            </span>
                                            {value.user.anonymous === "true" ? '' :
                                                <h6 className="ml-3">
                                                    {/*<span className="badge  badge-success">*/}
                                                    {/*    student*/}
                                                    {/*</span>*/}
                                                </h6>
                                            }
                                            <div className="ml-3 cursor-pointer">
                                                <span className="question-asked">
                                                    Last Modified:<span className="question-asked-date">{moment(value.updated_at).format('MMMM Do YYYY, h:mm:ss a')}</span>
                                                </span>
                                            </div>
                                            <div className="ml-3 cursor-pointer">
                                                <span className="question-asked hover-dark">
                                                    From:
                                                    {
                                                        value.askedFrom==="everyone"?
                                                            <a href="/tags/everyone"> Everyone <MDBIcon icon="globe" /></a> :
                                                            value.askedFrom==="male"?
                                                                <a href="/tags/male"> Male <MDBIcon icon="mars" /></a> :
                                                                <a href="/tags/female"> Female <MDBIcon icon="venus" /></a>
                                                    }
                                                </span>
                                            </div>
                                        </div>


                                    </div>
                                    <div className="row">
                                        <div className="vote mt-4 ml-1">
                                            <div className={
                                                value.vote.upVote.some(item => item._id === this.state.id)?
                                                    'arrow-up arrow-up-selected mt-1':
                                                    "arrow-up arrow-up-default mt-1"}
                                                 onClick={()=>this.upVote(value._id,index)}
                                            />
                                            <div className="vote-count text-center">
                                                {value.vote.upVote.length-value.vote.downVote.length}
                                            </div>
                                            <div className={
                                                value.vote.downVote.some(item => item._id === this.state.id)?
                                                    'arrow-down arrow-down-selected mt-1':
                                                    "arrow-down arrow-down-default mt-1"}
                                                 onClick={()=>this.downVote(value._id,index)}
                                            />
                                        </div>
                                        <h4 className="card-title mt-2 ml-5">
                                            <a className="question-text" target="_blank" rel="noopener noreferrer" href={`/questions/${value.question.split(' ').join('-').replace('?','')}`} onClick={()=>{this.updateQuestion(index,value._id)}}>{value.question}</a>
                                        </h4>
                                    </div>
                                    <p className="card-text ml-5">
                                        <span>{value.description?value.description:'No Description'}</span>
                                    </p>
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
                                        {/*<h5 className="p-2"><span className="badge badge-secondary">New</span></h5>*/}
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
                                            <button
                                                type="button"
                                                className={
                                                    value.follow.some(item => item._id === this.state.id)?
                                                        'btn btn-sm btn-success waves-effect ml-3 star-btn-selected':
                                                        "btn btn-sm btn-outline-mdb-color waves-effect ml-3 star-btn"
                                                }
                                                onClick={()=>this.follow(value._id,index)}
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
            </div>
        );
    }

}

export default index;
