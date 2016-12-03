# data-media

This repo is a project, aiming to fetch, analyse, visualize the Taiwan media news.

## Getting Started

### Prerequisites

- python
- pip and setuptools Python packages
- lxml
- OpenSSL

### Develop

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
