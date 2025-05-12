from rest_framework import serializers
from .models import Event

# Serializer to convert Event model instances to/from JSON
class EventSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Event
        fields = ['id', 'course_number', 'course_title', 'instructor', 'days',
                  'times', 'course_description', 'user', 'is_shared']
