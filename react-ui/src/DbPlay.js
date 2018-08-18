import React from 'react'
//import * as firebase from 'firebase'

//import base, { auth } from './base'
import base from './base'

export default class DbPlay extends React.Component {

    constructor() {
        super()

        this.state = {
            speed: 0,
        }
    }
    
    componentWillMount() {
       
        this.raceRef = base.syncState( `raceData`, {
            context: this,
            state: 'speed',
            asArray: false,
        })
    }

    componentWillUnmount() {
        base.removeBinding( this.raceRef )
    }

    addSpeed = ( ) => {
        const sp = this.state.speed + 10       
        
        this.setState( () =>  ({
            speed: sp,
        }))
    }

    subtractSpeed = ( ) => {
        const sp = this.state.speed - 10       
        
        this.setState( () =>  ({
            speed: sp,
        }))
    }

    render() {

        return (
            <div className="DbPlay"> 
                <h6>DbPlay Stuff</h6>
                <p>Speed = {this.state.speed}</p>
                <div>
                    <button onClick={this.subtractSpeed}>-</button>
                    <button onClick={this.addSpeed}>+</button>
                </div>
            </div>
        )
    }
}