from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Or `serializers.PrimaryKeyRelatedField` if you want the user ID

    class Meta:
        model = Event
        fields = ['id', 'course_number', 'course_title', 'instructor', 'days',
                  'times', 'course_description', 'user', 'is_shared']
