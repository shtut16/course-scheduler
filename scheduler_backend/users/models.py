from django.db import models
from django.contrib.auth.models import User

# Model representing a course.
class Event(models.Model):
    course_number = models.CharField(max_length=20)
    course_title = models.CharField(max_length=200)
    instructor = models.CharField(max_length=200, blank=True, null=True)
    days = models.CharField(max_length=50)  # e.g., "Mon, Wed, Fri"
    times = models.CharField(max_length=100)  # e.g., "9:00 AM - 10:30 AM"
    course_description = models.TextField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    is_shared = models.BooleanField(default=False)  # Flag for shared events

    def __str__(self):
        return f"{self.course_number} - {self.course_title}"

# Model to log changes made to events for recent changes.
class ChangeLog(models.Model):
    ACTION_CHOICES = [
        ('created', 'Created'),
        ('updated', 'Updated'),
        ('deleted', 'Deleted'),
        ('pushed', 'Pushed to Shared Calendar'),
    ]

    event = models.ForeignKey(Event, on_delete=models.SET_NULL, null=True, related_name='change_logs')  # Change this line
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.get_action_display()} by {self.user} on {self.timestamp:%Y-%m-%d %H:%M}"
