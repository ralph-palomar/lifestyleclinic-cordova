import React from 'react';
import ReactDOM from 'react-dom';
import { logout, back, createAccount, login, register, cookies, callApi, _default, showAlert, validatePasswords } from './index.js'
import { Users } from './users.js'
import { BasicInfo, BasicInfoProfile } from './basicinfo.js';
import { Illnesses, IllnessesProfile } from './illnesses.js';
import { Medications, MedicationsProfile } from './medications.js';
import { VitalSigns, VitalSignsProfile } from './vitalsigns.js';
import { Diet, DietProfile } from './diet.js';
import { Others, OthersProfile } from './others.js';
import { api, defaultImg, login_cookie, defaultEmailSender } from './config.js';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

window.fn = {};

window.fn.open = function () {
  const menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function (page) {
  const content = document.getElementById('content');

  content.load(page)
    .then(() => {
      const menu = document.getElementById('menu');
      menu.close();

      if (page === "profile.html") {
        const main = document.querySelector('div#main_display');
          getUserPhoto((data) => {
            ReactDOM.render(<Profile picture={data.picture} email={cookies.get(login_cookie).email} />, main);
          }, null, cookies.get(login_cookie).email)
      }

      if (page === "users.html") {
        const user_list = document.querySelector('div#user_list');
        ReactDOM.render(<Users />, user_list);
      }

      if (page === "medical_record.html") {
        const medical_record_main = document.querySelector('div#medical_record_main');
        ReactDOM.render(<MedicalRecord email={cookies.get(login_cookie).email} />, medical_record_main);
      }

    });
};

window.fn.logout = logout;
window.fn.back = back;
window.fn.createAccount = createAccount;
window.fn.login = login;
window.fn.register = register;

export const loadPage = window.fn.load;

export class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountInfo: {
        picture: props.picture
      },
      email: props.email,
      type: props.type,
      enabled: props.enabled,
      openedBy: props.openedBy,
      crop: {
        unit: '%',
        x: 25,
        y: 10,
        width: 50,
        aspect: 1,
      }
    }
  }
  componentDidMount() {
    const profile_basic_info = document.querySelector('div#profile_basic_info');
    getBasicInfo((data) => {
      ReactDOM.render(<BasicInfoProfile data={data} />, profile_basic_info);
      this.title.innerHTML = '<b>'+ _default(data.basic_firstname, "Firstname") + " " + _default(data.basic_lastname, "Lastname") + " " + _default(data.basic_middlename, "") + '</b>'
    }, 'profile', this.state.email);

    const profile_illnesses = document.querySelector('div#profile_illnesses');
    getIllnesses((data) => {
      ReactDOM.render(<IllnessesProfile data={data} />, profile_illnesses);
    }, 'profile', this.state.email);

    const profile_medications = document.querySelector('div#profile_medications');
    getMedications((data) => {
      ReactDOM.render(<MedicationsProfile data={data} />, profile_medications);
    }, 'profile', this.state.email);

    const profile_vital_signs = document.querySelector('div#profile_vital_signs');
    getVitalSigns((data) => {
      ReactDOM.render(<VitalSignsProfile data={data} />, profile_vital_signs);
    }, 'profile', this.state.email);

    const profile_diet = document.querySelector('div#profile_diet');
    getDiet((data) => {
      ReactDOM.render(<DietProfile data={data} />, profile_diet);
    }, 'profile', this.state.email);

    const profile_others = document.querySelector('div#profile_others');
    getOthers((data) => {
      ReactDOM.render(<OthersProfile data={data} />, profile_others);
    }, 'profile', this.state.email);

    this.isAdminSwitch.checked = this.state.type === "admin" ? true : false;
    this.isEnabledSwitch.checked = this.state.enabled;

    this.isEnabledSwitch.addEventListener('change', (event) => {
      const payload = {
        email: this.state.email,
        enabled: event.target.checked
      }
      putUser(payload, (data) => {
        showAlert('Successfully updated settings');
        this.setState({
          enabled: event.target.checked
        });
      });
    });

    this.isAdminSwitch.addEventListener('change', (event) => {
      const payload = {
        email: this.state.email,
        type: event.target.checked ? 'admin': 'user'
      }
      putUser(payload, (data) => {
        showAlert('Successfully updated settings');
        this.setState({
          type: event.target.checked ? 'admin': 'user'
        });
      });
    });

    const profile_settings = document.querySelector('#profile_settings');
    if (profile_settings != null) {
      profile_settings.addEventListener('click', (event) => {
        this.profile_settings_popover.show(event.target);
      });
    }
  }
  handlePictureClick = (event) => {
    const profile_pic = document.querySelector('#profile_pic');
    profile_pic.click();
  }
  handlePictureChange = (event, nav) => {
    if (nav != null) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onloadend = (event) => {
        this.setState({ src: event.target.result });
        nav.pushPage('new_profile_pic.html').then(()=>{
          //initial load//
          const new_pp_component = document.querySelector('#new_pp_component');
          if (new_pp_component != null) {
            ReactDOM.render(<ReactCrop src={this.state.src} crop={this.state.crop} ruleOfThirds={true} circularCrop={true} onChange={this.cropChange} onImageLoaded={this.imageLoaded} onComplete={this.cropComplete} />, new_pp_component);
          }

          const save_new_pp = document.querySelector('#save_new_pp');
          if (save_new_pp != null) {
            save_new_pp.addEventListener('click', (event) => {
              const payload = {
                email: this.state.email,
                picture: this.state.croppedImageData
              }
              putUser(payload, (data) => {
                  showAlert('Successfully updated profile picture');
                  this.setState({
                    accountInfo: {
                      picture: this.state.croppedImageData
                    }
                  });
                  const badge_pic = document.querySelector('#badge_pic');
                  badge_pic.src = this.state.croppedImageData;
                  back();
              });
            });
          }
        });
      };
    }
  }
  imageLoaded = (image) => {
    this.imageRef = image
  }
  cropChange = (newCrop) => {
    this.setState({ crop: newCrop });
  }
  cropComplete = (newCrop) => {
    const image = this.imageRef;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const maxWidth = 200;
    const maxHeight = 200;
    canvas.width = maxWidth;
    canvas.height = maxHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      newCrop.x * scaleX,
      newCrop.y * scaleY,
      newCrop.width * scaleX,
      newCrop.height * scaleY,
      0,
      0,
      maxWidth,
      maxHeight
    );
    
    const croppedImage = ctx.canvas.toDataURL('image/png', 1.0);
    this.setState({ croppedImageData: croppedImage });
  }
  handleEditAccess = (event) => {
    this.popover.show(event.target);
  }
  handleChangePassword = (event) => {
    this.change_password_popover.show(event.target);
    this.profile_settings_popover.hide();    
  }
  handleChangePasswdSubmit = (event) => {
    if(!validatePasswords(this.passwd.value, this.cpasswd.value)) {
      // no pass
    } else {
      verifyUserPwd((data)=>{
        if (data.verified) {
          putUser({
            email: this.state.email,
            password: this.passwd.value
          }, (data)=> {
            showAlert('Successfully changed password')
            this.change_password_popover.hide();
            this.passwd.value = "";
            this.cpasswd.value = "";
            this.currentpasswd.value = "";
            sendEmail({
							to: this.state.email,
							from: defaultEmailSender,
							subject: "Change Password Successful",
							body:
								'You have successfully changed your password.'
						});
          })
        } else {
          showAlert('Current password cannot be verified')
        }
      }, {
        email: this.state.email,
        password: this.currentpasswd.value
      });
    }
  }
  render() {
    const imgSrc = this.state.accountInfo.picture != null ? this.state.accountInfo.picture : defaultImg;
    const displayCamIcon = this.state.openedBy === 'admin' ? 'none' : 'block';
    const displayEditIcon = this.state.openedBy === 'admin' ? 'block' : 'none';
    const nav = document.querySelector('#navigator');

    const new_pp_component = document.querySelector('#new_pp_component');
    if (new_pp_component != null) {
      ReactDOM.render(<ReactCrop src={this.state.src} crop={this.state.crop} ruleOfThirds={true} onChange={this.cropChange} onImageLoaded={this.imageLoaded} onComplete={this.cropComplete} />, new_pp_component);
    }

    return (
      <React.Fragment>
        <ons-card>
            <div className="center" align="center">
              <img className="list-item--material__thumbnail" src={imgSrc} alt="Profile Pic" style={{width: '100px', height: '100px'}} ></img>
            </div>
            <div id="profile_cam_icon" align="center" style={{ display: displayCamIcon }}>
              <ons-icon icon="md-camera" onClick={this.handlePictureClick}></ons-icon>
              <input type="file" id="profile_pic" style={{ display: 'none'}} onChange={(event)=>{this.handlePictureChange(event, nav)}} ></input>
            </div>
            <div className="title" align="center" ref={ref=>{this.title=ref}}></div>
            <div align="center" style={{ display: displayEditIcon }}>
              <ons-button modifier="quiet" onClick={this.handleEditAccess}>
                <ons-icon icon="md-edit"></ons-icon>&nbsp;Edit Access
              </ons-button>
            </div>
        </ons-card>
        <ons-popover direction="down" id="popover" cancelable={true} ref={ref=>{this.popover=ref}}>
            <ons-list>
              <ons-list-header>
                <div className="left">Settings</div>
              </ons-list-header>
              <ons-list-item>
                <div className="left">Set As Admin</div>
                <div className="right">
                  <ons-switch ref={ref=>{this.isAdminSwitch=ref}} ></ons-switch>
                </div>
              </ons-list-item>
              <ons-list-item>
                <div className="left">Enable User</div>
                <div className="right">
                  <ons-switch ref={ref=>{this.isEnabledSwitch=ref}}></ons-switch>
                </div>
              </ons-list-item>
            </ons-list>
        </ons-popover>
        <ons-popover direction="left" id="popover" cancelable={true} ref={ref=>{this.profile_settings_popover=ref}} >
            <p>
              <ons-button modifier="quiet" onClick={this.handleChangePassword}>Change Password</ons-button>
            </p>
        </ons-popover>
        <ons-popover direction="down" id="popover" cancelable={true} ref={ref=>{this.change_password_popover=ref}} >
          <ons-list>
							<ons-list-header>Change Password</ons-list-header>
							<div align="center">
                <p>
									<ons-input type="password" placeholder="Current Password" modifier="material" ref={ref=>{this.currentpasswd=ref}}></ons-input>
								</p>
								<p>
									<ons-input type="password" placeholder="New Password" modifier="material" ref={ref=>{this.passwd=ref}}></ons-input>
								</p>
								<p>
									<ons-input type="password" placeholder="Confirm Password" modifier="material" ref={ref=>{this.cpasswd=ref}}></ons-input>
								</p>
								<p>
									<ons-button onClick={this.handleChangePasswdSubmit}>Submit</ons-button>
								</p>
							</div>
						</ons-list>
        </ons-popover>
      </React.Fragment>
    );
  }
}

