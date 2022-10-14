# Infy-Car-Angular
Repo for Infy-Car assignment

## Purpose
To demonstrate the assessment provided on car number plate data CRUD operations
Technologies used are Angular V13 and AWS(for backend data)

## Functionality
>FrondEnd
UI is displayed with data retrieved from api call. Data consists of car details[car number plate and car owner name].
Provision to List,Add and Delete data.
State management is implemented using NgRx.

>Backend
Car details data is stored in AWS DynamoDB service.
Apis are created using AWS APIGateway service which triggers the lambda.
Duplicate car number entry functionality is taken care in lambda service.

## Installation
You need to install Node.js and then the development tools. Node.js comes with a package manager called npm for installing NodeJS applications and libraries.

Install node.js (requires node.js version >= 0.8.4)
Run `npm i` to install the packages
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Get the Code
Either clone this repository or fork it on GitHub and clone your fork:

git clone https://github.com/johnthomas1992/Infy-Car-Angular.git
cd Infy-Car
