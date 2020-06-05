import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import './index.css';
import 'material-design-iconic-font/dist/css/material-design-iconic-font.min.css';

import { api, defaultImg, login_cookie, cookieSettings, emailRegExp, defaultEmailSender } from './config.js';
import React from 'react';
import ReactDOM from 'react-dom';
import { loadPage, getUserPhoto, resetUserPassword, sendEmail, verifyResetPassword, putUser, verifyUserId, obtainVerificationCode, verifyAccount } from './home.js';
import axios from 'axios';
import ons from 'onsenui';
import Cookies from 'universal-cookie';
import FacebookLogin from 'react-facebook-login';
import 'cordova_script';

export const cookies = new Cookies();

export function login() {
	const email = document.querySelector('#index_email').value;
	const password = document.querySelector('#index_password').value;

	if (!email || !password) {
		showAlert("Please enter username/password");
	} else {
		const config = {
			"url": api.users_api_base_url + "/v1/users",
			"method": "GET",
			"timeout": api.users_api_timeout,
			"headers": {
				"email": email,
				"password": password,
				"Authorization": api.users_api_authorization
			}
		};
		callApi(config, (data) => {
			if (Object.keys(data).length !== 0) {
				setLoginCookie(data);
				home();
			}
		}, 'login');
	}
}

export function register() {
	const navigator = document.querySelector('#navigator');
	navigator.pushPage('register.html')
}

export function createAccount() {
	const email = document.querySelector('#register_email').value;
	const firstname = document.querySelector('#register_firstname').value;
	const lastname = document.querySelector('#register_lastname').value;
	const passwd = document.querySelector('#register_password').value;
	const cpasswd = document.querySelector('#register_cpassword').value;

	if (validateRegistrationForm(email, firstname, lastname, passwd, cpasswd)) {
		const payload = {
			"email": email,
			"password": passwd,
			"firstname": firstname,
			"lastname": lastname,
			"type": "user",
			"enabled": false
		};
		const config = {
			"url": api.users_api_base_url + "/v1/users",
			"method": "POST",
			"timeout": api.users_api_timeout,
			"headers": {
				"Content-Type": "application/json",
				"Authorization": api.users_api_authorization
			},
			"data": payload
		};
		callApi(config, (data) => {
			if (Object.keys(data).length !== 0) {
				const userInfoData = {
					email: email,
					enabled: true
				}
				obtainVerificationCode((data)=>{
					sendEmail({
						to: userInfoData.email,
						from: defaultEmailSender,
						subject: "Account Verification Request",
						body:
							'To proceed please click the link below:\n\n' +
								data.callbackUrl +
							'\n\nPlease note that this request is only valid for 1 hour. Please ignore this email if you did not request for account verification.'
					});

					showAlert("Account successfully created. Please check your email to verify your account.")
				}, userInfoData);

				back();
			}
		}, 'register');
	}
}

export function back() {
	try {
		const navigator = document.querySelector('#navigator');
		if (navigator != null && navigator.getAttribute('_is-running') !== false) {
			navigator.popPage();
		}
	} catch(exc) {

	}
}

function home() {
	const navigator = document.querySelector('#navigator');
	if (navigator != null) {
		navigator.pushPage('home.html');
	}
}

export function logout() {
	document.querySelector('#confirm-dialog').show();
}

/////// HELPER FUNCTIONS ///////

function validateRegistrationForm(email, firstname, lastname, passwd, cpasswd) {
	if (!emailRegExp.test(email)) {
		showAlert('Invalid Email Address');
	} else if (firstname.length === 0) {
		showAlert('First Name is blank');
	} else if (lastname.length === 0) {
		showAlert('Last Name is blank');
	} else if (!validatePasswords(passwd, cpasswd)) {
		// no pass
	} else {
		return true;
	}
	return false;
}

export function validatePasswords(passwd, cpasswd) {
	if (passwd.length === 0) {
		showAlert('Password is blank');
	} else if (cpasswd.length === 0) {
		showAlert('Confirm Password is blank');
	} else if (passwd.length < 8) {
		showAlert('Password must be at least 8 characters');
	} else if (passwd !== cpasswd) {
		showAlert('Passwords don\'t match');
	} else {
		return true;
	}
	return false;
}

