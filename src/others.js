import React from 'react';
import ReactDOM from 'react-dom';
import { callApi, showAlert, cookies, _default } from './index.js';
import { api, tobacco_use_0_options, emotional_being_options, login_cookie } from './config.js';

function OtherForm(props) {
    return (
        <React.Fragment>
            <ons-list>
                <ons-list-header><b>Expand the item to answer the question</b></ons-list-header>
                <ons-list-item><ons-list-header>Physical Activity</ons-list-header></ons-list-item>
                <ons-list-item expandable>
                    How many days a week do you engage in moderate to strenuous exercise, such as brisk walking?
                    <div className="expandable-content">
                        <ons-input id="physical_activity_0" type="number" modifier="material" placeholder="Days" style={{ width: '100px' }} value={props.data.physical_activity_0}></ons-input>
                    </div>
                </ons-list-item>
                <ons-list-item expandable>
                    On average, how many minutes per day do you exercise at this level?
                    <div className="expandable-content">
                        <ons-input id="physical_activity_1" type="number" modifier="material" placeholder="Minutes" style={{ width: '100px' }} value={props.data.physical_activity_1}></ons-input>
                    </div>
                </ons-list-item>
                <ons-list-item expandable>
                    Total minutes of moderate to strenuous physical activity per week:
                    <div className="expandable-content">
                        <ons-input id="physical_activity_2" type="number" modifier="material" placeholder="Minutes" style={{ width: '100px' }} value={props.data.physical_activity_2}></ons-input>
                    </div>
                </ons-list-item>
                <ons-list-item><ons-list-header>Sleep</ons-list-header></ons-list-item>
                <ons-list-item expandable>
                    Typical weekday hours of sleep
                    <div className="expandable-content">
                        <ons-input id="sleep_0" type="number" modifier="material" placeholder="Hours" style={{ width: '100px' }} value={props.data.sleep_0}></ons-input>
                    </div>
                </ons-list-item>
                <ons-list-item expandable>
                    Typical weekend hours of sleep
                    <div className="expandable-content">
                        <ons-input id="sleep_1" type="number" modifier="material" placeholder="Hours" style={{ width: '100px' }} value={props.data.sleep_1}></ons-input>
                    </div>
                </ons-list-item>
                <ons-list-item expandable>
                    Quality of sleep
                    <div className="expandable-content">
                        <ons-input id="sleep_2" modifier="material" placeholder="Quality" style={{ width: '100px' }} value={props.data.sleep_2}></ons-input>
                    </div>
                </ons-list-item>
                <ons-list-item><ons-list-header>Tobacco Use</ons-list-header></ons-list-item>
                <ons-list-item expandable>
                    <div>
                        <ons-select id="tobacco_use_0" modifier="material" style={{ float: 'left' }} ref={props.tobacco_use_0}>
                            <option value="Non smoker">Non smoker</option>
                            <option value="Current smoker">Current smoker</option>
                            <option value="Past smoker">Past smoker</option>
                        </ons-select>
                    </div>
                    <div className="expandable-content">
                        <ons-input id="tobacco_use_1" type="number" modifier="material" placeholder="# of sticks/day" style={{ width: '120px' }} value={props.data.tobacco_use_1}></ons-input>&nbsp;sticks/day<br />
                        <ons-input id="tobacco_use_2" type="number" modifier="material" placeholder="# of years" style={{ width: '120px' }} value={props.data.tobacco_use_2}></ons-input>&nbsp;years<br />
                        <ons-input id="tobacco_use_3" type="number" modifier="material" placeholder="pack/year" style={{ width: '120px' }} value={props.data.tobacco_use_3}></ons-input>&nbsp;pack/year
                    </div>
                </ons-list-item>
                <ons-list-item><ons-list-header>Alcohol Use</ons-list-header></ons-list-item>
                <ons-list-item expandable>
                    How many drinks do you consume in any day?
                    <div className="expandable-content">
                        <ons-input id="alcohol_use_0" type="number" modifier="material" placeholder="Quantity" style={{ width: '100px' }} value={props.data.alcohol_use_0}></ons-input>
                    </div>
                </ons-list-item>
                <ons-list-item expandable>
                    How many drinks do you consume in a week?
                    <div className="expandable-content">
                        <ons-input id="alcohol_use_1" type="number" modifier="material" placeholder="Quantity" style={{ width: '100px' }} value={props.data.alcohol_use_1}></ons-input>
                    </div>
                </ons-list-item>
                <ons-list-item><ons-list-header>Emotional Being</ons-list-header></ons-list-item>
                <ons-list-item expandable>
                    In most ways, my life is close to my ideal.
                    <div className="expandable-content">
                        <div>
                            <ons-select id="emotional_being_0" modifier="material" style={{ float: 'left' }} ref={props.emotional_being_0}>
                                <option value="5">5</option>
                                <option value="4">4</option>
                                <option value="3">3</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                            </ons-select>
                        </div>
                    </div>
                </ons-list-item>
                <ons-list-item expandable>
                    I am satisfied with my life.
                    <div className="expandable-content">
                        <div>
                            <ons-select id="emotional_being_1" modifier="material" style={{ float: 'left' }} ref={props.emotional_being_1}>
                                <option value="5">5</option>
                                <option value="4">4</option>
                                <option value="3">3</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                            </ons-select>
                        </div>
                    </div>
                </ons-list-item>
            </ons-list>
        </React.Fragment>
    );
}

