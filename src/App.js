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

const googleAutoSuggestURL = `
  //suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=`;


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
            modalIsOpen: false
        }

        this.onUpdateInput = this.onUpdateInput.bind(this);
        this.onNewRequest   = this.onNewRequest.bind(this);
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        //this.YoutubeClient  = YoutubeFinder.createClient({ key: process.env.YOUTUBE_API });

    }

    onUpdateInput(inputValue) {
        const self = this;
        this.setState({
            inputValue: inputValue
        }, function() {
            self.performSearch();
        });
    }

    onNewRequest() {
        alert('alert 123');
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

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Welcome to React</h2>
                </div>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
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
            </div>
        );
    }
}

export default App;