export async function callApi(config = {}, successCallback = (data)=>{}, caller = '', displayAlert=true) {
	const progress_bar = document.querySelector('#' + caller + '_pb');
	if (progress_bar != null) progress_bar.style.display = 'block';
	await axios(config)
		.then((response) => {
			if (!response.data.error) {
				successCallback(response.data);
			} else {
				if (displayAlert) showAlert(response.data.error);
				successCallback({})
			}
			if (progress_bar != null) progress_bar.style.display = 'none';
		})
		.catch((error) => {
			showAlert("" + error);
			if (progress_bar != null) progress_bar.style.display = 'none';
		});
}

export function showAlert(msg, timeout=3000) {
	ons.notification.toast(msg, { timeout: timeout, animation: 'lift' });
}

export function formatDate(date) {
	if (date != null && date !== "") {
		return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
	}
	return null;
}

export function formatTime(date) {
	if (date != null && date !== "") {
		return (date.getHours() + "").padStart(2, '0') + ':' + (date.getMinutes() + "").padStart(2, '0');
	}
	return null;
}

export function formatToDateString(date) {
	if (date != null && date !== "") {
		const d = new Date(date);
		return d.toDateString();
	}
	return null;
}

export function formatToTimeString(date) {
	if (date != null && date !== "") {
		const d = new Date();
		const HH = date.split(':')[0];
		const mm = date.split(':')[1];
		d.setHours(HH);
		d.setMinutes(mm);
		d.setSeconds(0);
		return d.toLocaleTimeString();
	}
	return null;
}

export function setLoginCookie(data) {
	const cookieData = {
		email: data.email,
		firstname: data.firstname,
		lastname: data.lastname, 
		access_token: data.access_token,
		type: data.type,
		enabled: data.enabled,
		thirdPartyLogin: _default(data.thirdPartyLogin, null),
		application: _default(data.application, null)
	}
	let d = new Date();
	d.setDate(d.getDate() + 7); //+7days
	cookies.set(login_cookie, cookieData, {
		path: cookieSettings.path,
		expires: d,
		//secure: cookieSettings.secure,
		sameSite: cookieSettings.sameSite
	});
}

export function _default(input, defaultValue) {
	if (input && input !== undefined && input != null && (input+"").trim() !== "") {
		return input;
	} else {
		return defaultValue;
	}
}

