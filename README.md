# db-train-info

an app that provides inforamtion on trains via the db timetable api
currently features:
- departure station input field
- train search input field
- departure board for selected station
  - displays train name, from station, destination station, departure time and the platform
  - click on departure board train to select it for detailed view
- train journey view of the selected train
  - map of train route
  - list stations and corrosponding times the train is calling at  


## Build Setup
built with [NuxtJS](https://nuxtjs.org).

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

