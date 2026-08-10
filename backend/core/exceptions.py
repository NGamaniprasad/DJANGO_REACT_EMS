from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return response

    response.data = {
        "success": False,
        "status_code": response.status_code,
        "errors": response.data,
    }

    return response