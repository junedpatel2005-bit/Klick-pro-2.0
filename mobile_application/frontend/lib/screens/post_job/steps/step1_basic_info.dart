import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_typography.dart';
import '../../../providers/job_wizard_provider.dart';
import '../../../widgets/custom_button.dart';

class Step1BasicInfo extends StatefulWidget {
  final VoidCallback onNext;
  final VoidCallback onCancel;

  const Step1BasicInfo({super.key, required this.onNext, required this.onCancel});

  @override
  State<Step1BasicInfo> createState() => _Step1BasicInfoState();
}

class _Step1BasicInfoState extends State<Step1BasicInfo> {
  late final TextEditingController _titleController;
  late final TextEditingController _descController;

  @override
  void initState() {
    super.initState();
    final data = context.read<JobWizardProvider>().jobData;
    _titleController = TextEditingController(text: data.title ?? "Modern Kitchen Renovation");
    _descController = TextEditingController(
      text: data.description ??
          "Installation of smart appliances, custom cabinetry, and quartz countertops in a 250 sq ft space.",
    );
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final wizard = context.watch<JobWizardProvider>();
    final categories = wizard.categories;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Step pill & Section
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
                  "Step 1 of 5",
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.primary),
                ),
              ),
              const Text(
                "Job Details",
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
              ),
            ],
          ),

          const SizedBox(height: 18),

          Text("Basic Information", style: AppTypography.headlineLarge),
          const SizedBox(height: 6),
          Text(
            "Let's start with the basics. Tell us about the professional service you need.",
            style: AppTypography.bodyMedium,
          ),

          const SizedBox(height: 24),

          // Category Dropdown
          const Text("Category", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                isExpanded: true,
                value: wizard.jobData.category ?? (categories.isNotEmpty ? categories.first.name : null),
                hint: const Text("Search categories...", style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
                icon: const Icon(Icons.keyboard_arrow_down, color: AppColors.textMuted),
                items: categories.map((c) {
                  return DropdownMenuItem<String>(
                    value: c.name,
                    child: Text(c.name, style: const TextStyle(fontSize: 13, color: AppColors.textPrimary)),
                  );
                }).toList(),
                onChanged: (v) {
                  if (v != null) wizard.updateBasicInfo(cat: v);
                },
              ),
            ),
          ),

          const SizedBox(height: 18),

          // Sub-Category Dropdown
          const Text("Sub-category", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                isExpanded: true,
                value: wizard.jobData.subcategory ?? "Kitchen Renovation",
                hint: const Text("Select sub-category", style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
                icon: const Icon(Icons.keyboard_arrow_down, color: AppColors.textMuted),
                items: ["Kitchen Renovation", "Bathroom Remodel", "Flooring", "Painting", "Custom Design"].map((s) {
                  return DropdownMenuItem<String>(
                    value: s,
                    child: Text(s, style: const TextStyle(fontSize: 13, color: AppColors.textPrimary)),
                  );
                }).toList(),
                onChanged: (v) {
                  if (v != null) wizard.updateBasicInfo(subcat: v);
                },
              ),
            ),
          ),

          const SizedBox(height: 18),

          // Job Title Input
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Text("Job Title", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
              Text("Max 80 characters", style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
            ],
          ),
          const SizedBox(height: 6),
          TextFormField(
            controller: _titleController,
            maxLength: 80,
            onChanged: (v) => wizard.updateBasicInfo(title: v),
            decoration: const InputDecoration(
              hintText: "e.g. Build a modern landing page",
              counterText: "",
            ),
          ),

          const SizedBox(height: 18),

          // Job Description Rich Area
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Text("Job Description", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
              Text("Minimum 50 words", style: TextStyle(fontSize: 11, color: AppColors.noticeText)),
            ],
          ),
          const SizedBox(height: 6),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              children: [
                TextFormField(
                  controller: _descController,
                  maxLines: 5,
                  onChanged: (v) => wizard.updateBasicInfo(desc: v),
                  decoration: const InputDecoration(
                    hintText: "Describe the project scope, deliverables, and any specific requirements or tools needed...",
                    border: InputBorder.none,
                    enabledBorder: InputBorder.none,
                    focusedBorder: InputBorder.none,
                    contentPadding: EdgeInsets.all(14),
                  ),
                ),
                const Divider(height: 1, color: AppColors.borderSubtle),
                // Rich Formatting Toolbar from video: B, I, List, Attachment
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  child: Row(
                    children: [
                      _formatIcon(Icons.format_bold),
                      _formatIcon(Icons.format_italic),
                      _formatIcon(Icons.format_list_bulleted),
                      _formatIcon(Icons.format_list_numbered),
                      _formatIcon(Icons.attach_file),
                      const Spacer(),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Pro Tip Callout (Blue)
          _infoCard(
            color: AppColors.primary,
            bgColor: AppColors.primaryContainer.withOpacity(0.4),
            icon: Icons.lightbulb_outline,
            title: "Pro Tip",
            description: "Detailed descriptions attract 3x more qualified experts. Include your timeline and key milestones.",
          ),

          const SizedBox(height: 12),

          // Verified Safety Callout (Peach)
          _infoCard(
            color: AppColors.noticeText,
            bgColor: AppColors.noticeBackground,
            icon: Icons.shield_outlined,
            title: "Verified Safety",
            description: "Your data is encrypted. We only share details with vetted professionals once you've posted.",
          ),

          const SizedBox(height: 28),

          // Navigation buttons
          Row(
            children: [
              Expanded(
                child: CustomButton(
                  text: "Dashboard",
                  leadingIcon: Icons.arrow_back,
                  variant: ButtonVariant.outline,
                  onPressed: widget.onCancel,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: CustomButton(
                  text: "Continue",
                  trailingIcon: Icons.arrow_forward,
                  onPressed: () {
                    wizard.updateBasicInfo(
                      title: _titleController.text,
                      desc: _descController.text,
                    );
                    widget.onNext();
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

  Widget _formatIcon(IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(right: 12),
      child: Icon(icon, size: 18, color: AppColors.textSecondary),
    );
  }

  Widget _infoCard({
    required Color color,
    required Color bgColor,
    required IconData icon,
    required String title,
    required String description,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: color),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: color)),
                const SizedBox(height: 2),
                Text(description, style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.3)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