export class MedicalRecord extends React.Component {
    state = {
      email: this.props.email
    }
    componentDidMount() {

      this.tabbar.addEventListener('postchange', (event) => {
          if (event.index === 0) {
            const basicinfo_form = document.querySelector('div#basicinfo_form');
            getBasicInfo((data) => {
              ReactDOM.render(<BasicInfo data={data} />, basicinfo_form);
            }, 'basic', cookies.get(login_cookie).email);
            document.querySelector('#fab_add_medication').style.display = 'none';
            document.querySelector('#fab_add_vitalsign').style.display = 'none';
          }
    
          if (event.index === 1) {
            const illnesses_list = document.querySelector('div#illnesses_list');
            getIllnesses((data) => {
              ReactDOM.render(<Illnesses data={data} />, illnesses_list);
            }, 'illnesses', cookies.get(login_cookie).email);
            document.querySelector('#fab_add_medication').style.display = 'none';
            document.querySelector('#fab_add_vitalsign').style.display = 'none';
          }
    
          if (event.index === 2) {
            const medications_list = document.querySelector('div#medications_list');
            getMedications((data) => {
              ReactDOM.render(<Medications data={data} />, medications_list);
            }, 'medications', cookies.get(login_cookie).email);
            document.querySelector('#fab_add_medication').style.display = 'block';
            document.querySelector('#fab_add_vitalsign').style.display = 'none';
          }
    
          if (event.index === 3) {
            const vitalsigns_list = document.querySelector('div#vitalsigns_list');
            getVitalSigns((data) => {
              ReactDOM.render(<VitalSigns data={data} />, vitalsigns_list);
            }, 'vitalsigns', cookies.get(login_cookie).email);
            document.querySelector('#fab_add_medication').style.display = 'none';
            document.querySelector('#fab_add_vitalsign').style.display = 'block';
          }
    
          if (event.index === 4) {
            const diet_list = document.querySelector('div#diet_list');
            getDiet((data) => {
              ReactDOM.render(<Diet data={data} />, diet_list);
            }, 'diet', cookies.get(login_cookie).email);
            document.querySelector('#fab_add_medication').style.display = 'none';
            document.querySelector('#fab_add_vitalsign').style.display = 'none';
          }
    
          if (event.index === 5) {
            const others_list = document.querySelector('div#others_list');
            getOthers((data) => {
              ReactDOM.render(<Others data={data} />, others_list);
            }, 'others', cookies.get(login_cookie).email);
            document.querySelector('#fab_add_medication').style.display = 'none';
            document.querySelector('#fab_add_vitalsign').style.display = 'none';
          }
      });

      this.tabbar.addEventListener('reactive', (event) => {
        if (event.index === 0) {
          const basicinfo_form = document.querySelector('div#basicinfo_form');
          getBasicInfo((data) => {
            ReactDOM.render(<BasicInfo data={data} />, basicinfo_form);
          }, 'basic', cookies.get(login_cookie).email);
        }
      });

      setTimeout(() => {
        const basicinfo_form = document.querySelector('div#basicinfo_form');
        getBasicInfo((data) => {
          ReactDOM.render(<BasicInfo data={data} />, basicinfo_form);
        }, 'basic', cookies.get(login_cookie).email);

        const illnesses_list = document.querySelector('div#illnesses_list');
        getIllnesses((data) => {
          ReactDOM.render(<Illnesses data={data} />, illnesses_list);
        }, 'illnesses', cookies.get(login_cookie).email);

        const medications_list = document.querySelector('div#medications_list');
        getMedications((data) => {
          ReactDOM.render(<Medications data={data} />, medications_list);
        }, 'medications', cookies.get(login_cookie).email);

        const vitalsigns_list = document.querySelector('div#vitalsigns_list');
        getVitalSigns((data) => {
          ReactDOM.render(<VitalSigns data={data} />, vitalsigns_list);
        }, 'vitalsigns', cookies.get(login_cookie).email);

        const diet_list = document.querySelector('div#diet_list');
        getDiet((data) => {
          ReactDOM.render(<Diet data={data} />, diet_list);
        }, 'diet', cookies.get(login_cookie).email);

        const others_list = document.querySelector('div#others_list');
        getOthers((data) => {
          ReactDOM.render(<Others data={data} />, others_list);
        }, 'others', cookies.get(login_cookie).email);

      }, 500);

    }
    render() {
      return (
        <React.Fragment>
            <ons-tabbar id="record_tabbar" position="bottom" ref={ref=>{this.tabbar=ref}}>
              <ons-tab page="basicinfo.html">
                <input type="radio" style={{ display: 'none'}} />
                  <button className="tabbar__button">
                    <div className="tabbar__icon">
                      <i className="fas fa-id-card-alt fa-fw"></i>
                    </div>
                  </button>    
              </ons-tab>
              <ons-tab page="illnesses.html">
                <input type="radio" style={{ display: 'none'}} />
                  <button className="tabbar__button">
                    <div className="tabbar__icon">
                    <i className="fas fa-diagnoses fa-fw"></i>
                    </div>
                  </button>          
              </ons-tab>
              <ons-tab page="medications.html">
                <input type="radio" style={{ display: 'none'}} />
                  <button className="tabbar__button">
                    <div className="tabbar__icon">
                    <i className=" fas fa-prescription fa-fw"></i>
                    </div>
                  </button>          
              </ons-tab>
              <ons-tab page="vitalsigns.html">
                <input type="radio" style={{ display: 'none'}} />
                  <button className="tabbar__button">
                    <div className="tabbar__icon">
                    <i className=" fas fa-heartbeat fa-fw"></i>
                    </div>
                  </button>          
              </ons-tab>
              <ons-tab page="diet.html">
                <input type="radio" style={{ display: 'none'}} />
                  <button className="tabbar__button">
                    <div className="tabbar__icon">
                    <i className=" fas fa-mug-hot fa-fw"></i>
                    </div>
                  </button>          
              </ons-tab>
              <ons-tab page="others.html">
                <input type="radio" style={{ display: 'none'}} />
                  <button className="tabbar__button">
                    <div className="tabbar__icon">
                    <i className="zmdi zmdi-info zmdi-hc-fw"></i>
                    </div>
                  </button>          
              </ons-tab>
          </ons-tabbar>
          <ons-fab id="fab_add_medication" position="bottom right" modifier="mini" style={{ marginBottom: '50px', display: 'none' }} >
            <ons-icon icon="md-plus"></ons-icon>
          </ons-fab>
          <ons-fab id="fab_add_vitalsign" position="bottom right" modifier="mini" style={{ marginBottom: '50px', display: 'none' }} >
            <ons-icon icon="md-plus"></ons-icon>
          </ons-fab>
        </React.Fragment>
      );
    }
}

