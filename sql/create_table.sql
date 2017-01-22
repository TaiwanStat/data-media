CREATE table news (
  url VARCHAR(2000) UNIQUE,
  title varchar(260),
  date timestamp,
  content text,
  category varchar(260),
  website varchar(260),
  created_time TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL
)
