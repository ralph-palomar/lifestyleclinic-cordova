import React from 'react';
import ReactDOM from 'react-dom';
import { diet_list, api, login_cookie } from './config.js';
import { cookies, callApi, showAlert, _default } from './index.js';

function DietForm(props) {
    return(
        <React.Fragment>
            <ons-list>
                    <ons-list-header><b>Expand the item to specify the quantity</b></ons-list-header>
                    {
                        props.data.dietList.map((value, index) =>
                            <ons-list-item key={value.displayText} expandable>  
                                {value.displayText}
                                <div className="expandable-content">
                                    <ons-input id={value.id+"_qty"} type="number" modifier="material" placeholder="Quantity" style={{width: '100px'}} value={value.quantity}></ons-input>
                                    <br/>
                                    <ons-select id={value.id+"_unit"} modifier="material" selectedIndex={value.unit_selected} ref={ref=>{props.unitRef[index]=ref}}>
                                        <option value="serve">serve</option>
                                        <option value="cup">cup</option>
                                        <option value="cup raw">cup raw</option>
                                        <option value="cup cooked">cup cooked</option>
                                        <option value="tbsp">tbsp</option>
                                        <option value="handful">handful</option>
                                        <option value="glass">glass</option>
                                        <option value="piece">piece</option>
                                        <option value="pack">pack</option>
                                    </ons-select>
                                </div>
                            </ons-list-item>              
                        )
                    }
                </ons-list>
        </React.Fragment>
    );
}

export class SaveDiet extends React.Component {
	handleClick = (event) => {
        const dietList = diet_list.map((item) => {
            const quantity_dom = document.querySelector('#'+item.id+'_qty');
            const unit_dom = document.querySelector('#'+item.id+'_unit');
            let quantity, unit, unit_selected;
            if (quantity_dom != null) {
                quantity = quantity_dom.value;
            }
            if (unit_dom != null) {
                unit = unit_dom.value;
                unit_selected = unit_dom.selectedIndex; 
            }
            return {
                displayText: item.displayText,
                id: item.id,
                quantity: quantity,
                unit: unit,
                unit_selected: unit_selected
            }
        });
		const payload = {
            id: cookies.get(login_cookie).email,
            dietList: dietList
        };
		const config = {
			"url": api.users_api_base_url + "/v1/diet",
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
		}, 'diet');
	}
	render() {
		return (
			<ons-button modifier="quiet" onClick={this.handleClick}>Save</ons-button>
		);
	}
}

export class Diet extends React.Component {
    constructor(props) {
        super(props);

        if (Object.keys(props.data).length !== 0) {
            this.state = props.data;
        } else {
            this.state = {
                dietList: diet_list
            }
        }

        this.unit = [];
    }
    componentDidMount() {
        const diet_saveBtn = document.querySelector('div#diet_saveBtn');
        if (diet_saveBtn != null) ReactDOM.render(<SaveDiet />, diet_saveBtn);

        this.state.dietList.forEach((item, index) => {
            this.unit[index].selectedIndex = item.unit_selected;
        });
    }
    render() {
        return (
            <DietForm data={this.state} unitRef={this.unit}/>
        );
    }
}

export class DietProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = props.data;
	}
	render() {
        const dietList = this.state.dietList || [];
		return (
			<ons-list>
				<ons-list-header style={{ textAlign: 'center' }}>
                    <ons-button modifier="quiet" onClick={()=>{document.querySelector('#carousel').prev()}}><ons-icon icon="md-chevron-left"></ons-icon></ons-button>
                    Diet
					<ons-button modifier="quiet" onClick={()=>{document.querySelector('#carousel').next()}}><ons-icon icon="md-chevron-right"></ons-icon></ons-button>
				</ons-list-header>
                {
                    dietList.map((item) => {
                        return (
                            <ons-list-item>
                                <label className="profile">{item.displayText}</label>
                                <div>{_default(item.quantity, "--")} {item.unit}</div>
                            </ons-list-item>
                        )
                    })
                }
			</ons-list>
		);
	}
}