export function getBasicInfo(successCallback=(data)=>{}, caller="", identifier) {
  const config = {
    "url": api.users_api_base_url + "/v1/basicInfo",
    "method": "GET",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization      
    },
    "params": {
      "id": identifier
    }
  };
  callApi(config, successCallback, caller, false);
}

export function getIllnesses(successCallback=(data)=>{}, caller="", identifier) {
  const config = {
    "url": api.users_api_base_url + "/v1/illnesses",
    "method": "GET",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization      
    },
    "params": {
      "id": identifier
    }
  };
  callApi(config, successCallback, caller, false);
}

export function getMedications(successCallback=(data)=>{}, caller="", identifier) {
  const config = {
    "url": api.users_api_base_url + "/v1/medications",
    "method": "GET",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization      
    },
    "params": {
      "id": identifier
    }
  };
  callApi(config, successCallback, caller, false);
}

export function getVitalSigns(successCallback=(data)=>{}, caller="", identifier) {
  const config = {
    "url": api.users_api_base_url + "/v1/vitalSigns",
    "method": "GET",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization      
    },
    "params": {
      "id": identifier
    }
  };
  callApi(config, successCallback, caller, false);
}

export function getDiet(successCallback=(data)=>{}, caller="", identifier) {
  const config = {
    "url": api.users_api_base_url + "/v1/diet",
    "method": "GET",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization      
    },
    "params": {
      "id": identifier
    }
  };
  callApi(config, successCallback, caller, false);
}

