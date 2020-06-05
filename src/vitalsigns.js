import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';
import { cookies, callApi, showAlert, formatDate, formatTime, back, formatToDateString, formatToTimeString, _default } from './index.js';
import { api, login_cookie } from './config.js';
import ons from 'onsenui';

function VitalSignsForm(props) {
    const id = props.vsList[props.index].id;
    const bgcolor = props.index % 2 === 0 ? '#ffffff' : '#f0f0f5';
    return (
        <React.Fragment>
            <div style={{ backgroundColor: bgcolor }}>
                <ons-list-item>
                    <label className="form">Date</label>
                    <ons-input id={"vs_date" + id} style={{ display: 'none' }} value={props.vsList[props.index].vs_date == null || props.vsList[props.index].vs_date.length === 0 ? formatDate(new Date()) : props.vsList[props.index].vs_date} ></ons-input>
                    <DatePicker onChange={date => { props.onDateChangeCallback(props.index, date) }} value={props.vsList[props.index].vs_date == null || props.vsList[props.index].vs_date.length === 0 ? new Date() : new Date(props.vsList[props.index].vs_date)} clearIcon={null} />
                </ons-list-item>
                <ons-list-item>
                    <label className="form">Time</label>
                    <ons-input id={"vs_time" + id} style={{ display: 'none' }} value={props.vsList[props.index].vs_time == null || props.vsList[props.index].vs_time.length === 0 ? formatTime(new Date()) : props.vsList[props.index].vs_time} ></ons-input>
                    <TimePicker onChange={time => { props.onTimeChangeCallback(props.index, time) }} value={props.vsList[props.index].vs_time == null || props.vsList[props.index].vs_time.length === 0 ? new Date() : props.vsList[props.index].vs_time + ':00'} clearIcon={null} />
                </ons-list-item>
                <ons-list-item>
                    <label className="form">Blood Pressure</label>
                    <ons-input id={"vs_bloodpressure" + id} modifier="material" value={props.vsList[props.index].vs_bloodpressure}></ons-input>
                </ons-list-item>
                <ons-list-item>
                    <label className="form">Heart Rate</label>
                    <ons-input id={"vs_heartrate" + id} type="number" modifier="material" value={props.vsList[props.index].vs_heartrate}></ons-input>&nbsp;bpm
                </ons-list-item>
                <ons-list-item>
                    <label className="form">Respiratory Rate</label>
                    <ons-input id={"vs_respirate" + id} type="number" modifier="material" value={props.vsList[props.index].vs_respirate}></ons-input>&nbsp;cpm
                </ons-list-item>
                <ons-list-item>
                    <label className="form">Temperature</label>
                    <ons-input id={"vs_temp" + id} type="number" modifier="material" value={props.vsList[props.index].vs_temp}></ons-input>&nbsp;Celsius
                </ons-list-item>
                <ons-list-item>
                    <label className="form">Weight</label>
                    <ons-input id={"vs_weight" + id} type="number" modifier="material" value={props.vsList[props.index].vs_weight}></ons-input>&nbsp;
                    { props.vsList[props.index].vs_weight_unit === "kg" ? <ons-radio name={"vs_weight_unit" + id} input-id="weight_kg" value="kg" checked>kg</ons-radio> : <ons-radio name={"vs_weight_unit" + id} input-id="weight_kg" value="kg">kg</ons-radio> }&nbsp; 
                    { props.vsList[props.index].vs_weight_unit === "lbs" ? <ons-radio name={"vs_weight_unit" + id} input-id="weight_lbs" value="lbs" checked>lbs</ons-radio> : <ons-radio name={"vs_weight_unit" + id} input-id="weight_lbs" value="lbs">lbs</ons-radio> }
                </ons-list-item>
                <ons-list-item>
                    <label className="form">Height</label>
                    <ons-input id={"vs_height" + id} type="number" modifier="material" value={props.vsList[props.index].vs_height}></ons-input>&nbsp;cm
                </ons-list-item>
                <ons-list-item>
                    <label className="form">Body Mass Index</label>
                    <ons-input id={"vs_bmi" + id} type="number" modifier="material" value={props.vsList[props.index].vs_bmi}></ons-input>
                </ons-list-item>
                <ons-list-item>
                    <label className="form">Waist Circumference</label>
                    <ons-input id={"vs_waistcirc" + id} type="number" modifier="material" value={props.vsList[props.index].vs_waistcirc}></ons-input>&nbsp;cm
                </ons-list-item>
                <ons-list-item>
                    <label className="form">Hip Circumference</label>
                    <ons-input id={"vs_hipcirc" + id} type="number" modifier="material" value={props.vsList[props.index].vs_hipcirc}></ons-input>&nbsp;cm
                </ons-list-item>
                <ons-list-item>
                    <label className="form">Waist/Hip Ratio</label>
                    <ons-input id={"vs_whratio" + id} modifier="material" value={props.vsList[props.index].vs_whratio}></ons-input>
                </ons-list-item>
            </div>
        </React.Fragment>
    );
}

