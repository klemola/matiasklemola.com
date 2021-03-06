#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals
import os
import sys

AUTHOR = 'Matias Klemola'
SITENAME = 'matiasklemola.com'
SITEURL = 'https://matiasklemola.com'
TIMEZONE = 'Europe/Helsinki'
LOCALE = 'en_US'
DEFAULT_LANG = 'en'
DEFAULT_DATE_FORMAT = '%B %-d, %Y'

DEFAULT_PAGINATION = False
PAGE_URL = '{slug}'
PAGE_SAVE_AS = '{slug}/index.html'
AUTHOR_SAVE_AS = ''
TYPOGRIFY = False
PATH = 'content'

STATIC_PATHS = ['code', 'images', 'embed']
PLUGIN_PATHS = ['plugins']
PLUGINS = ['readtime']
IGNORE_FILES = ['__pycache__', 'node_modules']
ARTICLE_EXCLUDES = ['embed']
PAGE_EXCLUDES = ['embed']

DIRECT_TEMPLATES = ['index', 'articles', 'journal']
THEME = './theme'
THEME_STATIC_DIR = '.'

DISPLAY_CATEGORIES_ON_MENU = False

RELATIVE_URLS = True

FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

MARKDOWN = {
    'extension_configs': {
        'markdown.extensions.codehilite': {'css_class': 'highlight', 'guess_lang': False},
        'markdown.extensions.extra': {},
        'markdown.extensions.meta': {},
        'markdown.extensions.admonition': {},
        'markdown_captions': {},
    },
    'output_format': 'html5',
}

sys.path.append(os.curdir)
sys.path.append(os.path.join(os.curdir, 'content', 'data'))

from pelicandata import *
