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

      alluserdata: []
    };
  }

  componentDidMount() {
    this.getData();
    //this.sendData();
    this.interval = setInterval(() => {
      this.sendData();
    }, 300000); // 5 min
  }

  getData() {
      fetch("http://localhost:8080/api/alluserdata/")
      .then(res => {
        return res.json();
      })
      .then(res => {
        this.setState({
          alluserdata: res
        });
        console.log(this.state.alluserdata);
      });
  }

  sendData() {
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

      var rating = -1;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

          // check
          // TODO move all to state
          console.log("ip: ", ip)
          console.log("rating: ", rating)
          console.log("latitude: ", position.coords.latitude)
          console.log("longtitude: ", position.coords.longitude)
          console.log("date: ", dateFormat(now, "dateformatdb"));

          fetch('http://localhost:8080/api/userdata', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              ip: ip,
              rating: rating,
              latitude: position.coords.latitude,
              longtitude: position.coords.longitude,
              lastupdated: dateFormat(now, "dateformatdb")
            })
          });
        })
      }
      else {
        alert("Geolocation is disabled");
      }
    })

  }

  render() {

    var rating = 5.2;
    var ratingColor = "btn btn-danger";
    if (rating > 4.0) ratingColor = "btn p-1 mb-1 btn-warning";
    if (rating > 8.0) ratingColor = "btn btn-success";

    return (
      <div>

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="navbar-brand">Рейтинг самоизоляции</div>
        </nav>

          
        <div className="container">
          <div className="card-deck">

            <div className="card m-3 h-25">
              <div className="card-header text-center h4"><b>Москва </b><button type="button" className={ratingColor}> <b>{rating}</b> </button></div>
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
                <YMaps>
                  <Map 
                    defaultState={{ center: [55.750985, 37.617124], zoom: 10 }} 
                    width={ window.innerWidth * 0.8 }
                    height={ window.innerHeight * 0.8 }
                  >
                    { this.state.alluserdata.map( (user, i) => (
                        <Placemark key={user.ip}
                          modules={['geoObject.addon.balloon']}
                          geometry={ [ 55.663229599999994 + i/10, 37.617124 + i/10] }
                          options={{ preset: 'islands#circleDotIcon', iconColor: 'orange' }}
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