import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_typography.dart';
import '../../../providers/job_wizard_provider.dart';
import '../../../widgets/custom_button.dart';

class Step3BudgetTimeline extends StatefulWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const Step3BudgetTimeline({super.key, required this.onNext, required this.onBack});

  @override
  State<Step3BudgetTimeline> createState() => _Step3BudgetTimelineState();
}

class _Step3BudgetTimelineState extends State<Step3BudgetTimeline> {
  late final TextEditingController _budgetController;

  @override
  void initState() {
    super.initState();
    final data = context.read<JobWizardProvider>().jobData;
    _budgetController = TextEditingController(text: data.estimatedBudget?.toInt().toString() ?? "12000");
  }

  @override
  void dispose() {
    _budgetController.dispose();
    super.dispose();
  }

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
                  "Step 3 of 5",
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.primary),
                ),
              ),
              const Text(
                "BUDGET & TIMELINE",
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.primary, letterSpacing: 0.8),
              ),
            ],
          ),

          const SizedBox(height: 18),

          const Text("BUDGET TYPE", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textMuted, letterSpacing: 0.8)),
          const SizedBox(height: 10),

          // 3 Budget Type Options from Video
          _budgetTypeOption(
            type: "hourly",
            title: "Hourly Rate",
            subtitle: "Pay by the hour",
            icon: Icons.schedule,
            isSelected: job.budgetType == "hourly",
            onTap: () => wizard.updateBudget(type: "hourly"),
          ),
          const SizedBox(height: 8),
          _budgetTypeOption(
            type: "fixed",
            title: "Fixed Budget",
            subtitle: "Set a total price",
            icon: Icons.payments_outlined,
            isSelected: job.budgetType == "fixed",
            onTap: () => wizard.updateBudget(type: "fixed"),
          ),
          const SizedBox(height: 8),
          _budgetTypeOption(
            type: "negotiable",
            title: "Negotiable",
            subtitle: "Discuss with provider",
            icon: Icons.handshake_outlined,
            isSelected: job.budgetType == "negotiable",
            onTap: () => wizard.updateBudget(type: "negotiable"),
          ),

          const SizedBox(height: 20),

          // ESTIMATED BUDGET Input
          const Text("ESTIMATED BUDGET", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textMuted, letterSpacing: 0.8)),
          const SizedBox(height: 6),
          TextFormField(
            controller: _budgetController,
            keyboardType: TextInputType.number,
            onChanged: (v) => wizard.updateBudget(budget: double.tryParse(v) ?? 0),
            decoration: InputDecoration(
              prefixText: "\$ ",
              prefixStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary),
              suffixText: "USD",
              suffixStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted),
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            "Typical rates for similar jobs: \$25 - \$45 / hr",
            style: TextStyle(fontSize: 11, color: AppColors.textSecondary),
          ),

          const SizedBox(height: 20),

          // Date Pickers: START DATE & EXPECTED END
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("START DATE", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textMuted, letterSpacing: 0.8)),
                    const SizedBox(height: 6),
                    _dateBox(
                      value: job.startDate != null ? DateFormat('dd-MM-yy').format(job.startDate!) : "dd-mm-yy",
                      onTap: () async {
                        final picked = await showDatePicker(
                          context: context,
                          initialDate: DateTime.now(),
                          firstDate: DateTime.now(),
                          lastDate: DateTime.now().add(const Duration(days: 365)),
                        );
                        if (picked != null) wizard.updateBudget(start: picked);
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("EXPECTED END", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textMuted, letterSpacing: 0.8)),
                    const SizedBox(height: 6),
                    _dateBox(
                      value: job.expectedEndDate != null ? DateFormat('dd-MM-yy').format(job.expectedEndDate!) : "dd-mm-yy",
                      onTap: () async {
                        final picked = await showDatePicker(
                          context: context,
                          initialDate: DateTime.now().add(const Duration(days: 14)),
                          firstDate: DateTime.now(),
                          lastDate: DateTime.now().add(const Duration(days: 730)),
                        );
                        if (picked != null) wizard.updateBudget(end: picked);
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 20),

          // URGENCY LEVEL selector pills from Video
          const Text("URGENCY LEVEL", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textMuted, letterSpacing: 0.8)),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _urgencyChip("Immediate", "immediate", job.urgencyLevel, () => wizard.updateBudget(urgency: "immediate")),
              _urgencyChip("Within Week", "within_week", job.urgencyLevel, () => wizard.updateBudget(urgency: "within_week")),
              _urgencyChip("Within Month", "within_month", job.urgencyLevel, () => wizard.updateBudget(urgency: "within_month")),
              _urgencyChip("Flexible", "flexible", job.urgencyLevel, () => wizard.updateBudget(urgency: "flexible")),
            ],
          ),

          const SizedBox(height: 20),

          // Secure Payment Guarantee Callout
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.primaryContainer.withOpacity(0.4),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.primary.withOpacity(0.2)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Icon(Icons.verified_user_outlined, size: 20, color: AppColors.primary),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("Secure Payment Guarantee", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primary)),
                      SizedBox(height: 2),
                      Text(
                        "Your funds are protected by our Escrow system. Professionals are paid only after milestones are approved.",
                        style: TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.3),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 28),

          // Bottom Buttons
          Row(
            children: [
              Expanded(
                child: CustomButton(
                  text: "Back",
                  variant: ButtonVariant.outline,
                  onPressed: widget.onBack,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: CustomButton(
                  text: "Next: Requirements",
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

  Widget _budgetTypeOption({
    required String type,
    required String title,
    required String subtitle,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryContainer.withOpacity(0.3) : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: isSelected ? AppColors.primary : AppColors.surfaceMuted,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, size: 20, color: isSelected ? Colors.white : AppColors.primary),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                Text(subtitle, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary)),
              ],
            ),
            const Spacer(),
            if (isSelected)
              const Icon(Icons.check_circle, size: 20, color: AppColors.primary),
          ],
        ),
      ),
    );
  }

  Widget _dateBox({required String value, required VoidCallback onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(value, style: const TextStyle(fontSize: 13, color: AppColors.textPrimary)),
            const Icon(Icons.calendar_today_outlined, size: 16, color: AppColors.textMuted),
          ],
        ),
      ),
    );
  }

  Widget _urgencyChip(String label, String value, String current, VoidCallback onTap) {
    final isSelected = value == current;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: 1.2,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: isSelected ? Colors.white : AppColors.textPrimary,
          ),
        ),
      ),
    );
  }
}
