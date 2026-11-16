import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_typography.dart';
import '../../providers/auth_provider.dart';
import '../../providers/dashboard_provider.dart';
import '../../widgets/metric_card.dart';
import '../../widgets/professional_card.dart';
import '../../widgets/status_badge.dart';
import '../post_job/post_job_wizard_screen.dart';

class DashboardScreen extends StatelessWidget {
  final VoidCallback onNavigateToSearch;

  const DashboardScreen({super.key, required this.onNavigateToSearch});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final dashboard = context.watch<DashboardProvider>();
    final user = auth.currentUser;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text("ProConnect", style: AppTypography.brandTitle),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: CachedNetworkImage(
                imageUrl: user?.avatarUrl ?? "https://i.pravatar.cc/150?img=68",
                height: 38,
                width: 38,
                fit: BoxFit.cover,
                errorWidget: (_, __, ___) => const CircleAvatar(
                  radius: 19,
                  backgroundColor: AppColors.surfaceMuted,
                  child: Icon(Icons.person, color: AppColors.textSecondary),
                ),
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // User Greeting
              Text(
                "Hello, ${user?.firstName ?? 'Alexander'}",
                style: AppTypography.headlineLarge,
              ),
              const SizedBox(height: 4),
              Text(
                "What professional service do you need today?",
                style: AppTypography.bodyMedium,
              ),

              const SizedBox(height: 18),

              // Search Bar
              GestureDetector(
                onTap: onNavigateToSearch,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.search, size: 20, color: AppColors.textMuted),
                      const SizedBox(width: 10),
                      Text(
                        "Search for experts (e.g. UI Designer, Pl...",
                        style: TextStyle(fontSize: 13, color: AppColors.textMuted),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 18),

              // Metric Cards Row (04 Active Projects, 12 Pending Proposals)
              Row(
                children: [
                  Expanded(
                    child: MetricCard(
                      count: "0${dashboard.activeProjects}",
                      label: "Active Projects",
                      icon: Icons.assignment_turned_in_outlined,
                      isPrimary: true,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: MetricCard(
                      count: "${dashboard.pendingProposals}",
                      label: "Pending Proposals",
                      icon: Icons.content_paste_outlined,
                      isPrimary: false,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 18),

              // Latest Update Notice Card (Coral from video)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.noticeBackground,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.noticeBorder),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "LATEST UPDATE",
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.8,
                        color: AppColors.noticeText,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      dashboard.latestUpdateText,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Text(
                          "View Proposals",
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: AppColors.noticeText,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Icon(Icons.arrow_forward, size: 14, color: AppColors.noticeText),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Quick Actions Section
              Text("Quick Actions", style: AppTypography.titleMedium),
              const SizedBox(height: 12),
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 1.45,
                children: [
                  _quickActionCard(
                    icon: Icons.add_circle_outline,
                    title: "Post a Job",
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const PostJobWizardScreen()),
                      );
                    },
                  ),
                  _quickActionCard(
                    icon: Icons.person_search_outlined,
                    title: "Search",
                    onTap: onNavigateToSearch,
                  ),
                  _quickActionCard(
                    icon: Icons.category_outlined,
                    title: "Categories",
                    onTap: onNavigateToSearch,
                  ),
                  _quickActionCard(
                    icon: Icons.bookmark_border,
                    title: "Saved",
                    onTap: () {},
                  ),
                ],
              ),

              const SizedBox(height: 24),

              // Recommended for You (Horizontal carousel from video)
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text("Recommended for You", style: AppTypography.titleMedium),
                  GestureDetector(
                    onTap: onNavigateToSearch,
                    child: Row(
                      children: const [
                        Text("View all", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.primary)),
                        SizedBox(width: 2),
                        Icon(Icons.open_in_new, size: 12, color: AppColors.primary),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              SizedBox(
                height: 195,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: dashboard.recommendedPros.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 12),
                  itemBuilder: (context, index) {
                    return ProfessionalCard(
                      pro: dashboard.recommendedPros[index],
                      compact: true,
                      onHire: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const PostJobWizardScreen()),
                        );
                      },
                    );
                  },
                ),
              ),

              const SizedBox(height: 24),

              // Current Focus (Project progress from video)
              Text("Current Focus", style: AppTypography.titleMedium),
              const SizedBox(height: 12),

              _currentFocusCard(
                icon: Icons.rocket_launch_outlined,
                title: "E-commerce Mobile App",
                progress: 0.65,
                percentage: "65%",
                badgeText: "DUE IN 4 DAYS",
                badgeType: BadgeType.onTrack,
                badgeLabel: "On Track",
              ),
              const SizedBox(height: 12),
              _currentFocusCard(
                icon: Icons.edit_note,
                title: "Logo Redesign Phase 2",
                progress: 0.20,
                percentage: "20%",
                badgeText: "DELAYED",
                badgeType: BadgeType.delayed,
                badgeLabel: "Action Needed",
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _quickActionCard({required IconData icon, required String title, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.primaryContainer.withOpacity(0.5),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 22, color: AppColors.primary),
            ),
            const SizedBox(height: 8),
            Text(
              title,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
            ),
          ],
        ),
      ),
    );
  }

  Widget _currentFocusCard({
    required IconData icon,
    required String title,
    required double progress,
    required String percentage,
    required String badgeText,
    required BadgeType badgeType,
    required String badgeLabel,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.surfaceMuted,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, size: 20, color: AppColors.primary),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        Text(
                          badgeText,
                          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.textMuted),
                        ),
                        const SizedBox(width: 6),
                        StatusBadge(label: badgeLabel, type: badgeType),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: progress,
                    minHeight: 6,
                    backgroundColor: AppColors.borderSubtle,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      badgeType == BadgeType.delayed ? AppColors.delayedRed : AppColors.primary,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Text(
                percentage,
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.textSecondary),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
