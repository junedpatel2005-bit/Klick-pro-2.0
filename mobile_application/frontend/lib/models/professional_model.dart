class ProfessionalModel {
  final int id;
  final String name;
  final String title;
  final String rating;
  final int reviewsCount;
  final bool isVerified;
  final double hourlyRate;
  final List<String> skills;
  final String bio;
  final String avatarUrl;

  ProfessionalModel({
    required this.id,
    required this.name,
    required this.title,
    required this.rating,
    required this.reviewsCount,
    required this.isVerified,
    required this.hourlyRate,
    required this.skills,
    required this.bio,
    required this.avatarUrl,
  });

  factory ProfessionalModel.fromJson(Map<String, dynamic> json) {
    List<String> parsedSkills = [];
    if (json['skills'] is List) {
      parsedSkills = (json['skills'] as List).map((e) => e.toString()).toList();
    }

    return ProfessionalModel(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      name: json['name'] ?? 'Professional Expert',
      title: json['title'] ?? 'Specialist',
      rating: json['rating']?.toString() ?? '5.0',
      reviewsCount: json['reviewsCount'] is int
          ? json['reviewsCount']
          : int.tryParse(json['reviewsCount']?.toString() ?? '0') ?? 0,
      isVerified: json['isVerified'] ?? false,
      hourlyRate: json['hourlyRate'] != null
          ? (json['hourlyRate'] as num).toDouble()
          : 50.0,
      skills: parsedSkills,
      bio: json['bio'] ?? '',
      avatarUrl: json['avatarUrl'] ?? 'https://i.pravatar.cc/150',
    );
  }
}
