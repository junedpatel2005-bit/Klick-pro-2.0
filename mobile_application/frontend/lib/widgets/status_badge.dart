import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';

enum BadgeType { verified, onTrack, delayed, rating }

class StatusBadge extends StatelessWidget {
  final String label;
  final BadgeType type;
  final IconData? icon;

  const StatusBadge({
    super.key,
    required this.label,
    required this.type,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    Color bg;
    Color fg;
    IconData? defaultIcon;

    switch (type) {
      case BadgeType.verified:
        bg = AppColors.verifiedBadgeBg;
        fg = AppColors.verifiedBlue;
        defaultIcon = Icons.verified;
        break;
      case BadgeType.onTrack:
        bg = AppColors.onTrackBg;
        fg = AppColors.onTrackGreen;
        break;
      case BadgeType.delayed:
        bg = AppColors.delayedBg;
        fg = AppColors.delayedRed;
        break;
      case BadgeType.rating:
        bg = AppColors.starBg;
        fg = AppColors.starGold;
        defaultIcon = Icons.star;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null || defaultIcon != null) ...[
            Icon(icon ?? defaultIcon, size: 12, color: fg),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w700,
              color: fg,
              letterSpacing: 0.2,
            ),
          ),
        ],
      ),
    );
  }
}
