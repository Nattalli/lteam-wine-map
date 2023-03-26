from dataclasses import dataclass


@dataclass
class WineInShop:
    shop_name: str
    min_price: int
    max_price: int
    url: str
