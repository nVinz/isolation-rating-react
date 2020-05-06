import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { YMaps, Map, Placemark, ZoomControl, FullscreenControl } from 'react-yandex-maps';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ip: undefined,
      rating: undefined,
      latitude: undefined,
      longtitude: undefined,
      date: undefined,

      alluserdata: [],
      citydata: undefined
    };
  }

  componentDidMount() {
    this.getUsersData();
    this.getCityData();
    this.sendUserData();
    this.interval = setInterval(() => {
      this.getUsersData();
    }, 300000); // 5 min
    this.interval = setInterval(() => {
      this.getCityData();
    }, 300000); // 5 min
    this.interval = setInterval(() => {
      this.sendUserData();
    }, 300000); // 5 min
    this.interval = setInterval(() => {
      this.sendCityData();
    }, 300000); // 5 min
  }

  getUsersData() {
    // date
    // TODO make one method to define
    var now = new Date();
    now.setDate(now.getDate() - 1)
    
    var dateFormat = require('dateformat');
    dateFormat.masks.dateformatdb = 'yyyy-mm-dd"T"HH:MM:ss.l"+03:00"';
    var nowdb = dateFormat(now, "dateformatdb");
    
    fetch(`https://isolation-rating.herokuapp.com/api/alluserdata/${nowdb}`) // Hardcode
    .then(res => {
      return res.json();
    })
    .then(res => {
      this.setState({
        alluserdata: res
      });
    })
    .catch(function() {
      alert("Не удалось получить данные");
    });
  }

  getCityData() {
    fetch("https://isolation-rating.herokuapp.com/api/citydata/Москва") // Hardcode
    .then(res => {
      return res.json();
    })
    .then(res => {
      this.setState({
        citydata: res
      });
    });
  }

  sendUserData() {
    const answer = new Promise(function(resolve, reject) {
      const publicIp = require('public-ip');
      (async () => {
        resolve(publicIp.v4())
      })();
    });

    answer.then(ip => {
      // date
      var now = new Date();
      var dateFormat = require('dateformat');
      dateFormat.masks.dateformatdb = 'yyyy-mm-dd"T"HH:MM:ss.l"+03:00"';

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          fetch('https://isolation-rating.herokuapp.com/api/userdata', { // Hardcode
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ip: ip,
              rating: -1,
              latitude: position.coords.latitude,
              longtitude: position.coords.longitude,
              lastupdated: dateFormat(now, "dateformatdb"),
              color: "-1"
            })
          });
        })
      }
      else {
        alert("Geolocation is disabled");
      }
    })

  }

  sendCityData() {
    // date
    var now = new Date();
    var dateFormat = require('dateformat');
    dateFormat.masks.dateformatdb = 'yyyy-mm-dd"T"HH:MM:ss.l"+03:00"';

    fetch('https://isolation-rating.herokuapp.com/api/citydata', { // Hardcode
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: "Москва",
      rating: -1,
      count: -1,
      latitude: 55.755825,
      longtitude: 37.617298,
      lastupdated: dateFormat(now, "dateformatdb")
    })
  });
  }

  render() {
    return (
      <div>

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="navbar-brand">Рейтинг самоизоляции</div>
        </nav>

          
        <div className="container">
          <div className="card-deck">

            <div className="card m-3 h-25">
              { /* G A V N O C O D E*/}
              { this.state.citydata !== undefined && this.state.citydata.rating > 8 && 
                <div className="card-header text-center h4"><b>Москва </b><button type="button" className="btn p-1 mb-1 btn-success"> <b>{this.state.citydata.rating}</b> </button></div>
              }
              { this.state.citydata !== undefined && this.state.citydata.rating > 4 && 
                <div className="card-header text-center h4"><b>Москва </b><button type="button" className="btn p-1 mb-1 btn-warning"> <b>{this.state.citydata.rating}</b> </button></div>
              }
              { this.state.citydata !== undefined && this.state.citydata.rating <= 4 && 
                <div className="card-header text-center h4"><b>Москва </b><button type="button" className="btn p-1 mb-1 btn-danger"> <b>{this.state.citydata.rating}</b> </button></div>
              }
              <ul className="list-group list-group-flush">
                <li className="list-group-item text-center">
                  За последние 24 часа <span role="img" aria-label="clock">🕑</span><span className="sr-only">(current)</span>
                </li>
                <li className="list-group-item text-center">
                  Статистика по <b> { this.state.alluserdata.length } </b> пользователям <span role="img" aria-label="Face with Medical Mask">😷</span>
                </li>
              </ul>
            </div>

            <div className="card m-3 mw-100">
              <div className="card-header text-center h4"><b>Карта</b></div>
              <div className="media mw-100">
                { this.state.alluserdata.length === 0 &&
                  <div className="container text-center">
                    <div className="spinner-grow text-secondary m-5 p-5" role="status"><span className="sr-only">Loading...</span></div>
                  </div>
                }
                { this.state.alluserdata.length > 0 &&
                  <YMaps>
                    <Map 
                      defaultState={{ center: [55.750985, 37.617124], zoom: 10 }} 
                      width={ window.innerWidth * 0.8 }
                      height={ window.innerHeight * 0.8 }
                    >
                      { this.state.alluserdata.map( (user) => (
                          <Placemark key={user.ip}
                            modules={['geoObject.addon.balloon']}
                            geometry={ [ user.latitude, user.longtitude ] }
                            options={{ preset: 'islands#circleDotIcon', iconColor: user.color }}
                            properties={{
                              iconCaption:
                                user.rating
                            }}>
                          </Placemark>
                        )
                      ) }
                      <ZoomControl />
                      <FullscreenControl />
                    </Map>
                  </YMaps>
                }
              </div>
              <div className="card-footer text-muted pb-3 text-center" style={{'lineHeight': 0 + 'px'}}> 
                <font size="3">by <a className="text-muted" href="https://vk.com/shelepukhin">nVinz</a></font> 
              </div>
            </div>

          </div>
        </div>

      </div>
    );
  }
}

export default App;