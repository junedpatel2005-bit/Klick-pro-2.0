import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_typography.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_text_field.dart';
import '../home/main_navigation_shell.dart';

class LoginScreen extends StatefulWidget {
  final bool isSignUp;
  const LoginScreen({super.key, this.isSignUp = false});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController(text: "name@company.com");
  final _passwordController = TextEditingController(text: "••••••••");
  bool _obscurePassword = true;
  bool _rememberDevice = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleSignIn() async {
    final auth = context.read<AuthProvider>();
    final success = await auth.login(
      _emailController.text.trim(),
      _passwordController.text,
    );

    if (mounted && success) {
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const MainNavigationShell()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text("ProConnect", style: AppTypography.brandTitle),
        centerTitle: false,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 12),
              Text(
                widget.isSignUp ? "Create Your Account" : "Welcome Back",
                style: AppTypography.headlineLarge,
              ),
              const SizedBox(height: 6),
              Text(
                widget.isSignUp
                    ? "Join verified experts and hire top tier professionals."
                    : "Log in to manage your professional projects.",
                style: AppTypography.bodyMedium,
              ),
              const SizedBox(height: 28),

              // Social Google Button
              Container(
                height: 48,
                width: double.infinity,
                decoration: BoxDecoration(
                  border: Border.all(color: AppColors.border),
                  borderRadius: BorderRadius.circular(12),
                  color: Colors.white,
                ),
                child: InkWell(
                  onTap: _handleSignIn,
                  borderRadius: BorderRadius.circular(12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.borderSubtle),
                        ),
                        child: const Icon(Icons.g_mobiledata, size: 24, color: AppColors.primary),
                      ),
                      const SizedBox(width: 10),
                      const Text(
                        "Continue with Google",
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // OR divider
              Row(
                children: [
                  const Expanded(child: Divider(color: AppColors.border)),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    child: Text(
                      "OR LOGIN WITH EMAIL",
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textMuted,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                  const Expanded(child: Divider(color: AppColors.border)),
                ],
              ),

              const SizedBox(height: 24),

              // Email input
              CustomTextField(
                label: "Email or Phone Number",
                hintText: "name@company.com",
                controller: _emailController,
                suffixIcon: const Icon(Icons.mail_outline, size: 18, color: AppColors.textMuted),
              ),

              const SizedBox(height: 18),

              // Password input
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Password",
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary),
                      ),
                      GestureDetector(
                        onTap: () {},
                        child: const Text(
                          "Forgot Password?",
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.primary),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  TextFormField(
                    controller: _passwordController,
                    obscureText: _obscurePassword,
                    decoration: InputDecoration(
                      hintText: "••••••••",
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                          size: 18,
                          color: AppColors.textMuted,
                        ),
                        onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 14),

              // Remember device checkbox
              Row(
                children: [
                  SizedBox(
                    height: 24,
                    width: 24,
                    child: Checkbox(
                      value: _rememberDevice,
                      activeColor: AppColors.primary,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
                      onChanged: (v) => setState(() => _rememberDevice = v ?? true),
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    "Remember this device",
                    style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
                  ),
                ],
              ),

              const SizedBox(height: 28),

              // Primary Action: Sign In ->
              CustomButton(
                text: "Sign In",
                trailingIcon: Icons.arrow_forward,
                isLoading: auth.isLoading,
                onPressed: _handleSignIn,
              ),

              const SizedBox(height: 24),

              // Sign up prompt
              Center(
                child: GestureDetector(
                  onTap: () {
                    // Toggle signup
                  },
                  child: RichText(
                    text: const TextSpan(
                      text: "Don't have an account? ",
                      style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
                      children: [
                        TextSpan(
                          text: "Sign Up for Free",
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: AppColors.primary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