export class SaveVitalSigns extends React.Component {
    handleClick = (event) => {
        saveVitalSigns(() => {
            back();
            const refresh = document.querySelector('#refresh_vitalsigns');
            if (refresh != null) {
                refresh.click();
            }
        });
    }
    render() {
        return (
            <React.Fragment>
                <ons-button modifier="quiet" onClick={this.handleClick}>Save</ons-button>
            </React.Fragment>
        );
    }
}

export class NewVitalSignItem extends React.Component {
    constructor(props) {
        super(props);

        if (Object.keys(props.data).length !== 0) {
            this.state = props.data;
        } else {
            this.state = {
                vsList: []
            }
        }

        this.index = null;
    }
    componentDidMount() {
        const save_new_vs = document.querySelector('div#save_new_vs');
        if (save_new_vs != null) ReactDOM.render(<SaveVitalSigns />, save_new_vs);
    }
    handleDateChange = (index, date) => {
        if (date != null) {
            const formattedDate = formatDate(date);
            this.setState(state => {
                state.vsList[index].vs_date = formattedDate
                return {
                    vsList: state.vsList
                }
            });
        }
    }
    handleTimeChange = (index, time) => {
        if (time != null) {
            this.setState(state => {
                state.vsList[index].vs_time = time
                return {
                    vsList: state.vsList
                }
            });
        }
    }
    render() {
        return (
            <React.Fragment>
                <div className="content">
                    <ons-list>
                        <div className="vs_list">
                            <VitalSignsForm value={this.state.vsList[0]} index={0} vsList={this.state.vsList} onDateChangeCallback={this.handleDateChange} onTimeChangeCallback={this.handleTimeChange} />
                        </div>
                    </ons-list>
                </div>
            </React.Fragment>
        );
    }
}

