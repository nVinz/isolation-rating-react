# Архитектура
Приложение состоит из сайта и веб-сервиса, общающихся между собой с помощью REST запросов.

![Архитектура](https://i.ibb.co/ysk3PxW/isolation-rating.png)

# Использованные технологии
### Фронт-энд
- React 
- Bootstrap 
- Yandex Maps JS API
### Бэк-энд
- Java 
- Spring Boot 
- Spring Web 
- Hibernate 

# API
### Добавить/обновить данные о человеке
**POST Json:** https://isolation-rating.herokuapp.com/api/userdata
> **{**\
> **ip**: "IP адрес",\
> **rating**: "Рейтинг, -1 для авто обновления, [0-10] для ручного задания",\
> **latitude**: "Широта",\
> **longtitude**: "Долгота",\
> **lastupdated**: "Дата/время в формате yyyy-mm-ddTHH:MM:ss.l+03:00",\
> **color**: "Цвет метки на карте, -1 для авто определения"\
> **}**

### Обновить данные о городе
**POST Json:** https://isolation-rating.herokuapp.com/api/citydata
> **{**\
> **name**: "Имя (Москва)",\
> **rating**: "Рейтинг, -1 для авто обновления, [0-10] для ручного задания",\
> **count**: "Кол-во людей, -1 для авто обновления, [0-inf] для ручного задания",\
> **latitude**: "Широта, центр города",\
> **longtitude**: "Долгота, центр города",\
> **lastupdated**: "Дата/время в формате yyyy-mm-ddTHH:MM:ss.l+03:00"\
> **}**
