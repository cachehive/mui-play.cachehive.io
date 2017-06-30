import axios from 'axios';
import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {AutoComplete} from 'material-ui';
import getMuiTheme        from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider   from 'material-ui/styles/MuiThemeProvider';
import Modal from 'react-modal';
import JSONP from 'jsonp';
import injectTapEventPlugin from 'react-tap-event-plugin';
import YoutubeFinder        from 'youtube-finder';


injectTapEventPlugin();

const googleAutoSuggestURL = '//suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

class App extends Component {
    constructor() {
        super();

        this.state = {
            dataSource: [],
            inputValue: '',
            videoList: '',
            modalIsOpen: false
        }

        this.onUpdateInput = this.onUpdateInput.bind(this);
        this.onNewRequest   = this.onNewRequest.bind(this);
        this.processResults = this.processResults.bind(this);
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.sendMailAddress = this.sendMailAddress.bind(this);



        this.YoutubeClient  = YoutubeFinder.createClient({ key: process.env.YOUTUBE_API });
        //this.YoutubeClient  = YoutubeFinder.createClient({ key: 'AIzaSyAncE-lCxMRnkVpSbs-v29c3dcG4Qq9iFQ' });

    }

    componentWillMount() {
        console.log( 'youtube API Key: ' + process.env.YOUTUBE_API );
    }

    onUpdateInput(inputValue) {
        const self = this;

        this.setState({
            inputValue : inputValue
        },function(){
            self.performSearch();
        });
    }

    onNewRequest(searchTerm) {
        const
//            self   = this,
            params = {
                part        : 'id,snippet',
                type        : 'video',
                q           : this.state.inputValue,
                maxResults  : this.props.maxResults <= 50 ? this.props.maxResults : '50'
            }

        this.YoutubeClient.search( params, this.processResults );
        /*
        this.YoutubeClient.search(params, function(error,results) {
            if(error) return console.log(error);
            self.props.callback(results.items,searchTerm);
            self.setState({
                dataSource : [],
                inputValue : ''
            });
        });
        */
    }

    processResults( err, results ) {
        if(err) return console.log(err);
        //this.props.callback(results.items,searchTerm);
        this.setState({
            dataSource : [],
            inputValue : '',
            videoList: results.items
        });
    }

    performSearch() {
        const
            self = this,
            url  = googleAutoSuggestURL + this.state.inputValue;

        if(this.state.inputValue !== '') {
            JSONP(url, function(error, data) {
                let searchResults, retrievedSearchTerms;

                if(error) return error;

                searchResults = data[1];

                retrievedSearchTerms = searchResults.map(function(result) {
                    return result[0];
                });

                self.setState({
                    dataSource: retrievedSearchTerms
                });
            });
        }
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    sendMailAddress() {
        console.log( 'TODO: Implement' );
        axios.post('/api', { firstName: 'first', lastName: 'last', email: 'first@last.com' })
            .then(function(response){
                console.log('saved successfully')
            });
    }


    renderVideos(){
        if (this.state.videoList.length > 0) {
            console.log( this.state.videoList );

            return (
                this.state.videoList.map( element => {
                    return (
                        <div className="container col-md-8 col-xs-6 col-md-offset-2">
                            <div className="container-fluid col-md-8">
                                <p>{element.snippet.toString()}</p>
                            </div>
                            <div className="container-fluid col-md-4">
                                <div className="text-center"></div>
                            </div>
                        </div>
                    );
                })
            )
        }
    }

//     <p>{element.snippet.title}</p>

    render() {

        var items = this.renderVideos();

        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Material-UI Playground</h2>
                    <h4>By: cachehive.com</h4>
                </div>
                <p className="App-intro">
                    A test environment to experiment with different React components.
                </p>

                <div >
                    <div>

                        <MuiThemeProvider muiTheme={getMuiTheme()}>
                            <AutoComplete className="search"
                                          dataSource={this.state.dataSource}
                                          onUpdateInput={this.onUpdateInput}
                                          onNewRequest={this.onNewRequest} />
                        </MuiThemeProvider>
                    </div>
                    <div>
                        <button onClick={this.openModal}>Open Modal</button>
                        <button onClick={this.sendMailAddress}>Send Address</button>
                    </div>
                </div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <div className="x-button" onClick={this.closeModal}>
                        <i className="fa fa-times-circle fa-2x" aria-hidden="false"></i>
                    </div>

                    <h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2>
                    <button onClick={this.closeModal}>close</button>
                    <div>I am a modal</div>
                    <form>
                        <input />
                        <button>tab navigation</button>
                        <button>stays</button>
                        <button>inside</button>
                        <button>the modal</button>
                    </form>
                </Modal>
                { items }
            </div>
        );
    }
}

export default App;
