class JobPostModel {
  String? category;
  String? subcategory;
  String? title;
  String? description;

  String? address;
  double radiusMiles;
  double? latitude;
  double? longitude;

  String budgetType; // 'hourly', 'fixed', 'negotiable'
  double? estimatedBudget;
  DateTime? startDate;
  DateTime? expectedEndDate;
  String urgencyLevel; // 'immediate', 'within_week', 'within_month', 'flexible'

  List<String> mediaPhotos;
  bool toolsRequired;
  bool verifiedIdRequired;
  bool materialsProvided;
  String? specialInstructions;
  bool verifiedOnly;

  JobPostModel({
    this.category,
    this.subcategory,
    this.title,
    this.description,
    this.address = "Downtown Heights, NY",
    this.radiusMiles = 15.0,
    this.latitude = 37.7749,
    this.longitude = -122.4194,
    this.budgetType = 'fixed',
    this.estimatedBudget = 12000,
    this.startDate,
    this.expectedEndDate,
    this.urgencyLevel = 'within_month',
    this.mediaPhotos = const [],
    this.toolsRequired = true,
    this.verifiedIdRequired = true,
    this.materialsProvided = false,
    this.specialInstructions,
    this.verifiedOnly = true,
  });

  Map<String, dynamic> toJson() => {
    'title': title,
    'description': description,
    'category': category,
    'subcategory': subcategory,
    'address': address,
    'serviceRadiusKm': (radiusMiles * 1.60934).round(),
    'budgetType': budgetType.toUpperCase(),
    'estimatedBudget': estimatedBudget,
    'startDate': startDate?.toIso8601String(),
    'expectedEndDate': expectedEndDate?.toIso8601String(),
    'urgencyLevel': urgencyLevel,
    'requirements': {
      'toolsRequired': toolsRequired,
      'verifiedIdRequired': verifiedIdRequired,
      'materialsProvided': materialsProvided,
    },
    'specialInstructions': specialInstructions,
    'verifiedOnly': verifiedOnly,
  };
}