export function getUrlParameter(name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(window.location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

////////////////////////////////////////////////////////////////////////////////////////////////

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeLogin: cookies.get(login_cookie) != null
		}
	}
	responseFacebook = (userInfo) => {
		if (userInfo.accessToken != null) {
			const userInfoData = {
				email: userInfo.email,
				firstname: userInfo.name,
				lastname: "",
				type: "user",
				enabled: true,
				//picture: userInfo.picture.data.url,
				thirdPartyLogin: true,
				//access_token: userInfo.accessToken,
				application: "facebook"
			}
			verifyUserId((data)=>{
				if (data.exists) {
					if(data.thirdPartyLogin) {
						setLoginCookie(userInfoData);
						this.nav.pushPage('home.html');
					} else {
						ons.notification.alert('An existing account with the same Email ID has not been registered via Facebook Login. Please login with your registered username and password instead.')
							.then((value)=>{
								window.location.href = process.env.PUBLIC_URL;
							});
						
					}

				} else {
					ons.notification.confirm('Facebook account is not registered or enabled for this application. Do you want to proceed with the registration?')
						.then((value)=> {
							if (value === 1) {
								obtainVerificationCode((data)=>{
									sendEmail({
										to: userInfoData.email,
										from: defaultEmailSender,
										subject: "Account Verification Request",
										body:
											'To proceed please click the link below:\n\n' +
												data.callbackUrl +
											'\n\nPlease note that this request is only valid for 1 hour. Please ignore this email if you did not request for account verification.'
									});

									showAlert("Please check your email to proceed")
								}, userInfoData);
							}
						});
				}
			}, userInfo.email)
		}
	}
	handleLogout = () => {
		document.querySelector('#confirm-dialog').hide();
		cookies.remove(login_cookie, {
			path: cookieSettings.path
		});
		this.nav.resetToPage('login.html', { pop: true }).then(() => {
			this.renderFacebookLogin();
			this.renderForgotPassword();
		});
	}
	renderFacebookLogin = () => {
		const facebook_loginBtn = document.querySelector('div#facebook_loginBtn');
		if (facebook_loginBtn != null) {
			ReactDOM.render(
				<FacebookLogin
					appId="607869309830124"
					autoLoad={false}
					fields="name,email,picture"
					size="small"
					callback={this.responseFacebook}
					icon="fa-facebook"/>,
				facebook_loginBtn
			);
		}
	}
	renderForgotPassword = () => {
		const forgotPasswordBtn = document.querySelector('#forgotPasswordBtn');
		if (forgotPasswordBtn != null) {
			ReactDOM.render(<ForgotPassword />, forgotPasswordBtn);
		}
	}
	componentDidMount() {		
		if (this.nav != null) {
			this.nav.addEventListener('postpush', (event) => {
				if (event.enterPage.matches('#login')) {
					this.renderFacebookLogin();
					this.renderForgotPassword();
				}

				if (event.enterPage.matches('#home')) {
					const confirm_logout = document.querySelector('div#confirm_logout');
					if (confirm_logout != null) {
						ReactDOM.render(<ConfirmDialog message="Are you sure you want to log out?" onOk={this.handleLogout} />, confirm_logout);
					}

					const badge = document.querySelector('#badge');
					if (badge != null && cookies.get(login_cookie) != null) {
						getUserPhoto((data) => {
							ReactDOM.render(<Badge accountInfo={cookies.get(login_cookie)} picture={data.picture} />, badge);
						}, null, cookies.get(login_cookie).email)
					}

					const admin_menu = document.querySelector('#admin_menu');
					if (cookies.get(login_cookie) != null && cookies.get(login_cookie).type === "user") {
						admin_menu.style.display = 'none';
					} 
					else if (cookies.get(login_cookie) != null && cookies.get(login_cookie).type === "admin") {
						admin_menu.style.display = 'block';
					} 
				}
			});

			this.nav.addEventListener('postpop', (event) => {
				if(event.leavePage.matches('#user_profile')) {
					const pull_hook = document.querySelector('#pull-hook');
					if(pull_hook != null) {
						pull_hook.dispatchEvent(new Event('changestate'));
					}
				}
			});
		}
	}
	render() {
		const landingPage = this.state.activeLogin ? "home.html" : "login.html";

		return (
			<React.Fragment>
				<ons-navigator swipeable id="navigator" page={landingPage} ref={ref => { this.nav = ref }}>
				</ons-navigator>
			</React.Fragment>
		);

	}
}

export class ConfirmDialog extends React.Component {
	handleCancel = (event) => {
		this.dialog.hide();
	}
	render() {
		return (
			<ons-alert-dialog id="confirm-dialog" style={{ position: 'fixed' }} modifier="rowfooter" ref={ref => { this.dialog = ref }}>
				<div className="alert-dialog-title">Confirm</div>
				<div className="alert-dialog-content">
					{this.props.message}
				</div>
				<div className="alert-dialog-footer">
					<ons-alert-dialog-button onClick={this.handleCancel}>Cancel</ons-alert-dialog-button>
					<ons-alert-dialog-button onClick={this.props.onOk}>OK</ons-alert-dialog-button>
				</div>
			</ons-alert-dialog>
		);
	}
}

class Badge extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			accountInfo: props.accountInfo,
			picture: props.picture
		}
	}
	render() {
    	const imgSrc = this.state.picture != null ? this.state.picture : defaultImg;
		return (
			<React.Fragment>
				<div className="left">
              		<img className="list-item--material__thumbnail" id="badge_pic" src={imgSrc} alt="Profile Pic" style={{width: '80px', height: '80px'}} onClick={()=>{loadPage('profile.html')}}></img>
            	</div>
				<div className="left">
					<b>{_default(this.state.accountInfo.firstname, "Firstname") + " " + _default(this.state.accountInfo.lastname, "")}</b>
				</div>
			</React.Fragment>
		)
	}
}

