from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.groups.filter(name="admin").exists()

class IsEmployeeUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.groups.filter(name="employee").exists()


