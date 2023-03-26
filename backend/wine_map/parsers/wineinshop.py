from dataclasses import dataclass


@dataclass
class WineInShop:
    min_price: int
    max_price: int
    url: str
