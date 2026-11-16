import 'package:flutter/material.dart';
import '../core/constants/app_colors.dart';

enum ButtonVariant { primary, secondary, outline }

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final ButtonVariant variant;
  final IconData? trailingIcon;
  final IconData? leadingIcon;
  final bool isLoading;
  final double height;

  const CustomButton({
    super.key,
    required this.text,
    this.onPressed,
    this.variant = ButtonVariant.primary,
    this.trailingIcon,
    this.leadingIcon,
    this.isLoading = false,
    this.height = 48,
  });

  @override
  Widget build(BuildContext context) {
    if (variant == ButtonVariant.outline || variant == ButtonVariant.secondary) {
      return SizedBox(
        height: height,
        width: double.infinity,
        child: OutlinedButton(
          onPressed: isLoading ? null : onPressed,
          style: OutlinedButton.styleFrom(
            backgroundColor: variant == ButtonVariant.secondary ? AppColors.surfaceMuted : Colors.transparent,
            side: const BorderSide(color: AppColors.border, width: 1.2),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
          ),
          child: _buildChild(AppColors.primary),
        ),
      );
    }

    return SizedBox(
      height: height,
      width: double.infinity,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
          elevation: 0,
        ),
        child: _buildChild(Colors.white),
      ),
    );
  }

  Widget _buildChild(Color textColor) {
    if (isLoading) {
      return SizedBox(
        height: 20,
        width: 20,
        child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation<Color>(textColor)),
      );
    }

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (leadingIcon != null) ...[
          Icon(leadingIcon, size: 18, color: textColor),
          const SizedBox(width: 8),
        ],
        Text(
          text,
          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: textColor),
        ),
        if (trailingIcon != null) ...[
          const SizedBox(width: 8),
          Icon(trailingIcon, size: 18, color: textColor),
        ],
      ],
    );
  }
}
