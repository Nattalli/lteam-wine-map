from typing import Optional
from urllib.parse import urlencode

import requests
from bs4 import BeautifulSoup

from . import errors
from .wineinshop import WineInShop

SHOP_NAME = "winetime"
REQUEST_TIMEOUT = 2
SEARCH_RESULT_URL = "https://winetime.com.ua/search"


def parse_winetime(wine_name: str) -> Optional[WineInShop]:
    content = fetch_page_content(wine_name)
    return parse_page_content(wine_name, content)


def fetch_page_content(wine_name: str) -> str:
    headers = build_request_headers()
    params = {"q": wine_name}
    try:
        response = requests.get(SEARCH_RESULT_URL, params=params, headers=headers)
        response.raise_for_status()
        content = response.text
    except requests.RequestException as e:
        raise errors.NetworkError(
            f"Could not fetch page content" f" for wine {wine_name}"
        ) from e
    return content


def parse_page_content(wine_name: str, page_content: str) -> Optional[WineInShop]:
    soup = BeautifulSoup(page_content, "html.parser")

    prices = soup.find_all(class_="p-prices-values")
    if not prices:
        return None

    prices = [int(price.text.replace("грн", "").strip()) for price in prices]
    url = build_search_url(wine_name)
    return WineInShop(SHOP_NAME, min(prices), max(prices), url)


def build_request_headers() -> dict[str, str]:
    headers = {
        "DNT": "1",
        "sec-ch-ua-mobile": "?0",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
        "sec-ch-ua-platform": '"Linux"',
        "Sec-Fetch-Site": "same-site",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
    }
    return headers


def build_search_url(wine_name: str) -> str:
    params = {"q": wine_name}
    params = urlencode(params)
    return f"{SEARCH_RESULT_URL}?{params}"
