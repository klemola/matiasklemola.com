import datetime

now = datetime.datetime.now()

MENUITEMS = (('Home', '/', 'index'),
             ('All posts', '/posts', 'posts'),
             )

SOCIAL_LINKS = (('GitHub', 'http://github.com/klemola'),
                ('Soundcloud', 'https://soundcloud.com/butsku'),
                ('Twitter', 'https://twitter.com/MatiasKlemola'))

EXTERNAL_POSTS = [('“I want to host a meetup” @ Valuemotive blog',
                   'https://blog.valuemotive.com/i-want-to-host-a-meetup-33255235ecf')]

SITE_SOURCE_CODE_URL = 'https://github.com/klemola/matiasklemola.com'
CURRENT_YEAR = now.year
