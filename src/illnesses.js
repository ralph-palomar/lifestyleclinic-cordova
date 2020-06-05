import React from 'react';
import ReactDOM from 'react-dom';
import { cookies, callApi, showAlert, _default } from './index.js';
import { illnesses, api, login_cookie } from './config.js';

export class SaveIllnesses extends React.Component {
	handleClick = (event) => {
		const payload = {
            id: cookies.get(login_cookie).email,
            illnessesList: illnesses.map((value, index) => {
                return {
                    selected: document.querySelector('#illness_'+index).checked,
                    displayText: value
                }
            }),
            illness_others: document.querySelector('#illness_others').value
        }
		const config = {
			"url": api.users_api_base_url + "/v1/illnesses",
			"method": "POST",
			"timeout": api.users_api_timeout,
			"headers": {
                "Content-Type": "application/json",
                "Authorization": api.users_api_authorization,
                "JWT": cookies.get(login_cookie).access_token
			},
			"data": payload
		};
		callApi(config, (data) => {
			showAlert("Successfully saved data");
		}, 'illnesses');
	}
	render() {
		return (
			<ons-button modifier="quiet" onClick={this.handleClick}>Save</ons-button>
		);
	}
}

export class Illnesses extends React.Component {
    constructor(props) {
        super(props);
        let currentState;
        if (Object.keys(props.data).length === 0) {
            currentState = {
                illnessesList: illnesses.map((value) => {
                    return {
                        selected: false,
                        displayText: value
                    }
                })
            }
        } else {
            currentState = props.data;
        }
        this.state = currentState;
    }
    componentDidMount() {
        const illnesses_saveBtn = document.querySelector('div#illnesses_saveBtn');
        if (illnesses_saveBtn != null) ReactDOM.render(<SaveIllnesses/>, illnesses_saveBtn);
    }
    render() {
        return (
        <React.Fragment> 
            <ons-list>
                <ons-list-header style={{ backgroundColor: '#e6f2ff'}}><b>Please select</b></ons-list-header>
                {
                    this.state.illnessesList.map((value, index) =>
                        <ons-list-item key={value.displayText} tappable>  
                            <label className="left">
                            {value.selected ? <ons-checkbox id={"illness_"+index} input-id={value.displayText} checked></ons-checkbox> : <ons-checkbox id={"illness_"+index} input-id={value.displayText}></ons-checkbox> }
                            </label>
                            <label htmlFor={value.displayText} className="center">
                                {value.displayText}
                            </label>
                        </ons-list-item>              
                    )
                }
                <ons-list-item>
                    <label className="form">Specify Others</label>
                    <textarea id="illness_others" className="textarea" rows="3" cols="35" defaultValue={this.state.illness_others || ""}></textarea>
                </ons-list-item> 
            </ons-list>  
        </React.Fragment>
        );
    }
}

export class IllnessesProfile extends React.Component {
	constructor(props) {
		super(props);
        this.state = props.data;
	}
	render() {
        const illnessesList = this.state.illnessesList || [];
		return (
			<ons-list>
                <ons-list-header style={{ textAlign: 'center' }}>
                    <ons-button modifier="quiet" onClick={()=>{document.querySelector('#carousel').prev()}}><ons-icon icon="md-chevron-left"></ons-icon></ons-button>
                    Illnesses/Conditions
					<ons-button modifier="quiet" onClick={()=>{document.querySelector('#carousel').next()}}><ons-icon icon="md-chevron-right"></ons-icon></ons-button>
				</ons-list-header>
                {
                    illnessesList.filter(item => item.selected === true).map(item => {
                        return (
                            <ons-list-item>
                                {item.displayText}
                            </ons-list-item>
                        )
                    })
                }
                <ons-list-item>
                    <label className="profile">Others</label>
                        <div>{_default(this.state.illness_others, "--")}</div>
                    </ons-list-item>
			</ons-list>
		);
	}
}