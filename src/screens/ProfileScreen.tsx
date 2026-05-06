import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  User,
  Settings,
  ShieldCheck,
  HelpCircle,
  LogOut,
  Moon,
  Globe,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import {useAuthStore} from '../store/useAuthStore';
import {useTranslation} from 'react-i18next';
import {changeLanguage} from '../i18n';

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress: () => void;
  destructive?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  label,
  value,
  onPress,
  destructive,
}) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    activeOpacity={0.7}>
    <View
      style={[
        styles.settingIcon,
        destructive && {backgroundColor: '#FF444422'},
      ]}>
      {icon}
    </View>
    <View style={styles.settingLabelContainer}>
      <Text style={[styles.settingLabel, destructive && {color: '#FF4444'}]}>
        {label}
      </Text>
    </View>
    {value ? <Text style={styles.settingValue}>{value}</Text> : null}
  </TouchableOpacity>
);

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({question, answer}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.faqItemContainer}>
      <TouchableOpacity
        style={styles.faqQuestion}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}>
        <Text style={styles.faqQuestionText}>{question}</Text>
        {expanded ? (
          <ChevronUp size={20} color="#888" />
        ) : (
          <ChevronDown size={20} color="#888" />
        )}
      </TouchableOpacity>
      {expanded && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

const ProfileScreen: React.FC = () => {
  const {t, i18n} = useTranslation();
  const {session, signOut, deleteAccount} = useAuthStore();
  const email = session?.user?.email || t('unknown_user');

  const [theme, setTheme] = useState(t('system'));
  const languageMap: Record<string, string> = {
    en: t('english'),
    de: t('german')
  };
  const [language, setLanguage] = useState(languageMap[i18n.language] || t('english'));

  const handleSignOut = () => {
    Alert.alert(t('logout'), t('really_logout'), [
      {text: t('cancel'), style: 'cancel'},
      {text: t('logout'), style: 'destructive', onPress: signOut},
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('really_delete'),
      t('delete_warning'),
      [
        {text: t('cancel'), style: 'cancel'},
        {
          text: t('delete_account'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              Alert.alert(t('success'), t('account_deleted'));
            } catch (error: any) {
              Alert.alert(t('error'), error.message);
            }
          },
        },
      ]
    );
  };

  const handleThemePress = () => {
    Alert.alert(t('appearance'), '', [
      {text: t('system'), onPress: () => setTheme(t('system'))},
      {text: t('light'), onPress: () => setTheme(t('light'))},
      {text: t('dark'), onPress: () => setTheme(t('dark'))},
      {text: t('cancel'), style: 'cancel'},
    ]);
  };

  const handleLanguagePress = () => {
    Alert.alert(t('language'), '', [
      {text: t('german'), onPress: () => {
        setLanguage(t('german'));
        changeLanguage('de');
      }},
      {text: t('english'), onPress: () => {
        setLanguage(t('english'));
        changeLanguage('en');
      }},
      {text: t('cancel'), style: 'cancel'},
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{t('profile')}</Text>

      {/* User Info Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <User size={32} color="#4FACFE" />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.emailText}>{email}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Free Plan</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('general_settings')}</Text>
        <View style={styles.card}>
          <SettingItem
            icon={<Moon size={20} color="#E0E0E0" />}
            label={t('appearance')}
            value={theme}
            onPress={handleThemePress}
          />
          <View style={styles.divider} />
          <SettingItem
            icon={<Globe size={20} color="#E0E0E0" />}
            label={t('language')}
            value={language}
            onPress={handleLanguagePress}
          />
          <View style={styles.divider} />
          <SettingItem
            icon={<ShieldCheck size={20} color="#43E97B" />}
            label={t('manage_subscription')}
            onPress={() => {
              Alert.alert('Info', t('subscription_soon'));
            }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('faq_and_help')}</Text>
        <View style={styles.card}>
          <FaqItem
            question={t('faq_1_q')}
            answer={t('faq_1_a')}
          />
          <View style={styles.divider} />
          <FaqItem
            question={t('faq_2_q')}
            answer={t('faq_2_a')}
          />
          <View style={styles.divider} />
          <FaqItem
            question={t('faq_3_q')}
            answer={t('faq_3_a')}
          />
        </View>
      </View>

      <View style={[styles.section, {marginTop: 16}]}>
        <Text style={styles.sectionTitle}>{t('account')}</Text>
        <View style={styles.card}>
          <SettingItem
            icon={<LogOut size={20} color="#FF9500" />}
            label={t('logout')}
            onPress={handleSignOut}
          />
          <View style={styles.divider} />
          <SettingItem
            icon={<Trash2 size={20} color="#FF4444" />}
            label={t('delete_account')}
            onPress={handleDeleteAccount}
            destructive
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 24,
  },
  title: {
    color: '#E0E0E0',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1C1C1E',
    gap: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4FACFE15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4FACFE33',
  },
  userInfo: {
    flex: 1,
    gap: 6,
  },
  emailText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#222',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#AAA',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: '#555',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: '#0D0D0D',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1C1C1E',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabelContainer: {
    flex: 1,
  },
  settingLabel: {
    color: '#E0E0E0',
    fontSize: 16,
    fontWeight: '600',
  },
  settingValue: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#1C1C1E',
    marginLeft: 68, // Aligns with text content instead of icon edge
  },
  faqItemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  faqQuestionText: {
    color: '#E0E0E0',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    paddingRight: 16,
  },
  faqAnswer: {
    marginTop: 8,
    paddingRight: 16,
  },
  faqAnswerText: {
    color: '#888',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ProfileScreen;
