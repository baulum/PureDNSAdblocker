import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Shield, Users, Lock, Globe} from 'lucide-react-native';
import {DnsMode, DNS_MODES, DnsModeConfig} from '../constants/dnsModes';

interface ModePickerProps {
  currentMode: DnsMode;
  onSelect: (mode: DnsMode) => void;
}

const ModeIcon: React.FC<{icon: string; color: string; size: number}> = ({
  icon,
  color,
  size,
}) => {
  const props = {size, color, strokeWidth: 2};
  switch (icon) {
    case 'shield':
      return <Shield {...props} />;
    case 'family':
      return <Users {...props} />;
    case 'lock':
      return <Lock {...props} />;
    case 'globe':
    default:
      return <Globe {...props} />;
  }
};

const ModeCard: React.FC<{
  config: DnsModeConfig;
  isSelected: boolean;
  onPress: () => void;
}> = ({config, isSelected, onPress}) => {
  const {label, subtitle, accentColor, icon} = config;
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && {
          borderColor: accentColor,
          backgroundColor: accentColor + '14',
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.cardTop}>
        <View
          style={[
            styles.iconBadge,
            {backgroundColor: isSelected ? accentColor + '22' : '#1C1C1E'},
          ]}>
          <ModeIcon
            icon={icon}
            color={isSelected ? accentColor : '#555'}
            size={18}
          />
        </View>
        {isSelected && (
          <View style={[styles.checkDot, {backgroundColor: accentColor}]} />
        )}
      </View>
      <Text style={[styles.cardLabel, isSelected && {color: accentColor}]}>
        {label}
      </Text>
      <Text style={styles.cardSubtitle} numberOfLines={2}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
};

const ModePicker: React.FC<ModePickerProps> = ({currentMode, onSelect}) => {
  const pairs = [DNS_MODES.slice(0, 2), DNS_MODES.slice(2, 4)];

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionLabel}>MODUS WÄHLEN</Text>
      {pairs.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map(config => (
            <ModeCard
              key={config.mode}
              config={config}
              isSelected={currentMode === config.mode}
              onPress={() => onSelect(config.mode)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionLabel: {
    color: '#444',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#1E1E1E',
    minHeight: 100,
    gap: 6,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardLabel: {
    color: '#CCC',
    fontSize: 15,
    fontWeight: '700',
  },
  cardSubtitle: {
    color: '#444',
    fontSize: 11,
    lineHeight: 15,
  },
});

export default ModePicker;
