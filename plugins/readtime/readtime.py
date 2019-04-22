import re
import math

from pelican import signals
from html.parser import HTMLParser  # use html.parser for Python 3.6


# http://en.wikipedia.org/wiki/Words_per_minute
WPM = 230.0


class MLStripper(HTMLParser):
    def __init__(self):
        # subclassing HTMLParser, also need to calling
        super().__init__()
        # super class's '__init__' method
        self.reset()
        self.fed = []

    # this method is called whenever a 'data' is encountered.
    def handle_data(self, d):
        self.fed.append(d)

    # join all content word into one long sentence for further processing
    def get_data(self):
        return ''.join(self.fed)


def strip_tags(html):
    s = MLStripper()
    s.feed(html)   		# Feed the class with html content, get the fed list
    return s.get_data()


def calculate_readtime(content_object):
    if content_object._content is not None:
        content = content_object._content  # get the content html from Pelican

        text = strip_tags(content)  # strip tags and get long sentence
        # split the long sentence into list of words
        words = re.split(r'[^0-9A-Za-z]+', text)

        num_words = len(words)  	# count the words
        minutes = int(math.ceil(num_words / WPM))  # calculate the minutes

        # set minimum read time to 1 minutes.
        if minutes == 0:
            minutes = 1

        content_object.readtime = {
            "minutes": minutes,
        }


def register():
    # connect with 'content_object_init' signal.
    signals.content_object_init.connect(calculate_readtime)
