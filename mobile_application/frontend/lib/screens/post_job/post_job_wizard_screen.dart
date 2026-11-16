import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_typography.dart';
import '../../providers/job_wizard_provider.dart';
import 'steps/step1_basic_info.dart';
import 'steps/step2_location_area.dart';
import 'steps/step3_budget_timeline.dart';
import 'steps/step4_media_requirements.dart';
import 'steps/step5_review_post.dart';

class PostJobWizardScreen extends StatelessWidget {
  const PostJobWizardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final wizard = context.watch<JobWizardProvider>();
    final currentStep = wizard.currentStep;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          currentStep == 1
              ? "ProConnect"
              : currentStep == 3
                  ? "Post a Job"
                  : currentStep == 4
                      ? "Post a Job"
                      : "ProConnect",
          style: AppTypography.brandTitle.copyWith(fontSize: 20),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            if (currentStep > 1) {
              wizard.goToPreviousStep();
            } else {
              Navigator.pop(context);
            }
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              currentStep == 1
                  ? "Cancel\nPost"
                  : currentStep == 2
                      ? "Save & Exit"
                      : currentStep == 3 || currentStep == 4
                          ? "✕"
                          : "Save & Exit",
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: currentStep == 3 || currentStep == 4 ? 18 : 11,
                fontWeight: FontWeight.w700,
                color: AppColors.textSecondary,
                height: 1.1,
              ),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 250),
          child: _buildCurrentStep(context, currentStep, wizard),
        ),
      ),
    );
  }

  Widget _buildCurrentStep(BuildContext context, int step, JobWizardProvider wizard) {
    switch (step) {
      case 1:
        return Step1BasicInfo(
          onNext: () => wizard.goToNextStep(),
          onCancel: () => Navigator.pop(context),
        );
      case 2:
        return Step2LocationArea(
          onNext: () => wizard.goToNextStep(),
          onBack: () => wizard.goToPreviousStep(),
        );
      case 3:
        return Step3BudgetTimeline(
          onNext: () => wizard.goToNextStep(),
          onBack: () => wizard.goToPreviousStep(),
        );
      case 4:
        return Step4MediaRequirements(
          onNext: () => wizard.goToNextStep(),
          onBack: () => wizard.goToPreviousStep(),
        );
      case 5:
        return Step5ReviewPost(
          onBack: () => wizard.goToPreviousStep(),
          onFinish: () {
            _showSuccessDialog(context);
          },
        );
      default:
        return const SizedBox.shrink();
    }
  }

  void _showSuccessDialog(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                color: AppColors.onTrackBg,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check, size: 36, color: AppColors.onTrackGreen),
            ),
            const SizedBox(height: 16),
            const Text(
              "Job Posted Successfully!",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 8),
            const Text(
              "Your job is now live. Verified professionals in your area have been notified.",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(ctx); // Close dialog
                Navigator.pop(context); // Back to dashboard
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                minimumSize: const Size.fromHeight(44),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
              ),
              child: const Text("View in Dashboard", style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
            ),
          ],
        ),
      ),
    );
  }
}
