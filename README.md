# data-media

This repo is a media project, aiming to fetch, analyse, visualize the Taiwan media news.

## Getting Started

### Prerequisites

- python3
- pip and setuptools Python packages
- lxml
- OpenSSL
- postgresql

### Develop Environment

For the python deveopment, we use [virtualenv](https://virtualenv.pypa.io/en/stable/) to create isolated Python environments.

```
$ pip3 install virtualenv
$ virtualenv venv
$ source venv/bin/activate
```

**Install required packages**

```
$ pip3 install -r requirements.txt
```

### Usage

#### Crawl news

- scrapy crawl <spider_name> -o <output_file_name>.json
- spider: apple, liberty, cna, udn


#### News to Database


First, please create config.json and update the fields in config.json.

```
cp config_template.json config.json
```

Then create table by using the [create_table.sql](./sql/create_table.sql).
And using the command to insert data to database:

```
python insert_news_to_db.py <news-json-file-directory>
```

