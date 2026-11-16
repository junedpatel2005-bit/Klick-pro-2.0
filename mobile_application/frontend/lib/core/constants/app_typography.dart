import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTypography {
  static TextStyle get brandTitle => GoogleFonts.plusJakartaSans(
    fontSize: 24,
    fontWeight: FontWeight.w800,
    color: AppColors.primary,
    letterSpacing: -0.5,
  );

  static TextStyle get headlineLarge => GoogleFonts.plusJakartaSans(
    fontSize: 22,
    fontWeight: FontWeight.w700,
    color: AppColors.textPrimary,
    letterSpacing: -0.4,
  );

  static TextStyle get headlineMedium => GoogleFonts.plusJakartaSans(
    fontSize: 18,
    fontWeight: FontWeight.w700,
    color: AppColors.textPrimary,
  );

  static TextStyle get titleMedium => GoogleFonts.plusJakartaSans(
    fontSize: 15,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
  );

  static TextStyle get bodyMedium => GoogleFonts.plusJakartaSans(
    fontSize: 13,
    fontWeight: FontWeight.w400,
    color: AppColors.textSecondary,
    height: 1.4,
  );

  static TextStyle get bodySmall => GoogleFonts.plusJakartaSans(
    fontSize: 11,
    fontWeight: FontWeight.w500,
    color: AppColors.textMuted,
  );

  static TextStyle get buttonText => GoogleFonts.plusJakartaSans(
    fontSize: 15,
    fontWeight: FontWeight.w600,
    color: Colors.white,
    letterSpacing: 0.1,
  );
}
