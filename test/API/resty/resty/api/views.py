from rest_framework import mixins, permissions, viewsets, status
from rest_framework.response import Response
from api.models import OutlookFile
from api.serializers import OutlookFileSerializer

class CheckBackupInOutlookViewset(mixins.ListModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    """
    A viewset for checking if a file has been backed up in outlook
    """

    permission_classes = [permissions.IsAuthenticated]  # Add your desired permissions
    queryset = OutlookFile.objects.all()
    serializer_class = OutlookFileSerializer

    def get(self, request):
        """
        Handle GET requests for Outlook Files.

        Returns a response with the current outlook files.
        """
        file = self.get_object()
        serializer = OutlookFileSerializer(file)
        return Response(serializer.data)
    
    def create(self, request):
        """
        Takes a list of file names and returns all files that do and do not exist
        """
        queryset = OutlookFile.objects.all()
        created_backup = []
        backup_exists = []
        #validate manually
        for object in request.data.get('data'):
            if object.get('id') == None or object.get('path') == None:
                return Response({"message": "invalid format"}, status=status.HTTP_400_BAD_REQUEST)
        for object in request.data.get('data'):
            try:
                obj, created = queryset.get_or_create(id=object.get('id'), path=object.get('path'))
                if created:
                    created_backup.append(obj)
                else:
                    backup_exists.append(obj)
            except Exception:
                print(Exception)

        created_backup_serialized = OutlookFileSerializer(created_backup, many=True).data
        backup_exists_serialized = OutlookFileSerializer(backup_exists, many=True).data
        
        response_data = {
            "backups_created": created_backup_serialized,
            "backups_found": backup_exists_serialized,
            "num_created": len(created_backup_serialized),
            "num_found": len(backup_exists_serialized)
        }
        return Response(response_data, status=status.HTTP_201_CREATED)