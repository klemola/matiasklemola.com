#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

# This file is only used if you use `make publish` or
# explicitly specify it as your config file.

from pelicanconf import *
import os
import sys
sys.path.append(os.curdir)

SITEURL = 'https://matiasklemola.com'
RELATIVE_URLS = False
WITH_FUTURE_DATES = False

FEED_ALL_ATOM = 'feeds/all.atom.xml'
CATEGORY_FEED_ATOM = 'feeds/{slug}.atom.xml'

DELETE_OUTPUT_DIRECTORY = True
