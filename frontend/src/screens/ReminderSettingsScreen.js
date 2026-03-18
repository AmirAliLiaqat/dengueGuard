import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Bell, ChevronLeft, Clock, Plus, Trash2 } from 'lucide-react-native';
import { createStyles } from '../styles/ReminderSettingsScreen.styles';
import {
  applyReminderSettings,
  getReminderSettings,
  saveReminderSettings,
  scheduleTestNotificationInSeconds,
} from '../services/NotificationService';

const DEFAULT_NEW_TIME = '07:00';

function normalizeTimeText(value) {
  const cleaned = value.replace(/[^\d:]/g, '');
  if (!cleaned.includes(':') && cleaned.length >= 3) {
    return `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
  }
  return cleaned;
}

function isValidTimeHHMM(value) {
  const m = /^(\d{2}):(\d{2})$/.exec(value);
  if (!m) return false;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  return hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59;
}

function sortTimes(times) {
  return [...times].sort((a, b) => a.localeCompare(b));
}

const ReminderSettingsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { t, isRTL } = useLanguage();
  const styles = createStyles(theme, isRTL);

  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [times, setTimes] = useState(['07:00', '13:00', '20:00']);
  const [muteOption, setMuteOption] = useState('none'); // '30m' | '1h' | '24h' | 'none'
  const [mutedUntil, setMutedUntil] = useState(null); // timestamp ms or null

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTime, setNewTime] = useState(DEFAULT_NEW_TIME);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await getReminderSettings();
        if (!mounted) return;
        setEnabled(Boolean(s.enabled));
        setTimes(Array.isArray(s.times) && s.times.length ? sortTimes(s.times) : ['10:00']);
        setMuteOption(s.muteOption ?? 'none');
        setMutedUntil(typeof s.mutedUntil === 'number' ? s.mutedUntil : null);

        const now = Date.now();
        if (typeof s.mutedUntil === 'number' && s.mutedUntil <= now) {
          const next = { enabled: Boolean(s.enabled), times: Array.isArray(s.times) && s.times.length ? sortTimes(s.times) : ['10:00'], muteOption: 'none', mutedUntil: null };
          setMuteOption('none');
          setMutedUntil(null);
          await saveReminderSettings(next);
          await applyReminderSettings(next);
        } else {
          await applyReminderSettings(s);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const persistAndApply = async (next) => {
    await saveReminderSettings(next);
    await applyReminderSettings(next);
  };

  const onToggleEnabled = async (value) => {
    setEnabled(value);
    const next = { enabled: value, times, muteOption, mutedUntil };
    await persistAndApply(next);
  };

  const onDeleteTime = async (time) => {
    const nextTimes = times.filter((t) => t !== time);
    setTimes(nextTimes);
    const next = { enabled, times: nextTimes, muteOption, mutedUntil };
    await persistAndApply(next);
  };

  const onAddTime = async () => {
    const normalized = normalizeTimeText(newTime);
    if (!isValidTimeHHMM(normalized)) return;
    if (times.includes(normalized)) {
      setShowAddModal(false);
      return;
    }
    const nextTimes = sortTimes([...times, normalized]);
    setTimes(nextTimes);
    setShowAddModal(false);
    const next = { enabled, times: nextTimes, muteOption, mutedUntil };
    await persistAndApply(next);
  };

  const onTestNotification = async () => {
    try {
      setIsTesting(true);
      await scheduleTestNotificationInSeconds(5, {
        title: t('test_notification'),
        body: t('test_notification_sub'),
      });
    } finally {
      setIsTesting(false);
    }
  };

  const muteOptions = useMemo(
    () => [
      { id: '30m', label: t('mute_30m') },
      { id: '1h', label: t('mute_1h') },
      { id: '24h', label: t('mute_24h') },
    ],
    [t],
  );

  const onSelectMute = async (id) => {
    const isTurningOff = muteOption === id;
    const nextMute = isTurningOff ? 'none' : id;

    const now = Date.now();
    const durationMs =
      nextMute === '30m' ? 30 * 60 * 1000 :
      nextMute === '1h' ? 60 * 60 * 1000 :
      nextMute === '24h' ? 24 * 60 * 60 * 1000 :
      0;

    const nextMutedUntil = durationMs ? now + durationMs : null;

    setMuteOption(nextMute);
    setMutedUntil(nextMutedUntil);

    const next = { enabled, times, muteOption: nextMute, mutedUntil: nextMutedUntil };
    await persistAndApply(next);
  };

  const isMutedActive = typeof mutedUntil === 'number' && mutedUntil > Date.now();
  const normalizedNewTime = normalizeTimeText(newTime);
  const canAddTime = isValidTimeHHMM(normalizedNewTime);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.text} size={24} style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('reminder_settings')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardLeft}>
            <Text style={styles.cardTitle}>{t('enable_reminders')}</Text>
            <Text style={styles.cardSubtitle}>{t('enable_reminders_sub')}</Text>
          </View>
          <Switch value={enabled} onValueChange={onToggleEnabled} />
        </View>

        <View style={styles.card}>
          <View style={styles.cardLeft}>
            <Text style={styles.cardTitle}>{t('test_notification')}</Text>
            <Text style={styles.cardSubtitle}>{t('test_notification_sub')}</Text>
          </View>
          <TouchableOpacity style={styles.roundIconButton} onPress={onTestNotification} disabled={isTesting}>
            {isTesting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Bell color="#FFFFFF" size={22} />
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>{t('scheduled_times')}</Text>
        <View style={styles.timesCard}>
          {times.map((time) => (
            <View key={time} style={styles.timeRow}>
              <View style={styles.timeLeft}>
                <Clock color={colors.primary} size={18} />
                <Text style={styles.timeText}>{time}</Text>
              </View>
              <TouchableOpacity onPress={() => onDeleteTime(time)} style={styles.deleteTimeButton}>
                <Trash2 color={colors.error} size={18} />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addTimeButton} onPress={() => { setNewTime(DEFAULT_NEW_TIME); setShowAddModal(true); }}>
            <Plus color={colors.primary} size={18} />
            <Text style={styles.addTimeText}>{t('add_new_time')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>{t('mute_options')}</Text>
        <View style={styles.muteRow}>
          {muteOptions.map((opt) => {
            const active = isMutedActive && muteOption === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => onSelectMute(opt.id)}
                style={[styles.muteChip, active && styles.muteChipActive]}
              >
                <Text style={[styles.muteChipText, active && styles.muteChipTextActive]}>{opt.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <Modal visible={showAddModal} transparent animationType="fade" onRequestClose={() => setShowAddModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('add_new_time')}</Text>
            <Text style={styles.modalSubtitle}>{t('enter_time_hhmm')}</Text>

            <TextInput
              value={newTime}
              onChangeText={(v) => setNewTime(normalizeTimeText(v))}
              placeholder="07:00"
              keyboardType="number-pad"
              maxLength={5}
              style={styles.modalInput}
              placeholderTextColor={colors.textMuted}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.modalCancel]} onPress={() => setShowAddModal(false)}>
                <Text style={styles.modalCancelText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirm, !canAddTime && { opacity: 0.6 }]}
                onPress={onAddTime}
                disabled={!canAddTime}
              >
                <Text style={styles.modalConfirmText}>{t('add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ReminderSettingsScreen;

