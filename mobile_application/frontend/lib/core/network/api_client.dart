import 'package:dio/dio.dart';
import '../constants/api_endpoints.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;

  late final Dio dio;
  String? _authToken;

  ApiClient._internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: ApiEndpoints.baseUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          if (_authToken != null) {
            options.headers['Authorization'] = 'Bearer $_authToken';
            options.headers['Cookie'] = 'servio_session=$_authToken';
          }
          return handler.next(options);
        },
        onError: (DioException e, handler) {
          // Centralized error logging
          print('[ApiClient Error] ${e.requestOptions.path}: ${e.message}');
          return handler.next(e);
        },
      ),
    );
  }

  void setAuthToken(String? token) {
    _authToken = token;
  }

  String? get authToken => _authToken;
}
