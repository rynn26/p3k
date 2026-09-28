import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabase';
import { UserProfile, RebaAssessmentRecord, NbmAssessmentRecord } from './types';
import { HeaderBanner } from './components/HeaderBanner';
import { BottomNav } from './components/BottomNav';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { WorkerProfileSetupScreen } from './screens/WorkerProfileSetupScreen';
import { HealthRecordSetupScreen } from './screens/HealthRecordSetupScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ErgonomicsHubScreen } from './screens/ErgonomicsHubScreen';
import { RebaAssessmentScreen } from './screens/RebaAssessmentScreen';
import { NbmAssessmentScreen } from './screens/NbmAssessmentScreen';
import { AssessmentHistoryScreen } from './screens/AssessmentHistoryScreen';
import { AssessmentReportsScreen } from './screens/AssessmentReportsScreen';
import { WorkerProfileScreen } from './screens/WorkerProfileScreen';
import { ShieldAlert } from 'lucide-react';

export const App: React.FC = () => {
  const [lang, setLang] = useState<'ID' | 'ENG'>('ID');
  const [authStatus, setAuthStatus] = useState<
    'CHECKING' | 'UNAUTHENTICATED' | 'ONBOARDING_PROFILE' | 'ONBOARDING_HEALTH' | 'AUTHENTICATED'
  >('CHECKING');

  const [currentView, setCurrentView] = useState<
    'MAIN' | 'REGISTER' | 'ERGONOMICS_HUB' | 'REBA_WIZARD' | 'NBM_SURVEY' | 'EDIT_PROFILE' | 'EDIT_HEALTH'
  >('MAIN');

  const [activeTab, setActiveTab] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [rebaRecords, setRebaRecords] = useState<RebaAssessmentRecord[]>([]);
  const [nbmRecords, setNbmRecords] = useState<NbmAssessmentRecord[]>([]);

  useEffect(() => {
    checkSession();
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ID' ? 'ENG' : 'ID'));
  };

  const checkSession = async () => {
    setAuthStatus('CHECKING');
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentAuthUser = sessionData?.session?.user;

      if (!currentAuthUser) {
        setAuthStatus('UNAUTHENTICATED');
        return;
      }

      setUserId(currentAuthUser.id);
      await loadUserDataAndAssessments(currentAuthUser.id);
    } catch (err) {
      console.error('Session check error:', err);
      setAuthStatus('UNAUTHENTICATED');
    }
  };

  const loadUserDataAndAssessments = async (uid: string) => {
    try {
      // 1. Fetch user profile
      const { data: profData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .maybeSingle();

      setProfile(profData || null);

      // Check onboarding Stage 2: Profile complete
      const isProfileComplete = !!(profData && profData.full_name && profData.company_name);
      if (!isProfileComplete) {
        setAuthStatus('ONBOARDING_PROFILE');
        return;
      }

      // Check onboarding Stage 3: Health record complete
      const { data: healthData } = await supabase
        .from('health_records')
        .select('weight_kg, height_cm')
        .eq('user_id', uid)
        .maybeSingle();

      const isHealthComplete = !!(healthData && healthData.weight_kg && healthData.height_cm);
      if (!isHealthComplete) {
        setAuthStatus('ONBOARDING_HEALTH');
        return;
      }

      // Fetch user's REBA records
      const { data: rebaData } = await supabase
        .from('reba_assessments')
        .select('*')
        .eq('user_id', uid)
        .order('assessed_at', { ascending: false });

      if (rebaData) setRebaRecords(rebaData);

      // Fetch user's NBM records
      const { data: nbmData } = await supabase
        .from('nbm_assessments')
        .select('*')
        .eq('user_id', uid)
        .order('assessed_at', { ascending: false });

      if (nbmData) setNbmRecords(nbmData);

      setAuthStatus('AUTHENTICATED');
    } catch (err) {
      console.error('Error loading user data:', err);
      setAuthStatus('AUTHENTICATED');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setProfile(null);
    setRebaRecords([]);
    setNbmRecords([]);
    setAuthStatus('UNAUTHENTICATED');
    setCurrentView('MAIN');
    setActiveTab(0);
  };

  const handleRefreshRecords = async () => {
    if (userId) {
      const { data: rebaData } = await supabase
        .from('reba_assessments')
        .select('*')
        .eq('user_id', userId)
        .order('assessed_at', { ascending: false });
      if (rebaData) setRebaRecords(rebaData);

      const { data: nbmData } = await supabase
        .from('nbm_assessments')
        .select('*')
        .eq('user_id', userId)
        .order('assessed_at', { ascending: false });
      if (nbmData) setNbmRecords(nbmData);
    }
  };

  // ==================== RENDER STATES ====================

  // 1. Loading splash screen (matches Flutter AuthGate splash)
  if (authStatus === 'CHECKING') {
    return (
      <div className="app-viewport" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', padding: 24 }}>
          <div
            style={{
              width: 80,
              height: 80,
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              border: '1.5px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
            }}
          >
            <img
              src="/images/logo.png"
              alt="HERU"
              style={{ width: '80%', height: '80%', objectFit: 'contain' }}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', maxWidth: 280, margin: '0 auto 16px', lineHeight: 1.3 }}>
            Health Environment Risk &amp; Safety Utilization
          </h2>
          <div style={{ color: '#0D5BD7', fontSize: 13, fontWeight: 700 }}>
            Memverifikasi sesi pengguna...
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated -> Login / Register
  if (authStatus === 'UNAUTHENTICATED') {
    return (
      <div className="app-viewport">
        {currentView === 'REGISTER' ? (
          <RegisterScreen
            onBackToLogin={() => setCurrentView('MAIN')}
            lang={lang}
          />
        ) : (
          <LoginScreen
            onLoginSuccess={(uid) => {
              setUserId(uid);
              loadUserDataAndAssessments(uid);
            }}
            onNavigateToRegister={() => setCurrentView('REGISTER')}
            lang={lang}
            onToggleLang={toggleLanguage}
          />
        )}
      </div>
    );
  }

  // 3. Onboarding Profile Stage
  if (authStatus === 'ONBOARDING_PROFILE' && userId) {
    return (
      <div className="app-viewport">
        <WorkerProfileSetupScreen
          userId={userId}
          isInitialSetup={true}
          onComplete={() => setAuthStatus('ONBOARDING_HEALTH')}
          lang={lang}
        />
      </div>
    );
  }

  // 4. Onboarding Health Stage
  if (authStatus === 'ONBOARDING_HEALTH' && userId) {
    return (
      <div className="app-viewport">
        <HealthRecordSetupScreen
          userId={userId}
          isInitialSetup={true}
          onComplete={() => {
            setAuthStatus('AUTHENTICATED');
            loadUserDataAndAssessments(userId);
          }}
          lang={lang}
        />
      </div>
    );
  }

  // 5. Authenticated App Flow
  return (
    <div className="app-viewport">
      {/* If subviews are opened */}
      {currentView === 'ERGONOMICS_HUB' && (
        <ErgonomicsHubScreen
          onBack={() => setCurrentView('MAIN')}
          onStartReba={() => setCurrentView('REBA_WIZARD')}
          onStartNbm={() => setCurrentView('NBM_SURVEY')}
          lang={lang}
        />
      )}

      {currentView === 'REBA_WIZARD' && userId && (
        <RebaAssessmentScreen
          userId={userId}
          onBack={() => setCurrentView('ERGONOMICS_HUB')}
          onSaved={() => {
            handleRefreshRecords();
            setCurrentView('MAIN');
            setActiveTab(1); // open history tab
          }}
          lang={lang}
        />
      )}

      {currentView === 'NBM_SURVEY' && userId && (
        <NbmAssessmentScreen
          userId={userId}
          onBack={() => setCurrentView('ERGONOMICS_HUB')}
          onSaved={() => {
            handleRefreshRecords();
            setCurrentView('MAIN');
            setActiveTab(1); // open history tab
          }}
          lang={lang}
        />
      )}

      {currentView === 'EDIT_PROFILE' && userId && (
        <WorkerProfileSetupScreen
          userId={userId}
          isInitialSetup={false}
          onComplete={() => {
            loadUserDataAndAssessments(userId);
            setCurrentView('MAIN');
          }}
          onBack={() => setCurrentView('MAIN')}
          lang={lang}
        />
      )}

      {currentView === 'EDIT_HEALTH' && userId && (
        <HealthRecordSetupScreen
          userId={userId}
          isInitialSetup={false}
          onComplete={() => setCurrentView('MAIN')}
          onBack={() => setCurrentView('MAIN')}
          lang={lang}
        />
      )}

      {/* Main Tabs View (Sama persis dengan IndexedStack di Flutter MainNavigationScreen) */}
      {currentView === 'MAIN' && (
        <>
          {/* Active Tab Screen */}
          {activeTab === 0 && (
            <DashboardScreen
              profile={profile}
              onOpenErgonomics={() => setCurrentView('ERGONOMICS_HUB')}
              onOpenHistory={() => setActiveTab(1)}
              onNavigateToProfile={() => setActiveTab(3)}
              onLogout={handleLogout}
              rebaRecords={rebaRecords}
              nbmRecords={nbmRecords}
              lang={lang}
              onToggleLang={toggleLanguage}
            />
          )}

          {activeTab === 1 && (
            <AssessmentHistoryScreen
              rebaRecords={rebaRecords}
              nbmRecords={nbmRecords}
              onStartNew={() => setCurrentView('ERGONOMICS_HUB')}
              lang={lang}
            />
          )}

          {activeTab === 2 && (
            <AssessmentReportsScreen
              rebaRecords={rebaRecords}
              nbmRecords={nbmRecords}
              lang={lang}
            />
          )}

          {activeTab === 3 && userId && (
            <WorkerProfileScreen
              userId={userId}
              profile={profile}
              onEditProfile={() => setCurrentView('EDIT_PROFILE')}
              onOpenHealthRecord={() => setCurrentView('EDIT_HEALTH')}
              onLogout={handleLogout}
              lang={lang}
              onToggleLang={toggleLanguage}
            />
          )}

          {/* Bottom Navigation */}
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} lang={lang} />
        </>
      )}
    </div>
  );
};

export default App;