export class VitalSigns extends React.Component {
    constructor(props) {
        super(props);

        if (Object.keys(props.data).length !== 0) {
            this.state = props.data;
        } else {
            this.state = {
                vsList: []
            }
        }

        this.index = null;
    }
    removeVitalSign = (value) => {
        if (value === 1) {
            const id = this.index;
            this.setState(state => {
                const currentVSList = state.vsList;
                const filteredVSList = currentVSList.filter((item) => item.id !== "_" + id);
                return {
                    vsList: filteredVSList.map((item, index) => {
                        item.id = "_" + index;
                        return item;
                    })
                }
            }, () => { saveVitalSigns(()=>{}, this.state) });
        }
    }
    addVitalSign = (event) => {
        const nav = document.querySelector('#navigator');
        const vs_list_length = document.querySelectorAll('div.vs_list') ? document.querySelectorAll('div.vs_list').length : 0;
        nav.pushPage('new_vitalsign.html').then(() => {
            const new_component = document.querySelector('#new_vs_component');
            const initial_state = {
                vsList: [{
                    id: "_" + vs_list_length,
                    vs_date: "",
                    vs_time: "",
                    vs_bloodpressure: "",
                    vs_heartrate: "",
                    vs_respirate: "",
                    vs_temp: "",
                    vs_weight: "",
                    vs_weight_unit: "",
                    vs_height: "",
                    vs_bmi: "",
                    vs_waistcirc: "",
                    vs_hipcirc: "",
                    vs_whratio: ""
                }]
            };
            ReactDOM.render(<NewVitalSignItem data={initial_state} />, new_component);
        });
    }
    confirm = (event) => {
        this.index = event.target.getAttribute('index');
        ons.notification.confirm('Are you sure you want to delete?').then(this.removeVitalSign);
    }
    handleDateChange = (index, date) => {
        if (date != null) {
            const formattedDate = formatDate(date);
            this.setState(state => {
                state.vsList[index].vs_date = formattedDate
                return {
                    vsList: state.vsList
                }
            });
        }
    }
    handleTimeChange = (index, time) => {
        if (time != null) {
            this.setState(state => {
                state.vsList[index].vs_time = time
                return {
                    vsList: state.vsList
                }
            });
        }
    }
    componentDidMount() {
        const vitalsigns_saveBtn = document.querySelector('div#vitalsigns_saveBtn');
        if (vitalsigns_saveBtn != null) ReactDOM.render(<SaveVitalSigns />, vitalsigns_saveBtn);

        const fab_add_vitalsign = document.querySelector('#fab_add_vitalsign');
        if (fab_add_vitalsign != null) {
            fab_add_vitalsign.addEventListener('click', this.addVitalSign);
        }
    }
    handleChangeState = (event) => {
        if (event.type === 'changestate' || event.state === "action") {
            refreshVitalSigns(this.refreshVSList);
        }
    }
    refreshVSList = (data) => {
        this.setState(data);
    }
    render() {
        return (
            <React.Fragment>
                <div className="content">
                    <ons-list>
                        {
                            this.state.vsList.map((value, index) =>
                                <div className="vs_list">
                                    <ons-list-header style={{ backgroundColor: '#e6f2ff' }}>
                                        <b>Enter the details</b>
                                        <div style={{ display: 'inline-block' }}>
                                            <ons-button index={index} modifier="quiet" onClick={this.confirm}>
                                                <ons-icon index={index} icon="md-delete"></ons-icon>
                                            </ons-button>
                                        </div>
                                    </ons-list-header>
                                    <VitalSignsForm value={value} index={index} vsList={this.state.vsList} onDateChangeCallback={this.handleDateChange} onTimeChangeCallback={this.handleTimeChange} />
                                </div>
                            )
                        }
                    </ons-list>
                </div>
                <div id="refresh_vitalsigns" onClick={(event)=>{ refreshVitalSigns((data)=> {this.refreshVSList(data)}) }}></div>
            </React.Fragment>
        );
    }
}

function refreshVitalSigns(successCallBack) {
    const config = {
        "url": api.users_api_base_url + "/v1/vitalSigns",
        "method": "GET",
        "timeout": api.users_api_timeout,
        "headers": {
            "Authorization": api.users_api_authorization,
            "JWT": cookies.get(login_cookie).access_token
        },
        "params": {
            "id": cookies.get(login_cookie).email
        }
    };
    callApi(config, successCallBack, 'vitalsigns');
}