export function getOthers(successCallback=(data)=>{}, caller="", identifier) {
  const config = {
    "url": api.users_api_base_url + "/v1/others",
    "method": "GET",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization      
    },
    "params": {
      "id": identifier
    }
  };
  callApi(config, successCallback, caller, false);
}

export function getUserPhoto(successCallback=(data)=>{}, caller="", identifier) {
  const config = {
    "url": api.users_api_base_url + "/v1/users/photo",
    "method": "GET",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization      
    },
    "params": {
      "id": identifier
    }
  };
  callApi(config, successCallback, caller, false);
}

export function getAllUsers(successCallback=(data)=>{}, caller="") {
  const config = {
      "url": api.users_api_base_url + "/v1/users/all",
      "method": "GET",
      "timeout": 60000,
      "headers": {
          "Authorization": api.users_api_authorization
      }
  };
  callApi(config, successCallback, caller, false);
}

export function putUser(payload, successCallback=(data)=>{}, caller="") {
  const config = {
    "url": api.users_api_base_url + "/v1/users",
    "method": "PUT",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization,
      "Content-Type": 'application/json'
    },
    "data": payload
  };
  callApi(config, successCallback, caller, true);
}

export function resetUserPassword(successCallback=(data)=>{}, identifier) {
  const config = {
    "url": api.users_api_base_url + "/v1/users/resetPwd",
    "method": "GET",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization
    },
    "params": {
      "email": identifier
    }
  };
  callApi(config, successCallback, "", false);
}

