#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'Matias Klemola'
SITENAME = 'matiasklemola.com'
SITEURL = 'https://matiasklemola.com'
TIMEZONE = 'Europe/Helsinki'
DEFAULT_LANG = 'English'

DEFAULT_PAGINATION = False
PAGE_URL = '{slug}'
PAGE_SAVE_AS = '{slug}/index.html'
TYPOGRIFY = False
PATH = 'content'

DIRECT_TEMPLATES = ['index', 'posts']
THEME = './theme'
THEME_STATIC_DIR = '.'

MENUITEMS = (('Home', '/', 'index'),
             ('All posts', '/posts', 'posts'),
             )
DISPLAY_CATEGORIES_ON_MENU = False
LINKS = (('GitHub', 'http://github.com/klemola'),
         ('Soundcloud', 'https://soundcloud.com/butsku'),
         ('Twitter', 'https://twitter.com/MatiasKlemola'),)

# Uncomment following line if you want document-relative URLs when developing
RELATIVE_URLS = True

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
