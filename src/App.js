import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { YMaps, Map, Placemark, ZoomControl, FullscreenControl } from 'react-yandex-maps';

class App extends React.Component {


  render() {

    var rating = 5.2;
    var ratingColor = "btn btn-danger";
    if (rating > 4.0) ratingColor = "btn btn-warning";
    if (rating > 8.0) ratingColor = "btn btn-success";
    
    // IP
    const publicIp = require('public-ip');
    var ip;
    (async () => {
      ip = await publicIp.v4();
      console.log(ip);
    })();

    return (
      <div>

        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="navbar-brand">Рейтинг самоизоляции в <b>Москве</b></div>
          <ul className="navbar-nav">
            <li className="nav-item active">
              <button type="button" className={ratingColor}> {rating} </button>
            </li>
            <li className="nav-item active">
              <div className="nav-link">за последние 24 часа <span role="img" aria-label="clock">🕑</span><span className="sr-only">(current)</span></div>
            </li>
          </ul>
        </nav>

        <div className="container d-flex mh-100 mw-100 justify-content-center">
          <div className="card mh-100 mw-100">

            <ul className="list-group list-group-flush">
              <div>

                <li className="list-group-item">
                  <div className="card-body p-1">
                    Статистика по <b>100500</b> пользователям <span role="img" aria-label="Face with Medical Mask">😷</span>
                    {ip}
                  </div>
                </li>
                
                  <div className="media">
                    <YMaps>
                      <Map 
                        defaultState={{ center: [55.750985, 37.617124], zoom: 10 }} 
                        width={ window.innerWidth }
                        height={ window.innerHeight * 0.85 }
                      >
                        <Placemark 
                            modules={['geoObject.addon.balloon']}
                            geometry={ [ 55.750985, 37.617124 ] }
                            options={{ preset: 'islands#circleIcon', iconColor: 'orange' }}
                            properties={{
                              iconCaption:
                                'Вы',
                              iconContent:
                                '5',
                            }}
                        />
                        <Placemark 
                            modules={['geoObject.addon.balloon']}
                            geometry={ [ 55.760985, 37.614124 ] }
                            options={{ preset: 'islands#circleIcon', iconColor: 'green' }}
                            properties={{
                              iconContent:
                                '8',
                            }}
                        />
                        <ZoomControl />
                        <FullscreenControl />
                      </Map>
                    </YMaps>
                  </div>

              </div>
            </ul>

            <div className="card-footer text-muted pb-3" style={{'lineHeight': 0 + 'px'}}> 
              <font size="3">by <a className="text-muted" href="https://vk.com/shelepukhin">nVinz</a></font> 
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default App;