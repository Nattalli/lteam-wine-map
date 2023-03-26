import concurrent.futures
import typing

from wine_map.parsers.silpo import parse_silpo
from wine_map.parsers.vinoua import parse_vinoua
from wine_map.parsers.wineinfo import WineInShop
from wine_map.parsers.winetime import parse_winetime


def parse_all(wine_name: str) -> dict[str, WineInShop]:
    with concurrent.futures.ThreadPoolExecutor() as executor:
        silpo_future = executor.submit(parse_silpo, wine_name)
        vinoua_future = executor.submit(parse_vinoua, wine_name)
        winetime_future = executor.submit(parse_winetime, wine_name)

        concurrent.futures.wait([silpo_future, vinoua_future, winetime_future])
        return {
            "silpo": _get_future_result_or_none(silpo_future),
            "vinoua": _get_future_result_or_none(vinoua_future),
            "winetime": _get_future_result_or_none(winetime_future)
        }


def _get_future_result_or_none(f: concurrent.futures.Future) -> typing.Any:
    try:
        return f.result()
    except Exception:
        return None
