import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {Shield, Zap, Lock} from 'lucide-react-native';
import {useAuthStore} from '../store/useAuthStore';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const FeatureItem: React.FC<{icon: React.ReactNode; title: string; description: string; delay: number}> = ({
  icon,
  title,
  description,
  delay,
}) => (
  <Animated.View entering={FadeInDown.delay(delay).duration(600)} style={styles.featureItem}>
    <View style={styles.iconContainer}>{icon}</View>
    <View style={styles.featureTextContainer}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </Animated.View>
);

const OnboardingScreen: React.FC = () => {
  const {t} = useTranslation();
  const {completeOnboarding} = useAuthStore();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <View style={styles.content}>
        <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
          <Text style={styles.title}>{t('welcome_to')}</Text>
          <Text style={styles.brandName}>PureDNS</Text>
        </Animated.View>

        <View style={styles.featuresList}>
          <FeatureItem
            delay={200}
            icon={<Shield size={28} color="#4FACFE" />}
            title={t('feature_1_title')}
            description={t('feature_1_desc')}
          />
          <FeatureItem
            delay={400}
            icon={<Zap size={28} color="#43E97B" />}
            title={t('feature_2_title')}
            description={t('feature_2_desc')}
          />
          <FeatureItem
            delay={600}
            icon={<Lock size={28} color="#FA709A" />}
            title={t('feature_3_title')}
            description={t('feature_3_desc')}
          />
        </View>
      </View>

      <Animated.View entering={FadeInDown.delay(800).duration(600)} style={[styles.footer, {paddingBottom: insets.bottom + 20}]}>
        <TouchableOpacity style={styles.button} onPress={completeOnboarding} activeOpacity={0.8}>
          <Text style={styles.buttonText}>{t('get_started')}</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    color: '#888',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  brandName: {
    color: '#E0E0E0',
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
  },
  featuresList: {
    gap: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  featureDescription: {
    color: '#888',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
    paddingTop: 20,
  },
  button: {
    backgroundColor: '#4FACFE',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4FACFE',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default OnboardingScreen;
