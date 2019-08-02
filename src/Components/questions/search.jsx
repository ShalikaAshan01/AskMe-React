import React, {Component} from 'react';
import '../CSS/question-style.css';
import {fn_search} from "../functions/questionServices";
import {MDBIcon} from "mdbreact";
import moment from 'moment';

class search extends Component {
    constructor(props) {
        super(props);
        document.title = `${process.env.REACT_APP_BRAND}: ${this.props.match.params.keyword}`;
        this.state = {
            questions: [],
            keyword:""
        };

        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.setState({
            keyword:this.props.match.params.keyword
        });
        this.search(this.props.match.params.keyword);
    }
    onChange(e){
        this.setState({
            [e.target.name]:e.target.value,
        });
        this.search(e.target.value)
    }

    search(keyword){
        fn_search(keyword)
            .then(data=>{
                this.setState({
                    questions:data.data.questions
                })
            })
    }

    render() {
        return (
            <div className="container">
                <div className="mt-2 row">
                    <input className="col-8" name="keyword" value={this.state.keyword} onChange={this.onChange}/>
                    <div className=""/>
                    <button className="col-3 btn btn-md btn-outline-danger">Search</button>
                </div>

                <div>
                    {this.state.questions.length===0?"No result found":''}
                    {this.state.questions.map((value, index) => {
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
                </div>
            </div>
        );
    }

}

export default search;
