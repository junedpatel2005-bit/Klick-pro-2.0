import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_typography.dart';
import '../../../providers/job_wizard_provider.dart';
import '../../../widgets/custom_button.dart';

class Step2LocationArea extends StatefulWidget {
  final VoidCallback onNext;
  final VoidCallback onBack;

  const Step2LocationArea({super.key, required this.onNext, required this.onBack});

  @override
  State<Step2LocationArea> createState() => _Step2LocationAreaState();
}

class _Step2LocationAreaState extends State<Step2LocationArea> {
  final _addressController = TextEditingController(text: "Downtown Heights, NY");

  @override
  void dispose() {
    _addressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final wizard = context.watch<JobWizardProvider>();

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
                  "STEP 2 OF 5",
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.primary),
                ),
              ),
              const Text(
                "Location & Area",
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
              ),
            ],
          ),

          const SizedBox(height: 18),

          Text("Where is the job?", style: AppTypography.headlineLarge),
          const SizedBox(height: 6),
          Text(
            "Set the specific location or provide a general area for the professional.",
            style: AppTypography.bodyMedium,
          ),

          const SizedBox(height: 20),

          // Search Address Field
          const Text("Search Address", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
          const SizedBox(height: 6),
          TextFormField(
            controller: _addressController,
            onChanged: (v) => wizard.updateLocation(address: v),
            decoration: const InputDecoration(
              hintText: "Enter street, city, or zip code",
              prefixIcon: Icon(Icons.search, size: 20, color: AppColors.textMuted),
            ),
          ),

          const SizedBox(height: 12),

          // "Use Current Location" button
          OutlinedButton.icon(
            onPressed: () {
              _addressController.text = "Downtown Heights, NY";
              wizard.updateLocation(address: "Downtown Heights, NY");
            },
            icon: const Icon(Icons.my_location, size: 16, color: AppColors.primary),
            label: const Text("Use Current Location", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.primary)),
            style: OutlinedButton.styleFrom(
              side: const BorderSide(color: AppColors.border),
              padding: const EdgeInsets.symmetric(vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),

          const SizedBox(height: 20),

          // Interactive Map Simulation (matching video with Pin and zoom controls)
          Container(
            height: 210,
            width: double.infinity,
            decoration: BoxDecoration(
              color: const Color(0xFFD4EAF7), // Map water/land styling
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.border),
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Stylized map illustration
                Positioned.fill(
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      decoration: const BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Color(0xFFE2F0D9), Color(0xFFC5E0B4), Color(0xFFD9E1F2)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                      ),
                    ),
                  ),
                ),
                // Center Map Pin
                Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(color: Colors.black.withOpacity(0.15), blurRadius: 6),
                        ],
                      ),
                      child: Text(
                        _addressController.text.isNotEmpty ? _addressController.text : "Downtown Heights, NY",
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.primary),
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Icon(Icons.location_on, size: 36, color: AppColors.primary),
                  ],
                ),
                // Zoom +/- Buttons
                Positioned(
                  bottom: 12,
                  right: 12,
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Column(
                      children: [
                        InkWell(
                          onTap: () {},
                          child: const Padding(
                            padding: EdgeInsets.all(6),
                            child: Icon(Icons.add, size: 16, color: AppColors.textPrimary),
                          ),
                        ),
                        const Divider(height: 1, color: AppColors.borderSubtle),
                        InkWell(
                          onTap: () {},
                          child: const Padding(
                            padding: EdgeInsets.all(6),
                            child: Icon(Icons.remove, size: 16, color: AppColors.textPrimary),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // SERVICE AREA RADIUS Slider from Video
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    "SERVICE AREA RADIUS",
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textMuted, letterSpacing: 0.8),
                  ),
                  SizedBox(height: 2),
                  Text("Allow providers within", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                ],
              ),
              RichText(
                text: TextSpan(
                  text: "${wizard.jobData.radiusMiles.toInt()} ",
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.primary),
                  children: const [
                    TextSpan(text: "miles", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 6),

          SliderTheme(
            data: SliderTheme.of(context).copyWith(
              activeTrackColor: AppColors.primary,
              inactiveTrackColor: AppColors.borderSubtle,
              thumbColor: AppColors.primary,
              trackHeight: 4,
            ),
            child: Slider(
              value: wizard.jobData.radiusMiles,
              min: 1,
              max: 50,
              onChanged: (v) => wizard.updateLocation(radius: v),
            ),
          ),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Text("1 mile", style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
              Text("50 miles", style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
            ],
          ),

          const SizedBox(height: 16),

          // Info Callout
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.surfaceMuted,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Icon(Icons.info_outline, size: 18, color: AppColors.textSecondary),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    "Setting a larger radius helps you find more qualified professionals, but may include travel fees for some providers.",
                    style: TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.3),
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
                  text: "Next Step",
                  onPressed: () {
                    wizard.updateLocation(address: _addressController.text);
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
}
