class ApiEndpoints {
  // Mobile API Gateway base URL
  // Use 10.0.2.2 for Android Emulator, localhost for iOS simulator/macOS/web
  static const String baseUrl = "http://localhost:5050/api/v1/mobile";
  static const String fallbackMonolithUrl = "http://localhost:5000/api";

  // Endpoints
  static const String status = "/status";
  static const String login = "/auth/login";
  static const String me = "/auth/me";
  static const String dashboard = "/dashboard/summary";
  static const String professionals = "/professionals";
  static const String categories = "/categories";
  static const String jobs = "/jobs";
}
