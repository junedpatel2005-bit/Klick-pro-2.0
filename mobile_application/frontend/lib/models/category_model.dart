class CategoryModel {
  final int id;
  final String name;
  final List<String> subcategories;

  CategoryModel({
    required this.id,
    required this.name,
    this.subcategories = const [],
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    List<String> subs = [];
    if (json['subcategories'] is List) {
      subs = (json['subcategories'] as List).map((e) => e.toString()).toList();
    }
    return CategoryModel(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      name: json['name'] ?? '',
      subcategories: subs,
    );
  }
}
