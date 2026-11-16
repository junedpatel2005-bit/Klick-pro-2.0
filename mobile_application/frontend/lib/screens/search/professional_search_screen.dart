import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_typography.dart';
import '../../providers/auth_provider.dart';
import '../../providers/search_provider.dart';
import '../../widgets/professional_card.dart';
import '../post_job/post_job_wizard_screen.dart';

class ProfessionalSearchScreen extends StatefulWidget {
  const ProfessionalSearchScreen({super.key});

  @override
  State<ProfessionalSearchScreen> createState() => _ProfessionalSearchScreenState();
}

class _ProfessionalSearchScreenState extends State<ProfessionalSearchScreen> {
  final _searchController = TextEditingController();

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final search = context.watch<SearchProvider>();
    final auth = context.watch<AuthProvider>();
    final user = auth.currentUser;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text("ProConnect", style: AppTypography.brandTitle),
        actions: [
          // "Post a Job" header button from video
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const PostJobWizardScreen()),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                elevation: 0,
              ),
              child: const Text(
                "Post a\nJob",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, height: 1.1),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: CircleAvatar(
              radius: 17,
              backgroundImage: NetworkImage(user?.avatarUrl ?? "https://i.pravatar.cc/150?img=68"),
            ),
          ),
        ],
      ),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Search Input Field
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: TextField(
                    controller: _searchController,
                    onSubmitted: (v) => search.setSearchQuery(v),
                    decoration: InputDecoration(
                      hintText: "Search for UX Designers, Plumbers, or...",
                      prefixIcon: const Icon(Icons.search, size: 20, color: AppColors.textMuted),
                      border: InputBorder.none,
                      enabledBorder: InputBorder.none,
                      focusedBorder: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),

                const SizedBox(height: 12),

                // Filters & Search Action Row
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.tune, size: 16, color: AppColors.textPrimary),
                        label: const Text("Filters", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                        style: OutlinedButton.styleFrom(
                          backgroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () => search.setSearchQuery(_searchController.text),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          elevation: 0,
                        ),
                        child: const Text("Search", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 14),

                // Filter chips from video: [Verified Pros], [Rating 4.5+], [Budget: $$-$$$]
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _filterChip(
                        label: "Verified Pros",
                        isSelected: search.verifiedOnly,
                        onTap: () => search.toggleVerifiedOnly(),
                        showCheck: true,
                      ),
                      const SizedBox(width: 8),
                      _filterChip(
                        label: "Rating 4.5+",
                        isSelected: search.rating45Plus,
                        onTap: () => search.toggleRating45Plus(),
                      ),
                      const SizedBox(width: 8),
                      _filterChip(
                        label: "Budget: \$\$-\$\$\$",
                        isSelected: false,
                        onTap: () {},
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Results banner: "124 professionals found - Based on your current search and location"
                Text(
                  "${search.totalFound} professionals found",
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textPrimary,
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 2),
                const Text(
                  "Based on your current search and location",
                  style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                ),

                const SizedBox(height: 16),

                // List of professional cards
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: search.professionals.length,
                  itemBuilder: (context, index) {
                    final pro = search.professionals[index];
                    return ProfessionalCard(
                      pro: pro,
                      onHire: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const PostJobWizardScreen()),
                        );
                      },
                    );
                  },
                ),

                const SizedBox(height: 80), // Padding for floating filter button
              ],
            ),
          ),

          // Floating bottom pill button: [Adjust Filters]
          Positioned(
            bottom: 20,
            left: 0,
            right: 0,
            child: Center(
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.2),
                      blurRadius: 16,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: ElevatedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.tune, size: 16, color: Colors.white),
                  label: const Text("Adjust Filters", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.white)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryDark,
                    padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                    elevation: 0,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _filterChip({
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
    bool showCheck = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: 1.2,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (showCheck && isSelected) ...[
              const Icon(Icons.check, size: 14, color: Colors.white),
              const SizedBox(width: 4),
            ],
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: isSelected ? Colors.white : AppColors.textPrimary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
