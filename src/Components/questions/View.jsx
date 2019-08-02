import React, {Component} from 'react';
import {
    fn_addComment,
    fn_delete, fn_downVoteQuestion, fn_followQuestion,
    fn_getQuestionByID,
    fn_getQuestionByName, fn_updateQuestion,
    fn_updateViews,
    fn_upVoteQuestion
} from "../functions/questionServices";
import { MDBIcon, MDBTabPane, MDBTabContent, MDBNav, MDBNavItem, MDBNavLink,MDBBtn } from 'mdbreact';
import {ScaleLoader as Spinner} from "react-spinners";
import '../CSS/question-style.css';
import md5 from "md5";
import moment from "moment";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {toast} from "react-toastify";
import Swal from 'sweetalert2'
import jwt from 'jsonwebtoken';
import {
    fn_addAnswer,
    fn_addCommentForAnswer, fn_deleteAnswer,
    fn_downVoteAnswer,
    fn_getAnswerByQID, fn_getAnswerByQIDUpdated, fn_makeBestAnswer, fn_updateAnswer,
    fn_upVoteAnswer
} from "../functions/answerService";
import ReactHtmlParser from 'react-html-parser';

toast.configure({
    position:"bottom-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
});
class View extends Component {
    constructor(props) {
        super(props);
        this.state={
            question:{},
            loading:true,
            showEditor:false,
            editor:{},
            token:{},
            reply:{},//editor,show
            comment:["Comment"],
            activeItem: "1",
            answers:[],
            id:"",
            editorBtn:"POST",
            editQuestion:""
        };
        this.showEditor = this.showEditor.bind(this);
        this.onPostAnswer = this.onPostAnswer.bind(this);
        this.upVote = this.upVote.bind(this);
        this.downVote = this.downVote.bind(this);
        this.follow = this.follow.bind(this);
        this.updateQuestion = this.updateQuestion.bind(this);
        this.delete = this.delete.bind(this);
        this.showReply = this.showReply.bind(this);
        this.showReply = this.showReply.bind(this);
        this.comment = this.comment.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    onChange(e){
        let value = e.target.value;
        if(value.length>1){
            this.setState({
                editQuestion:value.replace(/\?/g, '')
            })
        }else {
            this.setState({
                editQuestion: value.replace(/\?/g, '')
            })
        }
    }
    showReply(){
        let reply = this.state.reply;
        reply.editor = !reply.editor;
        this.setState({
            reply:reply
        })
    }

    comment(){
        let comment = {
            comment: document.getElementById('answer-comment').value,
            anonymous:document.getElementById("answer-anonymous").checked===true

    };

        let headers = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('user')
            }
        };
        let id = this.state.question._id;
        let btn = this.state.comment;
        btn[0] = "Commenting...";
        this.setState({
            comment:btn
        });
        fn_addComment(id,headers,comment)
            .then(()=>{
                this.updateQuestion(this.state.question._id);
                btn[0] = "Comment";
                this.setState({
                    comment:btn
                });
                toast.success("Your comment is added",{position: "top-right"});
                document.getElementById('answer-comment').value = "";
            })
            .catch(()=>{
                this.updateQuestion(this.state.question._id);
                btn[0] = "Comment";
                this.setState({
                    comment:btn
                });
            })
    }

    updateQuestion(id){
        fn_getQuestionByID(id)
            .then(data=>{
                this.setState({
                    question:data.data.question
                })
            });
        fn_getAnswerByQID(id)
            .then(data=>{
                this.setState({
                    answers:data.data.answers
                })
            })
    }
    upVote(){
        let headers = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('user')
            }
        };
        let id = this.state.question._id;
        fn_upVoteQuestion(id,headers)
            .then(()=>{
                this.updateQuestion(id);
            })
            .catch(err=>{
                err = err.response;
                this.updateQuestion(id);
                if(err.status===406)
                    toast.error(err.data.error,{className:'notification-bottom-right',position: "bottom-right"});
                if(err.status===401)
                    toast.error("Thanks for the feedback.Please sign in for record your feedback",{className:'notification-bottom-right',position: "bottom-right"});
            })
    }
    downVote(){
        let headers = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('user')
            }
        };
        let id = this.state.question._id;
        fn_downVoteQuestion(id,headers)
            .then(()=>{
                this.updateQuestion(id);
            })
            .catch(err=>{
                err = err.response;
                this.updateQuestion(id);
                if(err.status===406)
                    toast.error(err.data.error,{className:'notification-bottom-right',position: "bottom-right"});
                if(err.status===401)
                    toast.error("Thanks for the feedback.Please sign in for record your feedback",{className:'notification-bottom-right',position: "bottom-right"});

            })
    }
    follow(){
        let headers = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('user')
            }
        };
        let id = this.state.question._id;
        fn_followQuestion(id,headers)
            .then(()=>{
                this.updateQuestion(id);
            })
            .catch(err=>{
                err = err.response;
                this.updateQuestion(id);
                if(err.status===406)
                    toast.error(err.data.error,{className:'notification-bottom-right',position: "bottom-right"});
                if(err.status===401)
                    toast.error("Please sign in to favourite this question",{className:'notification-bottom-right',position: "bottom-right"});
            })
    }

    onPostAnswer(){
        let data= {
            answer:this.state.editor.getData(),
            anonymous:document.getElementById("anonymous").checked===true
        };
        let headers = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('user')
            }
        };
        this.setState({
            editorBtn:"Submitting...",
        });
        fn_addAnswer(this.state.question._id,headers,data)
            .then(()=>{
                this.updateQuestion(this.state.question._id);
                this.state.editor.setData("");
                this.setState({
                    editorBtn:"Post",
                });
                toast.success("Your answer was posted",{position: "top-right"});
            })
            .catch(()=>{
                this.setState({
                    editorBtn:"POST"
                });
            })
    }

    componentDidMount() {
        document.body.className="bg-light";
        this.setState({
            token:jwt.decode(localStorage.getItem('user'))
        });

        if(localStorage.getItem('user'))
            this.setState({
                id:jwt.decode(localStorage.getItem('user'))._id
            });

        let question = this.props.match.params.question.split('-').join(' ');
        fn_updateViews(question).then(data=>{
            data=data.data;
            let question = this.state.question;
            question.views = data.views;
            this.setState({
                question:question
            })
        });
        fn_getQuestionByName(question)
            .then(data=>{
                let question = data.data.question;
                this.setState({
                    question:question,
                    // loading:false,
                    editQuestion:question.question.replace('?','')
                });
                document.title = process.env.REACT_APP_BRAND +": "+question.question;

            //    get answers
                fn_getAnswerByQID(this.state.question._id)
                    .then(data=>{
                        this.setState({
                            answers:data.data.answers,
                            loading:false
                        })
                    })
                    .catch(()=>{
                        this.setState({
                            loading:false
                        })
                    })

            })
            .catch(err=>{
                err = err.response;

                if(err.status===404)
                    this.props.history.push('/errors/404');
                if(err.status ===500)
                    this.props.history.push('/errors/500');
            });
    }
    delete(){
        let headers = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('user')
            }
        };
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this question!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.value) {
                fn_delete(this.state.question._id,headers)
                    .then(()=>{
                        Swal.fire(
                            'Deleted!',
                            'Your question has been deleted.',
                            'success'
                        ).then(()=>{
                            this.props.history.push("/");
                        })
                    })
                    .catch(()=>{
                        Swal.fire('Oops...', 'Something went wrong!', 'error')
                    })
            }
        });
    };
    showEditor(){
        if(!this.state.showEditor){
                ClassicEditor
                    .create( document.querySelector( '#editor' ) )
                    .then( editor => {
                        this.setState({showEditor:true,editor:editor});
                        window.editor = editor;
                    } )
                    .catch( err => {
                        console.error( err.stack );
                    } );
        }
        else{
            this.state.editor.destroy()
                .then(()=>{
                    this.setState({showEditor:false,editor:{}});
                })
                .catch( error => {
                    console.log( error );
                } );
        }
    }

    toggleTabs = tab => e => {
        if(tab==="1"){
            fn_getAnswerByQID(this.state.question._id)
                .then(data=>{
                    this.setState({
                        answers:data.data.answers
                    })
                })
        }
        if(tab==="2"){
            fn_getAnswerByQIDUpdated(this.state.question._id)
                .then(data=>{
                    this.setState({
                        answers:data.data.answers
                    })
                })
        }
        if (this.state.activeItem !== tab) {
            this.setState({
                activeItem: tab
            });
        }
    };

    upVoteAnswer(aid){
        let headers = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('user')
            }
        };
        fn_upVoteAnswer(aid,headers)
            .then(()=>{
                this.componentDidMount()
            })
            .catch(err=>{
                err = err.response;
                this.componentDidMount();
                if(err.status===406)
                    toast.error(err.data.error,{className:'notification-bottom-right',position: "bottom-right"});
                if(err.status===401)
                    toast.error("Thanks for the feedback.Please sign in for record your feedback",{className:'notification-bottom-right',position: "bottom-right"});

            })
    };
    downVoteAnswer(aid){
        let headers = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('user')
            }
        };
        fn_downVoteAnswer(aid,headers)
            .then(()=>{
                this.componentDidMount()
            })
            .catch(err=>{
                err = err.response;
                this.componentDidMount();
                if(err.status===406)
                    toast.error(err.data.error,{className:'notification-bottom-right',position: "bottom-right"});
                if(err.status===401)
                    toast.error("Thanks for the feedback.Please sign in for record your feedback",{className:'notification-bottom-right',position: "bottom-right"});

            })
    };
    addAnswerComment(aid){
        let comment = {
            comment: document.getElementById(`answer-comment-${aid}`).value,
            anonymous:document.getElementById(`answer-anonymous-${aid}`).checked===true
        };
        let headers = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('user')
            }
        };
        fn_addCommentForAnswer(aid,headers,comment)
            .then(()=>{
            toast.success("Your comment is added",{position: "top-right"});
            document.getElementById(`answer-comment-${aid}`).value = "";
            this.componentDidMount();
        })
            .catch(()=>{
                this.componentDidMount();
            })
    }

    editAnswer(id,data){
        if(document.getElementById(`answer-edit-${id}`).className=== "d-none") {
            document.getElementById(`answer-show-${id}`).className = "d-none";
            document.getElementById(`answer-edit-${id}`).className = "d-inline-block";
            ClassicEditor
                .create(document.querySelector(`#answer-editor-${id}`))
                .then(editor => {
                    window.editor[id] = editor;
                    window.editor[id].setData(data);
                })
                .catch(err => {
                    console.error(err.stack);
                });
        }
    }
    cancelEdit(id){
            document.getElementById(`answer-edit-${id}`).className = "d-none";
            document.getElementById(`answer-show-${id}`).className = "d-inline-block";
            window.editor[id].destroy();
    }

    updateAnswer(id){
        let headers = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('user')
            }
        };
        fn_updateAnswer(id,{answer:window.editor[id].getData()},headers)
            .then((data)=>{
                this.componentDidMount();
                this.cancelEdit(id);
                toast.success("Your answer is updated",{position: "top-right"});
            })
    }
    deleteAnswer(id){
        let headers = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('user')
            }
        };
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this question!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.value) {
                fn_deleteAnswer(id,headers)
                    .then(()=>{
                        Swal.fire(
                            'Deleted!',
                            'Your answer has been deleted.',
                            'success'
                        ).then(()=>{
                            this.componentDidMount();
                            this.cancelEdit(id);
                        })
                    })
                    .catch(()=>{
                        Swal.fire('Oops...', 'Something went wrong!', 'error')
                    })
            }
        });
    }

    update(){
        let headers = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('user')
            }
        };
        fn_updateQuestion(this.state.question._id,{question:this.state.editQuestion+"?"},headers)
            .then(()=>{
                View.cancelQuestionEdit();
                this.updateQuestion(this.state.question._id);
                toast.success("Your question is updated",{position: "top-right"});
            })
    }

    makeBestAnswer(id){
        let headers = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('user')
            }
        };
        fn_makeBestAnswer(id,headers)
            .then(()=>{
                this.componentDidMount();
            })
    }

    static showAnswerReply(id){
        document.getElementById(`answer-comment-div-${id}`).className = "d-inline-block"
    }
    static showQuestionEdit(){
        document.getElementById("question-edit-box").className = "d-inline w-100";
    }
    static cancelQuestionEdit(){
        document.getElementById("question-edit-box").className = "d-none";
    }
    render() {
        let answers = (<div>{this.state.answers.map((value, index) => {
            return (
                <div className={value.bestAnswer==="true"?'card w-100 mt-3 border-success':'card w-100 mt-3'} key={index}>
                    <div className="card-body">
                        <div className="row">
                            <div className="d-flex">
                                <img
                                    src={value.user.anonymous==="true"?
                                        `https://www.gravatar.com/avatar/${md5("mp")}?d=mp`
                                        :`https://www.gravatar.com/avatar/${md5(this.state.question.user.userInfo.email)}?d=wavatar`
                                    }
                                    className="img-fluid z-depth-1 rounded-circle float-right double-border"
                                    width="45"
                                    alt="Profile"/>
                                {/*  check anonymous question or not  */}
                                <span className="ml-2">
                                                {value.user.anonymous==="true"?
                                                    <a className="question-username" href={`/user/unknown`}> Anonymous</a>:
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
                                    {
                                        this.state.token !== null
                                            ?this.state.token._id===value.user.userInfo._id?
                                            <span className="question-asked" onClick={()=>this.editAnswer(value._id,value.answer)}>
                                                    Edit
                                                    <span className="question-asked-date"><MDBIcon icon="pencil-alt" /> </span>
                                                </span>
                                            :''
                                            :''
                                    }
                                </div>
                            </div>


                        </div>
                        <div className="row">
                                                        <span className="card-title mt-2 ml-5">
                                                            <div className="d-inline-block" id={`answer-show-${value._id}`}>
                                                            {ReactHtmlParser(value.answer)}
                                                            </div>

                                                            <div
                                                                className="d-none"
                                                                id={`answer-edit-${value._id}`}>
                                                                <div id={`answer-editor-${value._id}`}>
                                                                    {value.answer}
                                                                </div>
                                                                <div className="row">
                                                                    <MDBBtn color="warning" size="sm" onClick={()=>this.cancelEdit(value._id)}>Cancel</MDBBtn>
                                                                    <MDBBtn color="danger" size="sm" onClick={()=>this.deleteAnswer(value._id)}>Delete</MDBBtn>
                                                                    <MDBBtn color="primary" size="sm" onClick={()=>this.updateAnswer(value._id)}>Update</MDBBtn>
                                                                </div>
                                                            </div>

                                                        </span>
                        </div>

                        <div className="question-footer w-100 pl-3">
                            <div className="row">


                                <div className={
                                    value.vote.upVote.some(item => item._id === this.state.id)?
                                        'cursor-pointer upvote-answer-active':
                                        "cursor-pointer upvote-answer"}

                                     onClick={()=>this.upVoteAnswer(value._id)}><MDBIcon icon="caret-up" size="3x"/></div>
                                <div className="count-vote-answer">{value.vote.upVote.length-value.vote.downVote.length}</div>
                                <div className={
                                    value.vote.downVote.some(item => item._id === this.state.id)?
                                        'cursor-pointer downvote-answer-active':
                                        "cursor-pointer downvote-answer"}
                                     onClick={()=>this.downVoteAnswer(value._id)}><MDBIcon icon="caret-down" size="3x"/>
                                </div>
                                {localStorage.getItem('user')?
                                    <span className="ml-4 mt-3 cursor-pointer font-smaller font-bold">
                                                                    <span onClick={()=> View.showAnswerReply(value._id)}>Add comment</span>
                                        {this.state.question.answered==="true"?'':<span className="ml-3 text-success" onClick={()=>this.makeBestAnswer(value._id)}>Accept as Answer</span>}
                                                                </span>
                                    :''}
                            </div>
                        </div>

                        <div className="question-footer w-100 pl-3">
                        </div>
                        <div className="w-100 border-top ">
                            {value.comments.map((value, index)=>{
                                return(
                                    <div className="border-bottom font-small d-flex" key={index}>
                                        <div>{value.comment}</div> -
                                        {value.user.anonymous?<span className="font-small text-primary cursor-pointer">Anonymous</span>:
                                            <a href={`/user/${value.user.userInfo.username}`} className="font-small">{value.user.userInfo.firstName+" " + value.user.userInfo.lastName}</a>
                                        }
                                        <span className="font-small ml-4 text-muted">{moment(value.date).format('MMMM Do YYYY, h:mm:ss')}</span>
                                    </div>
                                )
                            } )}
                        </div>
                    </div>
                    {localStorage.getItem('user')?
                        <div className="p-1 mt-4 white w-100 d-none" id={`answer-comment-div-${value._id}`}>
                                                    <textarea className="w-100"
                                                              id={`answer-comment-${value._id}`}
                                                              placeholder="Write your comment.."/>
                            <div className="custom-control custom-checkbox ml-3"><input
                                type="checkbox" className="custom-control-input"
                                id={`answer-anonymous-${value._id}`}
                            /><label className="custom-control-label"
                                     htmlFor={`answer-anonymous-${value._id}`}>Anonymous</label>
                            </div>
                            <button
                                onClick={()=>this.addAnswerComment(value._id)}
                                className="btn btn-md btn-outline-mdb-color waves-ripple ckeditor-post">Comment
                            </button>
                        </div>
                        :''
                    }
                </div>
            )
        })}</div>);
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
            <div className="container">
                {this.state.loading ? loader:

                    <div>
                        <div className="mt-1 flex-row custom-breadcrumb">
                            <span className="custom-breadcrumb-item"><a href="/"><MDBIcon icon="home" /> Home</a> /</span>
                            <span className="custom-breadcrumb-item"><a href="/questions">Questions</a> /</span>
                            <span className="custom-breadcrumb-item-active"><a href={`/questions/${this.state.question.question.split(' ').join('-').replace('?','')}`}>{this.state.question._id}</a> </span>

                            {this.state.question.answered
                                ?
                                <span className="custom-breadcrumb-indicator custom-breadcrumb-indicator-success mr-3 float-lg-right">
                                <MDBIcon icon="check" /> Answered
                            </span>
                                :
                                <span className="custom-breadcrumb-indicator custom-breadcrumb-indicator-danger mr-3 float-lg-right">
                                <MDBIcon icon="spinner" /> In Process
                            </span>
                            }


                        </div>

                        {/*   Question */}
                            <div className={this.state.question.answered==="true"?'border-success card w-100 mt-1':'card w-100 mt-1'}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="d-flex">
                                            <img
                                                src={this.state.question.user.anonymous==="true"?
                                                    `https://www.gravatar.com/avatar/${md5("mp")}?d=mp`
                                                    :`https://www.gravatar.com/avatar/${md5(this.state.question.user.userInfo.email)}?d=wavatar`
                                                }
                                                className="img-fluid z-depth-1 rounded-circle float-right double-border"
                                                width="45"
                                                alt="Profile"/>
                                            {/*  check anonymous question or not  */}
                                            <span className="ml-2">
                                                {this.state.question.user.anonymous==="true"?
                                                    <a className="question-username" href={`/user/unknown`}> Anonymous</a>:
                                                    <a className="question-username" href={`/user/${this.state.question.user.userInfo.username}`}> {`${this.state.question.user.userInfo.firstName} ${this.state.question.user.userInfo.lastName}`}</a>
                                                }
                                            </span>
                                            {this.state.question.user.anonymous === "true" ? '' :
                                                <h6 className="ml-3">
                                                    {/*<span className="badge  badge-success">*/}
                                                    {/*    student*/}
                                                    {/*</span>*/}
                                                </h6>
                                            }
                                            <div className="ml-3 cursor-pointer">
                                                <span className="question-asked">
                                                    Last Modified:<span className="question-asked-date">{moment(this.state.question.updated_at).format('MMMM Do YYYY, h:mm:ss a')}</span>
                                                </span>
                                            </div>
                                            <div className="ml-3 cursor-pointer">
                                                <span className="question-asked hover-dark">
                                                    From:
                                                    {
                                                        this.state.question.askedFrom==="everyone"?
                                                            <a href="/tags/everyone"> Everyone <MDBIcon icon="globe" /></a> :
                                                            this.state.question.askedFrom==="male"?
                                                                <a href="/tags/male"> Male <MDBIcon icon="mars" /></a> :
                                                                <a href="/tags/female"> Female <MDBIcon icon="venus" /></a>
                                                    }
                                                </span>
                                            </div>
                                            <div className="ml-3 cursor-pointer">
                                                {
                                                    this.state.token !== null
                                                    ?this.state.token._id===this.state.question.user.userInfo.id?
                                                        <span className="question-asked" onClick={()=> View.showQuestionEdit()}>
                                                    Edit
                                                    <span className="question-asked-date"><MDBIcon far icon="edit" /></span>
                                                </span>
                                                        :''
                                                        :''
                                                }
                                            </div>
                                        </div>


                                    </div>
                                    <div className="row">
                                        <div className="vote mt-4 ml-1">
                                            <div className={
                                                this.state.question.vote.upVote.some(item => item._id === this.state.id)?
                                                    'arrow-up arrow-up-selected mt-1':
                                                    "arrow-up arrow-up-default mt-1"}
                                                 onClick={this.upVote}
                                            />
                                            <div className="vote-count text-center">
                                                {this.state.question.vote.upVote.length-this.state.question.vote.downVote.length}
                                            </div>
                                            <div className={
                                                this.state.question.vote.downVote.some(item => item._id === this.state.id)?
                                                    'arrow-down arrow-down-selected mt-1':
                                                    "arrow-down arrow-down-default mt-1"}
                                                 onClick={this.downVote}
                                            />
                                        </div>
                                        <h4 className="card-title mt-2 ml-5">
                                            <a className="question-text" rel="noopener noreferrer" href={`/questions/${this.state.question.question.split(' ').join('-').replace('?','')}`}>{this.state.question.question}</a>
                                        </h4>
                                        <div className="w-100 mt-2 d-none" id="question-edit-box">
                                            <textarea className="w-100" value={this.state.editQuestion} onChange={this.onChange}/>
                                            <MDBBtn color="warning" size="sm" onClick={()=> View.cancelQuestionEdit()}>Cancel</MDBBtn>
                                            <MDBBtn color="danger" size="sm" onClick={()=>this.delete()}>Delete</MDBBtn>
                                            <MDBBtn color="primary" size="sm" onClick={()=>this.update()}>Update</MDBBtn>
                                        </div>
                                    </div>
                                    <p className="card-text ml-5">
                                        <span>{this.state.question.description?this.state.question.description:'No Description'}</span>
                                    </p>
                                    <div className="m-2">
                                        {this.state.question.tags.map((value1, index1) => {
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
                                                    className={this.state.question.answered==="true"?'btn btn-sm btn-outline-success waves-effect answer-btn':
                                                        'btn btn-sm btn-outline-mdb-color waves-effect no-answer-btn'
                                                    }
                                            >
                                                <MDBIcon far icon="comment" /> {this.state.question.answers} Answers
                                            </button>
                                            <button type="button" className="btn cursor-default btn-sm btn-outline-primary waves-effect ml-3 view-btn">
                                                <MDBIcon icon="eye" /> {this.state.question.views} Views
                                            </button>
                                            <button type="button" className="btn btn-sm btn-outline-mdb-color waves-effect ml-3 star-btn"
                                                    onClick={this.follow}
                                            >
                                                <MDBIcon icon="star" /> {this.state.question.follow===undefined?' 0 ':this.state.question.follow.length} Stars
                                            </button>

                                            {localStorage.getItem('user')===null?'':
                                                <span>
                                                                                                <button
                                                                                                    type="button"
                                                                                                    className='btn btn-sm btn-mdb-color waves-effect float-lg-right'
                                                                                                    onClick={this.showReply}
                                                                                                >
                                                <MDBIcon icon="reply" /> {this.state.reply.editor?'Cancel':'Reply'}
                                            </button>
                                                                                                <button
                                                                                                    type="button"
                                                                                                    className='btn btn-sm btn-mdb-color waves-effect float-lg-right'
                                                                                                    onClick={this.showEditor}
                                                                                                >
                                                <MDBIcon far icon="edit" />
                                                                                                    {this.state.showEditor?' Cancel':" Answer"}
                                            </button>
                                                </span>
                                            }

                                            </div>
                                    </div>
                                    <div className="w-100 border-top ">
                                        {this.state.question.comments.map((value, index)=>{
                                            return(
                                                <div className="border-bottom font-small d-flex" key={index}>
                                                    <div>{value.comment}</div> -
                                                    {value.user.anonymous?<span className="font-small text-primary cursor-pointer">Anonymous</span>:
                                                        <a href={`/user/${value.user.userInfo.username}`} className="font-small">{value.user.userInfo.firstName+" " + value.user.userInfo.lastName}</a>
                                                    }
                                                    <span className="font-small ml-4 text-muted">{moment(value.date).format('MMMM Do YYYY, h:mm:ss')}</span>
                                                </div>
                                            )
                                        } )}
                                    </div>
                                </div>
                            </div>
                        <div className={this.state.reply.editor?'p-1 mt-4 white w-100':'d-none'}>
                            <textarea className="w-100" id="answer-comment" placeholder="Write your comment.."/>
                            <div className="custom-control custom-checkbox ml-3">
                                <input type="checkbox" className="custom-control-input" id="answer-anonymous"/>
                                <label className="custom-control-label" htmlFor="answer-anonymous" >Anonymous</label>
                            </div>
                            <button className="btn btn-md btn-outline-mdb-color waves-ripple ckeditor-post" onClick={this.comment} >{this.state.comment[0]}</button>
                        </div>
                        {/*  End of Question Card  */}
                    {/*   Editor */}
                        <div className={this.state.showEditor?'mt-4 white':'d-none'}>
                            <textarea id="editor"/>
                            <div className="custom-control custom-checkbox ml-3">
                                <input type="checkbox" className="custom-control-input" id="anonymous"/>
                                    <label className="custom-control-label" htmlFor="anonymous" >Anonymous</label>
                            </div>
                            <button className="btn btn-lg btn-success waves-ripple ckeditor-post" onClick={this.onPostAnswer}>{this.state.editorBtn}</button>
                        </div>
                    {/*   Editor */}
                    {/*Answers*/}
                    <div>
                        <MDBNav className="nav-tabs mt-5">
                            <MDBNavItem>
                                <MDBNavLink to="#" className={this.state.activeItem === "1" ? "active" : ""} onClick={this.toggleTabs("1")} role="tab" >
                                    Voted
                                </MDBNavLink>
                            </MDBNavItem>
                            <MDBNavItem>
                                <MDBNavLink to="#" className={this.state.activeItem === "2" ? "active" : ""} onClick={this.toggleTabs("2")} role="tab" >
                                    Updated
                                </MDBNavLink>
                            </MDBNavItem>
                        </MDBNav>
                        <MDBTabContent activeItem={this.state.activeItem} >
                            <MDBTabPane tabId="1" role="tabpanel" className="bg-white p-3">
                                {answers}
                            </MDBTabPane>
                            <MDBTabPane tabId="2" role="tabpanel" className="bg-white p-3">
                                {answers}
                            </MDBTabPane>
                        </MDBTabContent>
                    </div>


                    </div>
                }
            </div>
        );
    }

}

export default View;
