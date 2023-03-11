import re

import scrapy
from scrapy.http import Response


class WinetimeSpider(scrapy.Spider):
    name = "winetime"
    allowed_domains = ["winetime.com.ua"]
    start_urls = ["https://winetime.com.ua/ua/wine"]

    def parse(self, response: Response):
        self.logger.info(f"Parsing catalog page {response.url}")

        wine_urls = response.xpath('//div[@class="products-main-slider-item"]'
                                   '/div[@class="products-main-slider-item-wrapper"]'
                                   '/div/a')
        yield from response.follow_all(wine_urls, callback=self.parse_wine_info)

        if wine_urls.get():
            yield self.follow_to_next_catalog_page(response)

    def parse_wine_info(self, response: Response):
        self.logger.info(f"Parsing wine page {response.url}")

        wine_name = response.xpath('//div[@class="characteristic-item-title"]/h2/span/text()').get()

        wine_params = response.xpath('//table[@class="char-item-table"]/tr')

        def get_name(row):
            return row.xpath("td[1]/text()").get(default='').strip()

        def get_value(row):
            return row.xpath("td[2]/text()").get(default='').strip()

        wine_params = {get_name(wine_param): get_value(wine_param) for wine_param in wine_params}
        yield {
            "name": wine_name,
            "wine_type": wine_params["Колір вина"],
            "country": wine_params.get("Країна"),
            "sweetness": wine_params.get("Солодкість"),
            "tastes": "Not implemented",
            "pairs_with": "Not implemented",
            "brand": wine_params.get("Бренд"),
            "percent_of_alcohol": float(wine_params["Алкоголь, %"]),
            "region": wine_params.get("Регіон"),
        }

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
