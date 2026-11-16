import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../core/constants/app_colors.dart';
import '../models/professional_model.dart';
import 'status_badge.dart';

class ProfessionalCard extends StatelessWidget {
  final ProfessionalModel pro;
  final VoidCallback? onHire;
  final bool compact;

  const ProfessionalCard({
    super.key,
    required this.pro,
    this.onHire,
    this.compact = false,
  });

  @override
  Widget build(BuildContext context) {
    if (compact) {
      return Container(
        width: 175,
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: CachedNetworkImage(
                    imageUrl: pro.avatarUrl,
                    height: 90,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Container(color: AppColors.surfaceMuted),
                    errorWidget: (context, url, error) => Container(
                      height: 90,
                      color: AppColors.surfaceMuted,
                      child: const Icon(Icons.person, color: AppColors.textSecondary),
                    ),
                  ),
                ),
                if (pro.isVerified)
                  const Positioned(
                    top: 6,
                    right: 6,
                    child: StatusBadge(label: "Verified", type: BadgeType.verified),
                  ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              pro.name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
            ),
            Text(
              pro.title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
            ),
            const Spacer(),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("STARTING AT", style: TextStyle(fontSize: 8, fontWeight: FontWeight.w700, color: AppColors.textMuted)),
                    Text("\$${pro.hourlyRate.toInt()}/hr", style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.primary)),
                  ],
                ),
                Container(
                  height: 32,
                  width: 32,
                  decoration: BoxDecoration(
                    color: AppColors.surfaceMuted,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.arrow_forward, size: 16, color: AppColors.primary),
                ),
              ],
            ),
          ],
        ),
      );
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
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
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Stack(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: CachedNetworkImage(
                      imageUrl: pro.avatarUrl,
                      height: 52,
                      width: 52,
                      fit: BoxFit.cover,
                      errorWidget: (_, __, ___) => Container(
                        height: 52,
                        width: 52,
                        color: AppColors.surfaceMuted,
                        child: const Icon(Icons.person, color: AppColors.textSecondary),
                      ),
                    ),
                  ),
                  if (pro.isVerified)
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: Container(
                        decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
                        padding: const EdgeInsets.all(1.5),
                        child: const Icon(Icons.verified, size: 14, color: AppColors.verifiedBlue),
                      ),
                    ),
                ],
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            pro.name,
                            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                          ),
                        ),
                        Row(
                          children: [
                            const Icon(Icons.star, size: 14, color: AppColors.starGold),
                            const SizedBox(width: 3),
                            Text(
                              pro.rating,
                              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                            ),
                            Text(
                              " (${pro.reviewsCount} reviews)",
                              style: const TextStyle(fontSize: 10, color: AppColors.textMuted),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      pro.title,
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: AppColors.textSecondary),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Skills chips
          Wrap(
            spacing: 6,
            runSpacing: 4,
            children: pro.skills.map((skill) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.surfaceMuted,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  skill,
                  style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 10),
          Text(
            pro.bio,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.3),
          ),
          const SizedBox(height: 14),
          const Divider(height: 1, color: AppColors.borderSubtle),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("Starting at", style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                  Text(
                    "\$${pro.hourlyRate.toInt()}/hr",
                    style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: AppColors.primary),
                  ),
                ],
              ),
              ElevatedButton(
                onPressed: onHire,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  elevation: 0,
                ),
                child: const Text("Hire", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
