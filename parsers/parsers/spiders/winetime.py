import scrapy


class WinetimeSpider(scrapy.Spider):
    name = "winetime"
    allowed_domains = ["winetime.com.ua"]
    start_urls = ["http://winetime.com.ua/"]

    def parse(self, response):
        pass
