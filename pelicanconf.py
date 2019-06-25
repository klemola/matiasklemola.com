#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals
import os
import sys

AUTHOR = 'Matias Klemola'
SITENAME = 'matiasklemola.com'
SITEURL = 'https://matiasklemola.com'
TIMEZONE = 'Europe/Helsinki'
DEFAULT_LANG = 'English'
DEFAULT_DATE_FORMAT = '%A, %B %-d, %Y'

DEFAULT_PAGINATION = False
PAGE_URL = '{slug}'
PAGE_SAVE_AS = '{slug}/index.html'
AUTHOR_SAVE_AS = ''
TYPOGRIFY = False
PATH = 'content'

STATIC_PATHS = ['code', 'images']
PLUGIN_PATHS = ['plugins']
PLUGINS = ['readtime', 'liquid_tags.include_code']
IGNORE_FILES = ['__pycache__', 'node_modules']

DIRECT_TEMPLATES = ['index', 'posts']
THEME = './theme'
THEME_STATIC_DIR = '.'

DISPLAY_CATEGORIES_ON_MENU = False

RELATIVE_URLS = True

FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

sys.path.append(os.curdir)
sys.path.append(os.path.join(os.curdir, 'content', 'data'))

from pelicandata import *
