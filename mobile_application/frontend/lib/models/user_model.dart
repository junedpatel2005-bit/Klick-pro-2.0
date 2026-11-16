class UserModel {
  final int id;
  final String firstName;
  final String lastName;
  final String fullName;
  final String email;
  final String? phone;
  final String role;
  final String avatarUrl;
  final bool isVerified;

  UserModel({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.fullName,
    required this.email,
    this.phone,
    required this.role,
    required this.avatarUrl,
    this.isVerified = false,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    String cap(String? s) => (s != null && s.isNotEmpty)
        ? '${s[0].toUpperCase()}${s.substring(1)}'
        : '';

    final fName = cap(json['firstName'] ?? json['first_name'] ?? '');
    final lName = cap(json['lastName'] ?? json['last_name'] ?? '');

    return UserModel(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      firstName: fName,
      lastName: lName,
      fullName: json['fullName'] ?? '$fName $lName'.trim(),
      email: json['email'] ?? '',
      phone: json['phone'],
      role: json['role'] ?? 'CLIENT',
      avatarUrl: json['avatarUrl'] ?? json['avatar_url'] ?? 'https://i.pravatar.cc/150',
      isVerified: json['isVerified'] ?? json['is_verified'] ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'firstName': firstName,
    'lastName': lastName,
    'fullName': fullName,
    'email': email,
    'phone': phone,
    'role': role,
    'avatarUrl': avatarUrl,
    'isVerified': isVerified,
  };
}
