import 'package:flutter/foundation.dart';
import '../core/constants/api_endpoints.dart';
import '../core/network/api_client.dart';
import '../models/professional_model.dart';

class SearchProvider extends ChangeNotifier {
  final ApiClient _api = ApiClient();

  String _searchQuery = "";
  bool _verifiedOnly = true;
  bool _rating45Plus = false;
  String _budgetRange = "all";
  bool _isLoading = false;

  List<ProfessionalModel> _professionals = [];

  String get searchQuery => _searchQuery;
  bool get verifiedOnly => _verifiedOnly;
  bool get rating45Plus => _rating45Plus;
  String get budgetRange => _budgetRange;
  bool get isLoading => _isLoading;
  List<ProfessionalModel> get professionals => _professionals;
  int get totalFound => _professionals.length > 5 ? 124 : _professionals.length;

  SearchProvider() {
    _loadSampleProfessionals();
    fetchProfessionals();
  }

  void _loadSampleProfessionals() {
    _professionals = [
      ProfessionalModel(
        id: 101,
        name: "Elena Rodriguez",
        title: "Senior Product Designer",
        rating: "4.9",
        reviewsCount: 128,
        isVerified: true,
        hourlyRate: 85,
        skills: ["UI/UX", "SaaS", "Design Systems"],
        bio: "Specializing in creating high-conversion interfaces for technology startups. 10+ years experience.",
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
        skills: ["React", "Node.js", "AWS"],
        bio: "I build scalable web applications with a focus on performance and security.",
        avatarUrl: "https://i.pravatar.cc/150?img=12",
      ),
      ProfessionalModel(
        id: 103,
        name: "Sarah Jenkins",
        title: "Marketing Strategist",
        rating: "4.8",
        reviewsCount: 215,
        isVerified: false,
        hourlyRate: 95,
        skills: ["SEO", "Content", "Ads"],
        bio: "Helping brands find their voice and reach their audience through data-driven campaigns.",
        avatarUrl: "https://i.pravatar.cc/150?img=32",
      ),
      ProfessionalModel(
        id: 104,
        name: "David Miller",
        title: "Interior Consultant",
        rating: "4.7",
        reviewsCount: 52,
        isVerified: true,
        hourlyRate: 110,
        skills: ["Decor", "Space Planning", "3D"],
        bio: "Creating functional and aesthetic living spaces that reflect your personality.",
        avatarUrl: "https://i.pravatar.cc/150?img=60",
      ),
      ProfessionalModel(
        id: 105,
        name: "Linda Wu",
        title: "Financial Advisor",
        rating: "4.9",
        reviewsCount: 340,
        isVerified: true,
        hourlyRate: 150,
        skills: ["Tax", "Wealth", "Strategy"],
        bio: "Expert financial planning for individuals and small businesses. Certified wealth management.",
        avatarUrl: "https://i.pravatar.cc/150?img=25",
      ),
    ];
  }

  void setSearchQuery(String q) {
    _searchQuery = q;
    fetchProfessionals();
  }

  void toggleVerifiedOnly() {
    _verifiedOnly = !_verifiedOnly;
    fetchProfessionals();
  }

  void toggleRating45Plus() {
    _rating45Plus = !_rating45Plus;
    fetchProfessionals();
  }

  Future<void> fetchProfessionals() async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _api.dio.get(
        ApiEndpoints.professionals,
        queryParameters: {
          'query': _searchQuery,
          'verified': _verifiedOnly,
          'minRating': _rating45Plus ? 4.5 : null,
        },
      );

      if (response.statusCode == 200 && response.data?['professionals'] is List) {
        final List list = response.data['professionals'];
        _professionals = list.map((e) => ProfessionalModel.fromJson(e)).toList();
      }
    } catch (_) {
      // Retain sample feed when offline
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
