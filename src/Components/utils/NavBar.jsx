import React, {Component} from 'react';
import {
    MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon, MDBBtn, MDBModal, MDBModalBody,
    MDBModalHeader, MDBModalFooter, MDBInput
} from "mdbreact";
import jwt from 'jsonwebtoken';
import md5 from 'md5';
import Toggle from 'react-toggle';
import '../CSS/react-togle.css';
import '../CSS/react-tag.css';
import ReactTags from 'react-tag-autocomplete';
import Swal from 'sweetalert2'
import {fn_getAllTags} from "../functions/tagServices";
import {fn_addNewQuestion} from "../functions/questionServices";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure({
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
});
let context;
class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            profilePic: "",
            username:"",
            loggedIn: false,
            questionModal: false,
            askFrom: "everyone",
            anonymous: false,
            question:"",
            description:"",
            askBtn:"Ask",
            alert:false,
            tags: [
            ],
            suggestions: [],
        };
        this.logout = this.logout.bind(this);
        this.logout = this.logout.bind(this);
        this.radioChange = this.radioChange.bind(this);
        this.handleBaconChange = this.handleBaconChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.askQuestion = this.askQuestion.bind(this);
        this.toggle= this.toggle.bind(this);
        this.search= this.search.bind(this);
    }
    handleDelete (i) {
        const tags = this.state.tags.slice(0);
        tags.splice(i, 1);
        this.setState({ tags })
    }

    handleAddition (tag) {
        if(!this.state.tags.includes(tag)){
            const tags = [].concat(this.state.tags, tag);
            this.setState({ tags })
        }
    }

    componentDidMount() {
        context = this;
        if (localStorage.getItem('user')) {
            let token = localStorage.getItem('user');
            console.log(token);
            let decoded = jwt.decode(token);
            let email = decoded.email;
            this.setState({
                profilePic: `https://www.gravatar.com/avatar/${md5(email)}?d=wavatar`,
                username:decoded.username,
                loggedIn: true
            });

            fn_getAllTags().then(data=>{
                this.setState({suggestions:data.data.tags})
            }).catch((err)=> {
                err = err.response;
                if(err.status===500)
                    this.props.history.push('/errors/500');
            })

        }
    }
    handleBaconChange(e){
        this.setState({
            anonymous:e.target.checked
        })
    }

    toggleCollapse = () => {
        this.setState({isOpen: !this.state.isOpen});
    };

    toggle() {
        this.setState({
            questionModal: !this.state.questionModal
        })
    }

    logout(e) {
        e.preventDefault();
        localStorage.clear();
        this.setState({
            loggedIn: false
        });
    };

    radioChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onChange(e){
        if (e.target.name !== "question")
            this.setState({
                [e.target.name]:e.target.value
            });
        else{
            let value = e.target.value;
            if(value.length>1){
                this.setState({
                    question:value.replace(/\?/g, '')
                })
            }else {
                this.setState({
                    question: value.replace(/\?/g, '')
                })
            }
        }
    }
    askQuestion(){
        if(this.state.question){
            if(this.state.tags.length<3){
                Swal.fire('Oops...', 'Please select three or more tags!', 'warning')
            }else{
                let token = localStorage.getItem('user');
                let decoded = jwt.decode(token);
                let user = {
                    anonymous:this.state.anonymous,
                    userInfo:{
                        id:decoded._id,
                        username:decoded.username,
                        firstName:decoded.firstName,
                        lastName:decoded.lastName,
                        email:decoded.email,
                    }
                };

                let payload={
                    question:this.state.question.trim()+"?",
                    tags:this.state.tags,
                    description:this.state.description,
                    askedFrom:this.state.askFrom,
                    user:user
                };

                let headers = {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                };
                this.setState({
                    askBtn:"Saving..."
                });
                fn_addNewQuestion(headers,payload)
                    .then(data=>{
                        this.setState({
                            askBtn:"Ask",
                            questionModal:false,
                            question:"",
                            tags:[],
                            description:"",
                            askFrom:"everyone",
                            anonymous:false
                        });
                        // Swal.fire('Excellent...', 'Your question is asked successfully', 'success')
                        this.notification("Your question is asked successfully");
                    })
                    .catch((err)=>{
                        this.setState({
                            askBtn:"Ask",
                        });
                        err = err.response;
                        let status = err.status;
                        if(status===401){
                            Swal.fire('UnAuthorized...', 'Please login again!', 'error')
                                .then(()=>{
                                    localStorage.clear();
                                    context.props.history.push('/signin');
                                })
                        }else
                            Swal.fire('Oops...', 'Somethings went wrong!', 'error')
                    })
            }
        }
    }
    notification = (message) => toast.success(message,{className:'notification-top-right'});

    search(e){
        let keyCode = (e.keyCode ? e.keyCode : e.which);

        if(keyCode === 13){
            window.location.href = "/search/"+document.getElementById("search").value;
        }
    }

    render() {
        let user = (
            <div className="d-flex">
                <MDBNavItem>
                    <MDBNavLink className="waves-effect waves-light" to="#!" onClick={this.toggle}>
                        <MDBIcon icon="plus-circle" className="ml-1 mr-1 mt-2" size="lg"/>
                    </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                    <MDBNavLink className="waves-effect waves-light" to="#!">
                        <MDBIcon icon="envelope" className="ml-2 mr-2 mt-2" size="lg"/>
                    </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                    <MDBNavLink className="waves-effect waves-light" to="#!">
                        <MDBIcon icon="bell" className="ml-2 mr-2 mt-2" size="lg"/>
                    </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                    <MDBDropdown>
                        <MDBDropdownToggle className="dopdown-toggle" nav>
                            <img src={this.state.profilePic} className="rounded-circle z-depth-0"
                                 style={{height: "30px", padding: 0}} alt=""/>
                        </MDBDropdownToggle>
                        <MDBDropdownMenu className="dropdown-default" right>
                            <MDBDropdownItem href={`/user/${this.state.username}`}><MDBIcon icon="user-circle mr-1"/>{this.state.username}</MDBDropdownItem>
                            <MDBDropdownItem href="#!" onClick={this.logout}>
                                <MDBIcon className="mr-1" icon="sign-out-alt"/>Log out</MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                </MDBNavItem>


                <MDBModal isOpen={this.state.questionModal} centered={true} toggle={this.toggle} size="lg">
                    <MDBModalHeader toggle={this.toggle} className="bg-primary">Ask Question</MDBModalHeader>
                    <MDBModalBody>
                        <div id="question">
                            <MDBInput
                                type="textarea"
                                label="Ask Anything..."
                                rows="5"
                                icon="question"
                                onChange={this.onChange}
                                value={this.state.question}
                                name="question"
                                className={!this.state.question?'is-invalid':''}
                                id="question"
                        />

                            <MDBInput
                                type="textarea"
                                label="Describe Your Question[Optional]"
                                rows="5"
                                icon="pencil-alt"
                                onChange={this.onChange}
                                value={this.state.description}
                                name="description"
                            />
                            <div className="d-flex">
                                <MDBIcon className="mt-3" icon="tags" />
                                <ReactTags
                                    tags={this.state.tags}
                                    suggestions={this.state.suggestions}
                                    handleDelete={this.handleDelete.bind(this)}
                                    handleAddition={this.handleAddition.bind(this)}

                                    classNames={{
                                        root: 'react-tags',
                                        rootFocused: 'is-focused',
                                        selected: 'react-tags__selected',
                                        selectedTag: 'react-tags__selected-tag',
                                        selectedTagName: 'react-tags__selected-tag-name',
                                        search: 'react-tags__search',
                                        suggestions:'react-tags__suggestions',
                                        suggestionActive: 'is-active',
                                        suggestionDisabled: 'is-disabled'
                                    }}
                                />
                            </div>
                            <div className="d-flex mt-2">
                                <div className="switch-field">
                                    <input type="radio" id="radio-three" name="askFrom" value="male"
                                           onChange={this.radioChange} checked={this.state.askFrom === "male"}/>
                                    <label htmlFor="radio-three">Male</label>
                                    <input type="radio" id="radio-four" name="askFrom" value="everyone"
                                           checked={this.state.askFrom === "everyone"} onChange={this.radioChange}/>
                                    <label htmlFor="radio-four">Everyone</label>
                                    <input type="radio" id="radio-five" name="askFrom" value="female"
                                           onChange={this.radioChange} checked={this.state.askFrom === "female"}/>
                                    <label htmlFor="radio-five">Female</label>
                                </div>
                                <div className="ml-2 d-flex">
                                    <div className="mt-1"><MDBIcon icon="user-secret" /> Anonymous</div>
                                    <label>
                                        <Toggle
                                            defaultChecked={this.state.anonymous}
                                            onChange={this.handleBaconChange}
                                            className='ml-3 mt-1'
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
                        <MDBBtn color="primary" onClick={this.askQuestion}>{this.state.askBtn}</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
            </div>
        );
        let guest = (
            <div className="d-flex">
                <MDBNavItem>
                    <MDBNavLink className="waves-effect waves-light" to="/signin">
                        <MDBIcon icon="sign-in-alt" className="mr-2" size="lg"/>
                    </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                    <MDBNavLink className="waves-effect waves-light" to="/signup">
                        <MDBIcon icon="user-plus" className="mr-2" size="lg"/>
                    </MDBNavLink>
                </MDBNavItem>
            </div>
        );
        return (
            <div>
                <MDBNavbar color="white" className="NavBar" expand="md" scrolling={true} dark={false}>
                    <MDBNavbarBrand>
                        <strong className="dark-grey-text">Navbar</strong>
                    </MDBNavbarBrand>
                    <MDBNavbarToggler onClick={this.toggleCollapse}/>
                    <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
                        <MDBNavbarNav left>
                            <MDBNavItem active>
                                <MDBNavLink className="waves-effect waves-light" to="/">
                                    <MDBIcon icon="home" className="ml-1 mr-1 mt-2" size="lg"/>
                                </MDBNavLink>
                            </MDBNavItem>

                            <MDBNavItem>
                                <MDBNavLink className="waves-effect waves-light" to="#!">
                                    <MDBIcon fas={""} icon="edit" className="ml-1 mr-1 mt-2" size="lg"/>
                                </MDBNavLink>
                            </MDBNavItem>

                        </MDBNavbarNav>
                        <MDBNavbarNav right>
                            <MDBNavItem>
                                    <div className="md-form my-0">
                                        <input className="form-control mr-sm-2" type="text"
                                               placeholder="Search Anything..." aria-label="Search" id="search" onKeyPress={this.search}
                                        />
                                    </div>
                            </MDBNavItem>
                            {this.state.loggedIn ? user : guest}
                        </MDBNavbarNav>
                    </MDBCollapse>
                </MDBNavbar>

            </div>
        );
    }

}

export default NavBar;
