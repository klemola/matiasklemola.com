#!/usr/bin/env python

# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

# This file is only used if you use `make publish` or
# explicitly specify it as your config file.

import os
import sys
sys.path.append(os.curdir)
from pelicanconf import *  # isort:skip

SITEURL = 'https://matiasklemola.com'
IS_LIVE = True
RELATIVE_URLS = False
WITH_FUTURE_DATES = False

FEED_ALL_ATOM = 'feeds/all.atom.xml'

DELETE_OUTPUT_DIRECTORY = True

DEFAULT_METADATA = {
    'status': 'draft',
}