export class SaveOthers extends React.Component {
    handleClick = (event) => {
		const payload = {
            id: cookies.get(login_cookie).email,
            physical_activity_0: document.querySelector('#physical_activity_0').value,
            physical_activity_1: document.querySelector('#physical_activity_1').value,
            physical_activity_2: document.querySelector('#physical_activity_2').value,
            sleep_0: document.querySelector('#sleep_0').value,
            sleep_1: document.querySelector('#sleep_1').value,
            sleep_2: document.querySelector('#sleep_2').value,
            tobacco_use_0: document.querySelector('#tobacco_use_0').selectedIndex,
            tobacco_use_1: document.querySelector('#tobacco_use_1').value,
            tobacco_use_2: document.querySelector('#tobacco_use_2').value,
            tobacco_use_3: document.querySelector('#tobacco_use_3').value,
            alcohol_use_0: document.querySelector('#alcohol_use_0').value,
            alcohol_use_1: document.querySelector('#alcohol_use_1').value,
            emotional_being_0: document.querySelector('#emotional_being_0').selectedIndex,
            emotional_being_1: document.querySelector('#emotional_being_1').selectedIndex
        };
		const config = {
			"url": api.users_api_base_url + "/v1/others",
			"method": "POST",
			"timeout": api.users_api_timeout,
			"headers": {
				"Content-Type": "application/json",
                "Authorization": api.users_api_authorization
			},
			"data": payload
		};
		callApi(config, (data) => {
			showAlert("Successfully saved data");
		}, 'others');
	}
	render() {
		return (
			<ons-button modifier="quiet" onClick={this.handleClick}>Save</ons-button>
		);
	}
}

export class Others extends React.Component {
    constructor(props) {
        super(props);

        if (Object.keys(props.data).length !== 0) {
            this.state = props.data;
        } else {
            this.state = {};
        }

        this.tobacco_use_0 = React.createRef();
        this.emotional_being_0 = React.createRef();
        this.emotional_being_1 = React.createRef();
    }
    componentDidMount() {
        const others_saveBtn = document.querySelector('div#others_saveBtn');
        if (others_saveBtn != null) ReactDOM.render(<SaveOthers />, others_saveBtn);

        this.tobacco_use_0.current.selectedIndex = this.state.tobacco_use_0;
        this.emotional_being_0.current.selectedIndex = this.state.emotional_being_0;
        this.emotional_being_1.current.selectedIndex = this.state.emotional_being_1;
    }
    render() {
        return (
            <OtherForm data={this.state} tobacco_use_0={this.tobacco_use_0} emotional_being_0={this.emotional_being_0} emotional_being_1={this.emotional_being_1} />
        );
    }
}

export class OthersProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = props.data;
	}
	render() {
		return (
			<ons-list>
                <ons-list-header style={{ textAlign: 'center' }}>
                    <ons-button modifier="quiet" onClick={()=>{document.querySelector('#carousel').prev()}}><ons-icon icon="md-chevron-left"></ons-icon></ons-button>
                    Others
				</ons-list-header>
				<ons-list-header>Physical Activity</ons-list-header>
                <ons-list-item>
                    <label className="profile">Days a week that are engaged in moderate to strenuous exercise, such as brisk walking</label>
                    <div>{_default(this.state.physical_activity_0, "--")} days</div>
                </ons-list-item>
                <ons-list-item>
                    <label className="profile">Average minutes per day of exercise at this level</label>
                    <div>{_default(this.state.physical_activity_1, "--")} minutes</div>
                </ons-list-item>
                <ons-list-item>
                    <label className="profile">Total minutes of moderate to strenuous physical activity per week</label>
                    <div>{_default(this.state.physical_activity_2, "--")} minutes</div>
                </ons-list-item>
                <ons-list-header>Sleep</ons-list-header>
                <ons-list-item>
                    <label className="profile">Typical weekday hours of sleep</label>
                    <div>{_default(this.state.sleep_0, "--")} hours</div>
                </ons-list-item>
                <ons-list-item>
                    <label className="profile">Typical weekend hours of sleep</label>
                    <div>{_default(this.state.sleep_1, "--")} hours</div>
                </ons-list-item>
                <ons-list-item>
                    <label className="profile">Quality of sleep</label>
                    <div>{_default(this.state.sleep_2, "--")}</div>
                </ons-list-item>
                <ons-list-header>Tobacco Use</ons-list-header>
                <ons-list-item>
                    <div>{_default(tobacco_use_0_options[this.state.tobacco_use_0], "--")}</div>
                </ons-list-item>
                <ons-list-item>
                    <label className="profile">Number of sticks per day</label>
                    <div>{_default(this.state.tobacco_use_1, "--")}</div>
                </ons-list-item>
                <ons-list-item>
                    <label className="profile">Number of years</label>
                    <div>{_default(this.state.tobacco_use_2, "--")}</div>
                </ons-list-item>
                <ons-list-item>
                    <label className="profile">Pack per year</label>
                    <div>{_default(this.state.tobacco_use_3, "--")}</div>
                </ons-list-item>
                <ons-list-header>Alcohol Use</ons-list-header>
                <ons-list-item>
                    <label className="profile">Number of drinks consumed in any day</label>
                    <div>{_default(this.state.alcohol_use_0, "--")}</div>
                </ons-list-item>
                <ons-list-item>
                    <label className="profile">Number of drinks consumed in a week</label>
                    <div>{_default(this.state.alcohol_use_1, "--")}</div>
                </ons-list-item>
                <ons-list-header>Emotional Being</ons-list-header>
                <ons-list-item>
                    <label className="profile">In most ways, life is close to ideal</label>
                    <div>{_default(emotional_being_options[this.state.emotional_being_0], "--")}</div>
                </ons-list-item>
                <ons-list-item>
                    <label className="profile">Satisfied with life</label>
                    <div>{_default(emotional_being_options[this.state.emotional_being_1], "--")}</div>
                </ons-list-item>
			</ons-list>
		);
	}
}