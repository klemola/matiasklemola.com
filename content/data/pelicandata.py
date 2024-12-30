import datetime

now = datetime.datetime.now()

MENUITEMS = (('Home', '/', 'index'),
             ('Articles', '/articles', 'articles'),
             ('Journal', '/journal', 'journal'),
             )

SOCIAL_LINKS = (('Mastodon', 'https://mastodon.gamedev.place/@yourmagicisworking'),
                ('Bluesky', 'https://bsky.app/profile/matiasklemola.com'),
                ('GitHub', 'http://github.com/klemola'),
                ('Soundcloud', 'https://soundcloud.com/butsku'))

EXTERNAL_ARTICLES = [('“I want to host a meetup”',
                      'https://www.valuemotive.com/post/i-want-to-host-a-meetup'),
                     ("Hobby project spotlight: “vetovoima”", 'https://www.valuemotive.com/post/hobby-project-spotlight-vetovoima')]

SITE_SOURCE_CODE_URL = 'https://github.com/klemola/matiasklemola.com'
CURRENT_YEAR = now.year
