import React, {Component} from 'react';
import '../CSS/error.css'

class NotFound extends Component {
    constructor(props) {
        super(props);
        document.title = `${process.env.REACT_APP_BRAND}: Internal Server Error`;
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <div className="error">
                    <div className="container-floud">
                        <div className="col-xs-12 ground-color text-center">
                            <div className="container-error-404">
                                <div className="clip">
                                    <div className="shadow"><span className="digit thirdDigit">5</span></div>
                                </div>
                                <div className="clip">
                                    <div className="shadow"><span className="digit secondDigit">0</span></div>
                                </div>
                                <div className="clip">
                                    <div className="shadow"><span className="digit firstDigit">0</span></div>
                                </div>
                                <div className="msg">OH!<span className="triangle"></span></div>
                            </div>
                            <h2 className="h1">Internal server error</h2>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default NotFound;
