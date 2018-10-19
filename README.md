# CityWeather
REST based service to retrieve information about the weather in different cities us

## Getting Started
To run this project you clone this project. This project comes with docker composer files.  Use docker composer commands for running/building project

### Prerequisites
Docker and docker composer must be installed in the machine.
To generate documentation files install apidoc [Follow here to install apidoc](http://apidocjs.com/#install)
### Installing
Clone this project into your system

    git clone https://github.com/sajithmohan/CityWeather.git

Before building the project setup environment variables

>  docker-compose.yml

Add proper openweathermap API Key 

    OPENWEATHERMAP_APIKEY=<API Key>
**To build project**

    docker-compose build

 **To Run the application**

    docker-compose up
    
**To Build the tests**

    docker-compose -f docker-compose-test.yml build
**To Run tests** 

    docker-compose -f docker-compose-test.yml up
**Generate API Documentation files**

    apidoc -e node_modules/
**View API Documentation**

Open *index.html* file in the **doc** directory created inside the project directory in a browser
