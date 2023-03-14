# Parsers

### Installation

1. Go to parsers directory: `cd parsers`
2. Install requirements: `pip install -r requirements.txt`

### How to use winetime.come.ua parser?

#### Basic usage

`scrapy crawl winetime`

#### Set logging level

`scrapy crawl -L <LEVEL> winetime`

Recommended level: `INFO`

#### Output to file

`scrapy crawl -O <FILE> winetime`

Use `-o` instead of `-O` to append scraped items to the end of `FILE`
instead of overwriting it.


#### More info about scrapy crawling options

`scrapy crawl -h`