import axios from 'axios';
import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {AutoComplete} from 'material-ui';
import getMuiTheme        from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider   from 'material-ui/styles/MuiThemeProvider';

import JSONP from 'jsonp';
import injectTapEventPlugin from 'react-tap-event-plugin';
import YoutubeFinder        from 'youtube-finder';

import DbPlay from './DbPlay'
import ModalPlay from './ModalPlay'


injectTapEventPlugin();

const googleAutoSuggestURL = '//suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=';


class App extends Component {
    constructor() {
        super();

        this.state = {
            dataSource: [],
            videoList: '',
            inputValue: '',
            modalIsOpen: false
        }

        this.YoutubeClient  = YoutubeFinder.createClient({ key: process.env.REACT_APP_YOUTUBE_API });
    }

    componentWillMount() {
        console.log( 'youtube API Key: ' + process.env.REACT_APP_YOUTUBE_API );
    }

    onUpdateInput(inputValue) {
        const self = this;

        this.setState({
            inputValue : inputValue
        },function(){
            self.performSearch();
        });
    }

    onNewRequest = (searchTerm) => {
        const
            params = {
                part        : 'id,snippet',
                type        : 'video',
                q           : this.state.inputValue,
                maxResults  : this.props.maxResults <= 50 ? this.props.maxResults : '50'
            }

        this.YoutubeClient.search( params, this.processResults );
    }

    processResults = ( err, results ) => {
        if(err) return console.log(err);
        //this.props.callback(results.items,searchTerm);
        this.setState({
            dataSource : [],
            inputValue : '',
            videoList: results.items
        });
    }

    performSearch = () => {
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

   
    sendMailAddress = () => {
        //console.log( 'TODO: Implement' );
        axios.post('/api', { firstName: 'first', lastName: 'last', email_address: 'first@last.com' })
            .then(function(response){
                console.log('saved successfully')
            });
    }

    renderVideos = () => {
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

    renderHeader = () => {
        return(
            <div className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <h2>Material-UI Playground</h2>
                <h4>By: cachehive.com</h4>
            </div>
        )
    }

    renderTagline = () => {
        return(
            <p className="App-intro">
                A test environment to experiment with different React components.
            </p>
        )
    }

    render() {

        var items = this.renderVideos();

        return (
            <div className="App">
                {this.renderHeader()}
                {this.renderTagline()}
                <div className="components" >
                    <div className="comp-container" >
                        <h5>MuiThemeProvider</h5>
                        <MuiThemeProvider muiTheme={getMuiTheme()}>
                            <AutoComplete className="search"
                                          dataSource={this.state.dataSource}
                                          onUpdateInput={this.onUpdateInput}
                                          onNewRequest={this.onNewRequest} id="search" />
                        </MuiThemeProvider>

                        { items }

                    </div>
                    <div className="comp-container" > 
                        <h5>Send Email to MailChimp</h5>
                        <button onClick={this.sendMailAddress}>Send Address</button>
                    </div>
                
                    <div className="comp-container" >
                        <h5>Connect to Firebase</h5>
                        
                        <DbPlay />
                    </div>
                    <div className="comp-container" >
                        <h5>Modal Play</h5>
                        <ModalPlay />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
