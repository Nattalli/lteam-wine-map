import concurrent.futures
import typing

from wine_map.parsers.silpo import parse_silpo
from wine_map.parsers.vinoua import parse_vinoua
from wine_map.parsers.wineinshop import WineInShop
from wine_map.parsers.winetime import parse_winetime


def parse_all(wine_name: str) -> list[WineInShop]:
    with concurrent.futures.ThreadPoolExecutor() as executor:
        silpo_future = executor.submit(parse_silpo, wine_name)
        vinoua_future = executor.submit(parse_vinoua, wine_name)
        winetime_future = executor.submit(parse_winetime, wine_name)

        results = [_get_future_result_or_none(silpo_future),
                   _get_future_result_or_none(vinoua_future),
                   _get_future_result_or_none(winetime_future)]
        return [result for result in results if result]


def _get_future_result_or_none(future: concurrent.futures.Future) -> typing.Any:
    try:
        return future.result()
    except Exception:
        return None
