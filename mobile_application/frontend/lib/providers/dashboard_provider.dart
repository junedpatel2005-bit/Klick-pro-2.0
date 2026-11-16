import 'package:flutter/foundation.dart';
import '../core/constants/api_endpoints.dart';
import '../core/network/api_client.dart';
import '../models/professional_model.dart';

class DashboardProvider extends ChangeNotifier {
  final ApiClient _api = ApiClient();

  int _activeProjects = 4;
  int _pendingProposals = 12;
  String _latestUpdateText = "Your project 'Brand Identity' has 3 new bids.";
  bool _isLoading = false;

  List<ProfessionalModel> _recommendedPros = [];

  int get activeProjects => _activeProjects;
  int get pendingProposals => _pendingProposals;
  String get latestUpdateText => _latestUpdateText;
  bool get isLoading => _isLoading;
  List<ProfessionalModel> get recommendedPros => _recommendedPros;

  DashboardProvider() {
    _loadSampleData();
    fetchDashboard();
  }

  void _loadSampleData() {
    _recommendedPros = [
      ProfessionalModel(
        id: 101,
        name: "Elena Rodriguez",
        title: "Senior UI/UX Designer",
        rating: "4.9",
        reviewsCount: 128,
        isVerified: true,
        hourlyRate: 85,
        skills: ["UI/UX", "Mobile", "SaaS"],
        bio: "Specializing in intuitive, conversion-focused mobile and web apps.",
        avatarUrl: "https://i.pravatar.cc/150?img=47",
      ),
      ProfessionalModel(
        id: 102,
        name: "Marcus Chen",
        title: "Full Stack Developer",
        rating: "5.0",
        reviewsCount: 94,
        isVerified: true,
        hourlyRate: 120,
        skills: ["React", "Flutter", "Node.js"],
        bio: "Full stack engineer building high scale architectures.",
        avatarUrl: "https://i.pravatar.cc/150?img=12",
      ),
    ];
  }

  Future<void> fetchDashboard() async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _api.dio.get(ApiEndpoints.dashboard);
      if (response.statusCode == 200 && response.data != null) {
        final data = response.data;
        _activeProjects = data['metrics']?['activeProjects'] ?? 4;
        _pendingProposals = data['metrics']?['pendingProposals'] ?? 12;
        _latestUpdateText = data['latestUpdate']?['message'] ?? _latestUpdateText;
      }
    } catch (_) {
      // Keep sample data if offline
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
