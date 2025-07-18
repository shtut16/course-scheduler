from rest_framework import status, permissions, viewsets
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
from django.contrib.auth.models import User
from .models import Event, ChangeLog
from .serializers import EventSerializer

# Root API home
def api_home(request):
    return JsonResponse({"message": "Welcome to the API"})

# Custom JWT login view with success message
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return Response({"message": "Login successful", "tokens": response.data})

# Authenticated dashboard view showing user role info
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "message": f"Welcome, {user.username}!",
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
        })

# Public user signup view
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password)
    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

# Create new event for authenticated user
class EventCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Check required fields
        required_fields = ['course_number', 'course_title', 'instructor', 'days', 'times']
        missing_fields = [field for field in required_fields if field not in request.data]

        if missing_fields:
            return Response({'error': f'Missing required fields: {", ".join(missing_fields)}'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Link event to the logged-in user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Viewset for retrieving/updating user's personal (non-shared) events
class MyCalendarView(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(user=self.request.user, is_shared=False)

# Viewset for retrieving/updating shared events
class SharedCalendarView(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(is_shared=True)

# Delete a specific event and log the deletion
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def event_detail(request, id):
    try:
        event = Event.objects.get(id=id, user=request.user)
    except Event.DoesNotExist:
        return Response({"detail": "Event not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        # Create the change log entry first
        ChangeLog.objects.create(
            event=event,
            user=request.user,
            action='deleted',
            notes=f"Deleted event '{event.course_title}' from the calendar"
        )

        # Delete the event
        event.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

# Push all of the user's events to the shared calendar and log the actions
class PushCalendarToSharedView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_events = Event.objects.filter(user=request.user)
        pushed_events = []

        for event in user_events:
            if not event.is_shared:
                event.is_shared = True
                event.save()
                pushed_events.append(event)

                # Log the push action
                ChangeLog.objects.create(
                    event=event,
                    user=request.user,
                    action='pushed',
                    notes=f"Pushed '{event.course_title}' to shared calendar"
                )

        events_with_user_data = EventSerializer(pushed_events, many=True).data

        return Response({
            "message": f"{len(pushed_events)} event(s) pushed to the shared calendar.",
            "events": events_with_user_data
        }, status=200)

# Returns the most recent push/delete actions from the changelog
@api_view(['GET'])
def recent_changes(request):
    try:
        logs = ChangeLog.objects.filter(action__in=['pushed', 'deleted']).select_related('event', 'user').order_by('-timestamp')[:50]
    except Exception as e:
        return Response({"error": f"Database query failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    data = [
        {
            'event_id': log.event.id if log.event else None,  # Handle None case for event
            'event_title': log.event.course_title if log.event else 'No Event',  # Handle None case for event title
            'user': log.user.username if log.user else 'Anonymous',  # Handle None case for user
            'action': log.get_action_display(),
            'timestamp': log.timestamp,
            'notes': log.notes,
        }
        for log in logs
    ]

    return Response(data)





