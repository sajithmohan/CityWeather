FROM mongo

# copy seed data and index file to container instance
COPY city.list.json /city.list.json

# create index and insert seed data
CMD mongoimport --host mongodb --db cityweather --collection cities --type json --file /city.list.json --jsonArray