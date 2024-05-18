create table data_points (
  id serial primary key,
  time time not null,
  moist integer not null,
  temp integer not null,
  dist integer not null,
  watering boolean not null,
  spraying boolean not null,
  spraying_time boolean not null
);