class ForgotPassword extends React.Component {
	handlePopoverClick = (event) => {
		this.popover.show(event.target);
	}
	handleSubmit = (event) => {
		if (!emailRegExp.test(this.email.value)) {
			showAlert('Invalid Email Address');
		} else {
			this.popover.hide();
			verifyUserId((data)=>{
				if (data.exists) {
					resetUserPassword((data)=>{
						sendEmail({
							to: this.email.value,
							from: defaultEmailSender,
							subject: "Change Password Request",
							body:
								'To proceed please click the link below:\n\n' +
									data.callbackUrl +
								'\n\nPlease note that this request is only valid for 1 hour. Please ignore this email if you did not request for any password change.'
						});
		
						showAlert("Please check your email to proceed")
					}, this.email.value);
				} else {
					showAlert('Email address is unverified or disabled. Please contact administrator.')
				}
			}, this.email.value)
		}
	}
	render() {
		return (
			<React.Fragment>
				<ons-button modifier="quiet" onClick={this.handlePopoverClick}>Forgot Password?</ons-button>
				<ons-popover direction="down" id="popover" cancelable={true} ref={ref=>{this.popover=ref}}>
					<div align="center">
						<p>
						<ons-input placeholder="Email" modifier="material" ref={ref=>{this.email=ref}} ></ons-input>
						<ons-button modifier="quiet" onClick={this.handleSubmit} >Submit</ons-button>
						</p>
					</div>
				</ons-popover>
			</React.Fragment>
		)
	}
}

export class ChangePassword extends React.Component {
	handleSubmit = (event) => {
		if (!validatePasswords(this.passwd.value, this.cpasswd.value)) {
			// no pass
		} else {
			verifyResetPassword((data)=>{
				if (data.verified) {
					putUser({
						email: this.props.email,
						enabled: true,
						password: this.passwd.value
					}, (data)=>{
						showAlert('Successfully changed password');
						sendEmail({
							to: this.props.email,
							from: defaultEmailSender,
							subject: "Change Password Successful",
							body:
								'You have successfully changed your password.'
						});
						setTimeout(()=>{
							window.location.href = process.env.PUBLIC_URL
						}, 5000);						
					})

				} else {
					showAlert('Failed to verify this request')
				}

			}, this.props.code, this.props.email)
		}
	}
	render() {
		return (
			<React.Fragment>
				<div style={{ marginTop: '50%' }}>
					<ons-card>
						<ons-list>
							<ons-list-header>Change Password</ons-list-header>
							<div align="center">
								<p>
									<ons-input type="password" placeholder="New Password" modifier="material" ref={ref=>{this.passwd=ref}}></ons-input>
								</p>
								<p>
									<ons-input type="password" placeholder="Confirm Password" modifier="material" ref={ref=>{this.cpasswd=ref}}></ons-input>
								</p>
								<p>
									<ons-button onClick={this.handleSubmit}>Submit</ons-button>
								</p>
							</div>
						</ons-list>
					</ons-card>
				</div>
			</React.Fragment>
		)
	}
}

export class VerifyAccount extends React.Component {
	render() {
		verifyAccount((data)=>{
			let message;
			if (data.validated) {
				message = "Account has been successfully verified"
				sendEmail({
					to: this.props.email,
					from: defaultEmailSender,
					subject: "Account Verification Successful",
					body:
						'You have successfully verified your account. You may now be able to login.'
				});
			} else {
				message = "Failed to verify account"
			}
			ons.notification.alert(message)
				.then(value=>{
					window.location.href = process.env.PUBLIC_URL
				});

		}, this.props.email, this.props.code, true);
		return (
			<React.Fragment>
				<div align="center"></div>
			</React.Fragment>
		)
	}
}

var app = {
    // Application Constructor
    initialize: function() {
		if (window.cordova) {
			document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
		} else {
			this.onDeviceReady();
		}
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        ReactDOM.render(<App />, document.querySelector('div#root'));
	}
	
};

app.initialize();