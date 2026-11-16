import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_typography.dart';
import '../../../providers/job_wizard_provider.dart';
import '../../../widgets/custom_button.dart';

class Step4MediaRequirements extends StatelessWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const Step4MediaRequirements({super.key, required this.onNext, required this.onBack});

  @override
  Widget build(BuildContext context) {
    final wizard = context.watch<JobWizardProvider>();
    final job = wizard.jobData;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.primaryContainer.withOpacity(0.5),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  "4/5",
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.primary),
                ),
              ),
              const Text(
                "Media & Requirements",
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
              ),
            ],
          ),

          const SizedBox(height: 18),

          Text("Showcase the work", style: AppTypography.headlineLarge),
          const SizedBox(height: 6),
          Text(
            "Clear photos and specific requirements help professionals provide more accurate quotes.",
            style: AppTypography.bodyMedium,
          ),

          const SizedBox(height: 24),

          // Media Upload Box
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Text("Media Upload", style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
              Text("Max 20 MB total", style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
            ],
          ),
          const SizedBox(height: 8),

          // Upload Drop Zone
          InkWell(
            onTap: () {
              wizard.addPhoto("https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300");
            },
            borderRadius: BorderRadius.circular(16),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.primary.withOpacity(0.4), style: BorderStyle.solid, width: 1.5),
              ),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.primaryContainer.withOpacity(0.4),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.file_upload_outlined, size: 26, color: AppColors.primary),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    "Tap to upload or drag & drop",
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                  ),
                  const SizedBox(height: 2),
                  const Text(
                    "Photos, Videos, or PDF documents",
                    style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _badgeTag("MAX 20 PHOTOS"),
                      const SizedBox(width: 6),
                      _badgeTag("3 VIDEOS"),
                    ],
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 14),

          // Photos Strip with remove buttons
          SizedBox(
            height: 85,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: job.mediaPhotos.length + 1,
              separatorBuilder: (_, __) => const SizedBox(width: 10),
              itemBuilder: (context, index) {
                if (index == job.mediaPhotos.length) {
                  return InkWell(
                    onTap: () {
                      wizard.addPhoto("https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300");
                    },
                    child: Container(
                      width: 85,
                      decoration: BoxDecoration(
                        color: AppColors.surfaceMuted,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: const Center(
                        child: Icon(Icons.add, size: 28, color: AppColors.textMuted),
                      ),
                    ),
                  );
                }

                return Stack(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: CachedNetworkImage(
                        imageUrl: job.mediaPhotos[index],
                        width: 85,
                        height: 85,
                        fit: BoxFit.cover,
                      ),
                    ),
                    Positioned(
                      top: 4,
                      right: 4,
                      child: GestureDetector(
                        onTap: () => wizard.removePhoto(index),
                        child: Container(
                          padding: const EdgeInsets.all(2),
                          decoration: const BoxDecoration(
                            color: Colors.black54,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.close, size: 12, color: Colors.white),
                        ),
                      ),
                    ),
                  ],
                );
              },
            ),
          ),

          const SizedBox(height: 24),

          // Job Requirements Checkboxes from Video
          const Text("Job Requirements", style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
          const SizedBox(height: 10),

          _requirementItem(
            title: "Professional must bring tools",
            subtitle: "I don't have equipment on-site",
            value: job.toolsRequired,
            onChanged: (v) => wizard.toggleToolsRequired(v ?? true),
          ),
          const SizedBox(height: 8),
          _requirementItem(
            title: "Verified Identity Required",
            subtitle: "Only providers with ProConnect ID check",
            value: job.verifiedIdRequired,
            onChanged: (v) => wizard.toggleVerifiedIdRequired(v ?? true),
          ),
          const SizedBox(height: 8),
          _requirementItem(
            title: "Materials provided by me",
            subtitle: "I will have parts/supplies ready",
            value: job.materialsProvided,
            onChanged: (v) => wizard.toggleMaterialsProvided(v ?? false),
          ),

          const SizedBox(height: 20),

          // Special Instructions Textarea
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Text("Special Instructions", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
              Text("Optional", style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
            ],
          ),
          const SizedBox(height: 6),
          TextFormField(
            maxLines: 3,
            decoration: const InputDecoration(
              hintText: "E.g. Access instructions, parking details, or specific pet warnings...",
            ),
          ),

          const SizedBox(height: 16),

          // Encrypted Callout
          Row(
            children: const [
              Icon(Icons.check_circle_outline, size: 16, color: AppColors.primary),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  "Your job details and media are encrypted and only shared with professionals you choose to interact with.",
                  style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
                ),
              ),
            ],
          ),

          const SizedBox(height: 28),

          // Bottom Buttons
          Row(
            children: [
              Expanded(
                child: CustomButton(
                  text: "Save Draft",
                  variant: ButtonVariant.outline,
                  onPressed: widget.onBack,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: CustomButton(
                  text: "Next Step",
                  trailingIcon: Icons.arrow_forward,
                  onPressed: widget.onNext,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _badgeTag(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: AppColors.surfaceMuted,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        text,
        style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w700, color: AppColors.textSecondary),
      ),
    );
  }

  Widget _requirementItem({
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool?> onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            height: 24,
            width: 24,
            child: Checkbox(
              value: value,
              activeColor: AppColors.primary,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
              onChanged: onChanged,
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                const SizedBox(height: 1),
                Text(subtitle, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
