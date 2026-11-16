import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../search/professional_search_screen.dart';
import 'dashboard_screen.dart';

class MainNavigationShell extends StatefulWidget {
  const MainNavigationShell({super.key});

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final List<Widget> screens = [
      DashboardScreen(onNavigateToSearch: () => setState(() => _currentIndex = 1)),
      const ProfessionalSearchScreen(),
      _placeholderScreen("My Jobs", Icons.work_outline),
      _placeholderScreen("Messages", Icons.chat_bubble_outline),
      _placeholderScreen("My Profile", Icons.person_outline),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: const Border(top: BorderSide(color: AppColors.border, width: 1)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 10,
              offset: const Offset(0, -3),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.white,
          selectedItemColor: AppColors.primary,
          unselectedItemColor: AppColors.textMuted,
          selectedFontSize: 10,
          unselectedFontSize: 10,
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w700),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500),
          elevation: 0,
          items: [
            const BottomNavigationBarItem(
              icon: Icon(Icons.home_outlined),
              activeIcon: Icon(Icons.home),
              label: "HOME",
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.search),
              activeIcon: Icon(Icons.search, color: AppColors.primary),
              label: "SEARCH",
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.work_outline),
              activeIcon: Icon(Icons.work),
              label: "JOBS",
            ),
            BottomNavigationBarItem(
              icon: Stack(
                children: [
                  const Icon(Icons.chat_bubble_outline),
                  Positioned(
                    top: 0,
                    right: 0,
                    child: Container(
                      padding: const EdgeInsets.all(3),
                      decoration: const BoxDecoration(
                        color: AppColors.delayedRed,
                        shape: BoxShape.circle,
                      ),
                      child: const Text(
                        "3",
                        style: TextStyle(fontSize: 8, color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              ),
              activeIcon: const Icon(Icons.chat_bubble),
              label: "MESSAGES",
            ),
            const BottomNavigationBarItem(
              icon: Icon(Icons.person_outline),
              activeIcon: Icon(Icons.person),
              label: "PROFILE",
            ),
          ],
        ),
      ),
    );
  }

  Widget _placeholderScreen(String title, IconData icon) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: Text(title)),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 64, color: AppColors.textMuted),
            const SizedBox(height: 12),
            Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
            const SizedBox(height: 4),
            const Text("Connected to shared Klick-pro PostgreSQL Database", style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
          ],
        ),
      ),
    );
  }
}
