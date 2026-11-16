import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';

class MetricCard extends StatelessWidget {
  final String count;
  final String label;
  final IconData icon;
  final bool isPrimary;

  const MetricCard({
    super.key,
    required this.count,
    required this.label,
    required this.icon,
    this.isPrimary = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isPrimary ? AppColors.primary : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isPrimary ? AppColors.primary : AppColors.border,
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                icon,
                size: 20,
                color: isPrimary ? Colors.white70 : AppColors.primary,
              ),
              const Spacer(),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            count,
            style: TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w800,
              color: isPrimary ? Colors.white : AppColors.textPrimary,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: isPrimary ? Colors.white.withOpacity(0.85) : AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}
