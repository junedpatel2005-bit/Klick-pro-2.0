import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'providers/auth_provider.dart';
import 'providers/dashboard_provider.dart';
import 'providers/search_provider.dart';
import 'providers/job_wizard_provider.dart';
import 'screens/onboarding/onboarding_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProConnectApp());
}

class ProConnectApp extends StatelessWidget {
  const ProConnectApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => DashboardProvider()),
        ChangeNotifierProvider(create: (_) => SearchProvider()),
        ChangeNotifierProvider(create: (_) => JobWizardProvider()),
      ],
      child: MaterialApp(
        title: 'ProConnect Mobile',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: const OnboardingScreen(),
      ),
    );
  }
}