export function sendEmail(payload, successCallback=(data)=>{}) {
  const config = {
    "url": api.users_api_base_url + "/v1/notifications",
    "method": "POST",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization,
      "Content-Type": 'application/json'
    },
    "data": payload,
    "params": {
      "type": "simple_email"
    }
  };
  callApi(config, successCallback, "", false);
}

export function verifyResetPassword(successCallback=(data)=>{}, code, email) {
  const config = {
    "url": api.users_api_base_url + "/v1/users/verifyResetPwd",
    "method": "GET",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization
    },
    "params": {
      "code": code, 
      "email": email
    }
  };
  callApi(config, successCallback, "", false);
}

export function verifyUserId(successCallback=(data)=>{}, email) {
  const config = {
    "url": api.users_api_base_url + "/v1/users/verify",
    "method": "GET",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization
    },
    "params": {
      "id": email
    }
  };
  callApi(config, successCallback, "", false);
}

export function verifyUserPwd(successCallback=(data)=>{}, payload) {
  const config = {
    "url": api.users_api_base_url + "/v1/users/verifyPwd",
    "method": "POST",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization,
      "Content-Type": "application/json"
    },
    "data": payload
  };
  callApi(config, successCallback, "", false);
}

export function obtainVerificationCode(successCallback=(data)=>{}, payload) {
  const config = {
    "url": api.users_api_base_url + "/v1/users/verificationCode",
    "method": "POST",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization,
      "Content-Type": "application/json"
    },
    "data": payload
  };
  callApi(config, successCallback, "", false);
}

export function verifyAccount(successCallback=(data)=>{}, email, code, create) {
  const config = {
    "url": api.users_api_base_url + "/v1/users/verifyAccount",
    "method": "GET",
    "timeout": api.users_api_timeout,
    "headers": {
      "Authorization": api.users_api_authorization
    },
    "params": {
      "email": email,
      "code": code,
      "create": create
    }
  };
  callApi(config, successCallback, "", false);
}

