import difflib
import json
import typing
from typing import Optional
from urllib.parse import urlencode, quote

import requests

from . import errors
from .wineinshop import WineInShop

SHOP_NAME = "silpo"
API_ENDPOINT_URL = "https://api.catalog.ecom.silpo.ua/api/2.0/exec/EcomCatalogGlobal"
REQUEST_TIMEOUT = 2
SEARCH_RESULT_URL = "https://shop.silpo.ua/search/all"


def parse_silpo(wine_name: str) -> Optional[WineInShop]:
    data = fetch_data(wine_name)
    return parse_data(wine_name, data)


def fetch_data(wine_name: str) -> dict[str, typing.Any]:
    headers = build_request_headers()
    body = build_request_body(wine_name)
    try:
        response = requests.post(
            API_ENDPOINT_URL, headers=headers, json=body, timeout=REQUEST_TIMEOUT
        )
        response.raise_for_status()
        data = response.json()
    except (requests.RequestException, json.JSONDecodeError) as e:
        raise errors.NetworkError(f"Could not fetch data for wine {wine_name}") from e
    return data


def parse_data(wine_name: str, data: dict[str, typing.Any]) -> Optional[WineInShop]:
    wines = [
        item
        for item in data.get("items", [])
        if is_wine(item) and names_are_similar(item.get("name", ""), wine_name)
    ]
    if not wines:
        return None
    prices = [wine["price"] for wine in wines if "price" in wine]
    url = build_search_result_url(wine_name)
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


def build_request_body(wine_name: str) -> dict[str, typing.Any]:
    body = {
        "method": "GetSimpleCatalogItems",
        "data": {
            "merchantId": 1,
            "basketGuid": "",
            "customFilter": wine_name,
            "deliveryType": 2,
            "filialId": 2043,
            "From": 1,
            "To": 10,
            "sortBy": "default",
        },
    }
    return body


def build_search_result_url(wine_name: str) -> str:
    params = {"find": wine_name}
    params = urlencode(params, quote_via=quote)
    return f"{SEARCH_RESULT_URL}?{params}"


def is_wine(item: dict) -> bool:
    try:
        categories = item["categories"]
    except KeyError:
        return False
    return any(category["id"] == 22 for category in categories)


def names_are_similar(name1: str, name2: str) -> bool:
    min_similarity_ratio = 0.5
    matcher = difflib.SequenceMatcher(None, name1, name2)
    return matcher.ratio() >= min_similarity_ratio
