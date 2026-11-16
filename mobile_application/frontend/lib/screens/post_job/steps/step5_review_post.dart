import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_typography.dart';
import '../../../providers/job_wizard_provider.dart';
import '../../../widgets/custom_button.dart';

class Step5ReviewPost extends StatelessWidget {
  final VoidCallback onBack;
  final VoidCallback onFinish;

  const Step5ReviewPost({super.key, required this.onBack, required this.onFinish});

  @override
  Widget build(BuildContext context) {
    final wizard = context.watch<JobWizardProvider>();
    final job = wizard.jobData;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Summary Header Box
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.02),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  job.title ?? "Modern Kitchen Renovation",
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
                ),
                const SizedBox(height: 6),
                Text(
                  job.description ?? "Installation of smart appliances, custom cabinetry, and quartz countertops in a 250 sq ft space.",
                  style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4),
                ),

                const SizedBox(height: 16),
                const Divider(height: 1, color: AppColors.borderSubtle),
                const SizedBox(height: 16),

                // Budget & Date Dual Cards
                Row(
                  children: [
                    Expanded(
                      child: _infoDetailBox(
                        title: "BUDGET RANGE",
                        value: "\$12,000 – \$15,000",
                        icon: Icons.payments_outlined,
                        onEdit: () => wizard.setStep(3),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: _infoDetailBox(
                        title: "TARGET DATE",
                        value: "Oct 15, 2024",
                        icon: Icons.calendar_today_outlined,
                        onEdit: () => wizard.setStep(3),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 12),

                // Service Location Card
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceMuted,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.map_outlined, size: 20, color: AppColors.primary),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text("SERVICE LOCATION", style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textMuted)),
                            Text(
                              job.address ?? "Downtown Heights, NY",
                              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                            ),
                            const Text("Site access: Loading dock available", style: TextStyle(fontSize: 10, color: AppColors.textSecondary)),
                          ],
                        ),
                      ),
                      GestureDetector(
                        onTap: () => wizard.setStep(2),
                        child: const Text("Edit", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.primary)),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Reference Photos Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text("REFERENCE PHOTOS", style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textMuted)),
                    GestureDetector(
                      onTap: () => wizard.setStep(4),
                      child: const Text("Add More", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.primary)),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                SizedBox(
                  height: 60,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: job.mediaPhotos.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 8),
                    itemBuilder: (context, index) {
                      return ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: CachedNetworkImage(
                          imageUrl: job.mediaPhotos[index],
                          height: 60,
                          width: 60,
                          fit: BoxFit.cover,
                        ),
                      );
                    },
                  ),
                ),

                const SizedBox(height: 18),
                const Divider(height: 1, color: AppColors.borderSubtle),
                const SizedBox(height: 14),

                // "Verified Only" Toggle from Video
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text("Verified Only", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                        SizedBox(height: 2),
                        Text("Only top-rated pros can bid", style: TextStyle(fontSize: 11, color: AppColors.textSecondary)),
                      ],
                    ),
                    Switch.adaptive(
                      value: job.verifiedOnly,
                      activeColor: AppColors.primary,
                      onChanged: (v) => wizard.toggleVerifiedOnly(v),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Legal Disclaimer from Video
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Icon(Icons.info_outline, size: 14, color: AppColors.textMuted),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  "By posting, you agree to ProConnect's Terms of Service and Trust & Safety Guidelines. Your personal info is masked until you hire a provider.",
                  style: TextStyle(fontSize: 10, color: AppColors.textMuted, height: 1.3),
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Action Buttons: Save Draft & Post My Job
          Row(
            children: [
              Expanded(
                child: CustomButton(
                  text: "Save Draft",
                  variant: ButtonVariant.outline,
                  onPressed: onBack,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: CustomButton(
                  text: "Post My Job",
                  trailingIcon: Icons.rocket_launch_outlined,
                  isLoading: wizard.isSubmitting,
                  onPressed: () async {
                    final success = await wizard.submitJob();
                    if (success) {
                      onFinish();
                    }
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _infoDetailBox({
    required String title,
    required String value,
    required IconData icon,
    required VoidCallback onEdit,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surfaceMuted,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(icon, size: 16, color: AppColors.primary),
              GestureDetector(
                onTap: onEdit,
                child: const Text("Edit", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.primary)),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(title, style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: AppColors.textMuted)),
          const SizedBox(height: 2),
          Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
        ],
      ),
    );
  }
}
