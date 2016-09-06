#!/usr/bin/env python
import os
import webapp2
import models
import db
from webapp2_extras import routes
from uuid import uuid4
import jinja2

jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))


def getAppVersion():
    return "v0.0.1"


# Generate an hash Id for every activity created
def generateId():
    return str(uuid4().hex)


# Hard coded user
def getCurrentLoggedInUser(self):
    return "Patrick"


class MainHandler(webapp2.RequestHandler):
    def get(self):
        template = jinja_environment.get_template('/pages/index.html')
        context = {}
        context["version"] = getAppVersion()
        context["repository"] = db.getRepositoryActivities("bootcamp", "winter 2015")
        context["calendar"] = db.getCalendarSetup("bootcamp", "winter 2015")
        context["chrono_list"] = db.getchronoListActivities("bootcamp", "winter 2015")
        self.response.write(template.render(context))


class ActivityForm(webapp2.RequestHandler):
    def get(self):
        template = jinja_environment.get_template('/forms/activity.html')
        context = {}
        context["version"] = getAppVersion()
        self.response.write(template.render(context))

    def post(self):
        newActivity = models.Activity()
        newActivity.id = generateId()
        newActivity.title = self.request.get("title")
        newActivity.creator = getCurrentLoggedInUser(self)
        newActivity.program = self.request.get("program")
        newActivity.cohort = self.request.get("cohort")
        newActivity.type = self.request.get("type")
        newActivity.desc = self.request.get("desc")
        newActivity.time_slots = int(self.request.get("time_slots"))
        newActivity.status = "IN_REPOSITORY"
        newActivity.put()
        self.response.write("activity saved")


class CalendarForm(webapp2.RequestHandler):
    def get(self):
        template = jinja_environment.get_template('/forms/calendarForm.html')
        context = {}
        context["version"] = getAppVersion()
        self.response.write(template.render(context))

    def post(self):
        newCalendar = models.Calendar()
        newCalendar.project_starting_day = self.request.get("project_starting_day")
        newCalendar.day_starting_hour = self.request.get("day_starting_hour")
        newCalendar.day_ending_hour = self.request.get("day_ending_hour")
        newCalendar.put()
        self.response.write("calendar saved")


class ScheduleActivity(webapp2.RequestHandler):
    def get(self):
        activityId = self.request.get("activity_id")
        prevActivityId = self.request.get("prev_activity_id")
        nextActivityId = self.request.get("next_activity_id")
        activity = db.getActivityById(activityId)
        if activity:
            activity.status = "IN_CHRONOLIST"
            activity.next = nextActivityId
            activity.put()
        prevActivity = db.getActivityById(prevActivityId)
        prevActivity.next = activityId
        prevActivity.put()


app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/activity', ActivityForm),
    ('/calendarForm',CalendarForm),
    ('/schedule_activity', ScheduleActivity)

], debug=True)