function saveVitalSigns(callBack = () => {}, data = null) {
    let vsList = null;
    if (data == null) {
        const vsCount = document.querySelectorAll('div.vs_list').length;
        vsList = [];
        for (let i = 0; i < vsCount; i++) {
            const vs = {
                id: "_" + i,
                vs_date: document.querySelector('#vs_date_' + i).value,
                vs_time: document.querySelector('#vs_time_' + i).value,
                vs_bloodpressure: document.querySelector('#vs_bloodpressure_' + i).value,
                vs_heartrate: document.querySelector('#vs_heartrate_' + i).value,
                vs_respirate: document.querySelector('#vs_respirate_' + i).value,
                vs_temp: document.querySelector('#vs_temp_' + i).value,
                vs_weight: document.querySelector('#vs_weight_' + i).value,
                vs_weight_unit: document.querySelector('input[name=vs_weight_unit_' + i + ']:checked') ? document.querySelector('input[name=vs_weight_unit_' + i + ']:checked').value : "",
                vs_height: document.querySelector('#vs_height_' + i).value,
                vs_bmi: document.querySelector('#vs_bmi_' + i).value,
                vs_waistcirc: document.querySelector('#vs_waistcirc_' + i).value,
                vs_hipcirc: document.querySelector('#vs_hipcirc_' + i).value,
                vs_whratio: document.querySelector('#vs_whratio_' + i).value
            }
            vsList.push(vs);
        }
    } else {
        vsList = data.vsList;
    }

    if (vsList != null) {
        const payload = {
            id: cookies.get(login_cookie).email,
            vsList: vsList
        }
        const config = {
            "url": api.users_api_base_url + "/v1/vitalSigns",
            "method": "POST",
            "timeout": 60000,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": api.users_api_authorization,
                "JWT": cookies.get(login_cookie).access_token
            },
            "data": payload
        };
        callApi(config, (data) => {
            showAlert("Successfully saved data");
            callBack();
        }, 'vitalsigns');
    }
}

export class VitalSignsProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = props.data;
	}
	render() {
        const vsList = this.state.vsList || [];
		return (
			<ons-list>
				<ons-list-header style={{ textAlign: 'center' }}>
                    <ons-button modifier="quiet" onClick={()=>{document.querySelector('#carousel').prev()}}><ons-icon icon="md-chevron-left"></ons-icon></ons-button>
                    Vital Signs
					<ons-button modifier="quiet" onClick={()=>{document.querySelector('#carousel').next()}}><ons-icon icon="md-chevron-right"></ons-icon></ons-button>
				</ons-list-header>
                {
                    vsList.map((item, index) => {
                        const bgcolor = index % 2 === 0 ? '#ffffff' : '#f2f2f2';
                        return (
                            <div style={{ backgroundColor: bgcolor }}>
                                <ons-list-item>
                                    <label className="profile">Date</label>
					                <div>{_default(formatToDateString(item.vs_date), "--")}</div>
                                </ons-list-item>
                                <ons-list-item>
                                    <label className="profile">Time</label>
					                <div>{_default(formatToTimeString(item.vs_time), "--")}</div>
                                </ons-list-item>
                                <ons-list-item>
                                    <label className="profile">Blood Pressure</label>
					                <div>{_default(item.vs_bloodpressure, "--")}</div>
                                </ons-list-item>
                                <ons-list-item>
                                    <label className="profile">Heart Rate (bpm)</label>
					                <div>{_default(item.vs_heartrate, "--")}</div>
                                </ons-list-item>
                                <ons-list-item>
                                    <label className="profile">Respiratory Rate (cpm)</label>
					                <div>{_default(item.vs_respirate, "--")}</div>
                                </ons-list-item>
                                <ons-list-item>
                                    <label className="profile">Temperature (Celsius)</label>
					                <div>{_default(item.vs_temp, "--")}</div>
                                </ons-list-item>
                                <ons-list-item>
                                    <label className="profile">Weight ({item.vs_weight_unit})</label>
					                <div>{_default(item.vs_weight, "--")}</div>
                                </ons-list-item>
                                <ons-list-item>
                                    <label className="profile">Height (cm)</label>
					                <div>{_default(item.vs_height, "--")}</div>
                                </ons-list-item>
                                <ons-list-item>
                                    <label className="profile">Body Mass Index</label>
					                <div>{_default(item.vs_bmi, "--")}</div>
                                </ons-list-item>
                                <ons-list-item>
                                    <label className="profile">Waist Circumference (cm)</label>
					                <div>{_default(item.vs_waistcirc, "--")}</div>
                                </ons-list-item>
                                <ons-list-item>
                                    <label className="profile">Hip Circumference (cm)</label>
					                <div>{_default(item.vs_hipcirc, "--")}</div>
                                </ons-list-item>
                                <ons-list-item>
                                    <label className="profile">Waist/Hip Ratio</label>
					                <div>{_default(item.vs_whratio, "--")}</div>
                                </ons-list-item>
                            </div>
                        )
                    })
                }
			</ons-list>
		);
	}
}