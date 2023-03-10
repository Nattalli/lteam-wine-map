import re

import scrapy
from scrapy.http import Response


class WinetimeSpider(scrapy.Spider):
    name = "winetime"
    allowed_domains = ["winetime.com.ua"]
    start_urls = ["https://winetime.com.ua/wine"]

    def parse(self, response: Response):
        self.logger.info(f"Parsing catalog page {response.url}")

        wine_urls = response.xpath('//div[@class="products-main-slider-item"]'
                                   '/div[@class="products-main-slider-item-wrapper"]'
                                   '/div/a')
        yield from response.follow_all(wine_urls, callback=self.parse_wine_info)

        if wine_urls.get():
            yield self.follow_to_next_catalog_page(response)

    def parse_wine_info(self, response: Response):
        pass

    def follow_to_next_catalog_page(self, response: Response):
        regex_page_parameter = re.compile(r"(?<=page=)\d+")
        if m := regex_page_parameter.search(response.url):
            try:
                page_number = int(m.group())
            except TypeError:
                self.logger.warning(f"Non-integer query parameter page={m.group()!r}")
                return
            new_url = regex_page_parameter.sub(str(page_number + 1), response.url)
        else:
            base_url = response.url.split("?")[0]
            new_url = base_url + "?page=2"
        return response.follow(new_url)
