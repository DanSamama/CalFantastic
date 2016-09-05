#!/usr/bin/env python
import os
import webapp2
from webapp2_extras import routes
import jinja2

jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))


def getAppVersion():
	return "v0.0.1"


class MainHandler(webapp2.RequestHandler):
	def get(self):
		template = jinja_environment.get_template('/pages/index.html')
		params = {}
		params["version"] = getAppVersion()
		self.response.write(template.render(params))


app = webapp2.WSGIApplication([
	('/', MainHandler)
], debug=True)
