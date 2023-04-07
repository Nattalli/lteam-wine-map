import os
import sys
from pathlib import Path

import django

sys.path.append(str(Path(".").resolve() / "api"))

sys.dont_write_bytecode = True
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")
django.setup()