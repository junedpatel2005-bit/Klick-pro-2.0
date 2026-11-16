import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_typography.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/status_badge.dart';
import '../auth/login_screen.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
          child: Column(
            children: [
              const Spacer(),
              // Hero Card Illustration with Verified Badge
              Container(
                width: double.infinity,
                height: 280,
                decoration: BoxDecoration(
                  color: AppColors.surfaceMuted,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppColors.border, width: 1.2),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.04),
                      blurRadius: 18,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    // Modern Office Meeting Graphics
                    Padding(
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.handshake_rounded,
                            size: 96,
                            color: AppColors.primary.withOpacity(0.85),
                          ),
                          const SizedBox(height: 16),
                          Container(
                            height: 6,
                            width: 60,
                            decoration: BoxDecoration(
                              color: AppColors.primary.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(3),
                            ),
                          ),
                        ],
                      ),
                    ),
                    // "Verified Professionals" top badge
                    const Positioned(
                      top: 16,
                      child: StatusBadge(
                        label: "Verified Professionals",
                        type: BadgeType.verified,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 36),

              // Title
              Text(
                "Unlock Premium Service\nMarketplace Access",
                textAlign: TextAlign.center,
                style: AppTypography.headlineLarge.copyWith(height: 1.25),
              ),

              const SizedBox(height: 12),

              // Subtitle
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Text(
                  "Connect with verified experts and top-tier clients in our high-trust professional ecosystem.",
                  textAlign: TextAlign.center,
                  style: AppTypography.bodyMedium,
                ),
              ),

              const Spacer(),

              // Primary CTA: Create Account ->
              CustomButton(
                text: "Create Account",
                trailingIcon: Icons.arrow_forward,
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const LoginScreen(isSignUp: true)),
                  );
                },
              ),

              const SizedBox(height: 12),

              // Secondary CTA: Login
              CustomButton(
                text: "Login",
                variant: ButtonVariant.secondary,
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const LoginScreen(isSignUp: false)),
                  );
                },
              ),

              const SizedBox(height: 24),

              // Footer Links
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _footerLink("How It Works"),
                  _divider(),
                  _footerLink("Trust & Safety"),
                  _divider(),
                  _footerLink("Privacy"),
                ],
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
    );
  }

  Widget _footerLink(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 11,
        color: AppColors.textMuted,
        fontWeight: FontWeight.w500,
      ),
    );
  }

  Widget _divider() {
    return const Padding(
      padding: EdgeInsets.symmetric(horizontal: 10),
      child: Text("•", style: TextStyle(color: AppColors.border, fontSize: 12)),
    );
  }
}
