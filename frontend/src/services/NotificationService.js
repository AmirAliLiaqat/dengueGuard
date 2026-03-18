import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      // alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    // alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
};

export const DAILY_TIPS = [
  {
    title: "Daily Prevention Tip 🦟",
    body: "Empty all stagnant water from containers like flower pots and buckets to stop mosquito breeding."
  },
  {
    title: "Stay Protected 🛡️",
    body: "Peak mosquito activity is at dawn and dusk. Wear long sleeves if you are going outside."
  },
  {
    title: "Health Check 🏥",
    body: "Check yourself for any symptoms like fever or muscle pain. Early detection saves lives!"
  },
  {
    title: "Mosquito Repellent 🧴",
    body: "Don't forget to apply mosquito repellent before heading out today."
  },
  {
    title: "Stay Hydrated 💧",
    body: "Drinking plenty of water is essential for your immune system and recovery."
  },
  {
    title: "Clean Surroundings ✨",
    body: "Keep your environment clean and dry to reduce mosquito habitats."
  },
  {
    title: "Community Safety 👥",
    body: "Encourage your neighbors to also clear stagnant water. Dengue prevention is a team effort!"
  }
];

const REMINDER_SETTINGS_KEY = 'reminder_settings_v1';
const REMINDER_SCHEDULED_IDS_KEY = 'reminder_scheduled_ids_v1';

const getScheduledReminderIds = async () => {
  try {
    const raw = await AsyncStorage.getItem(REMINDER_SCHEDULED_IDS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveScheduledReminderIds = async (ids) => {
  await AsyncStorage.setItem(REMINDER_SCHEDULED_IDS_KEY, JSON.stringify(Array.isArray(ids) ? ids : []));
};

const cancelScheduledReminderIds = async () => {
  const ids = await getScheduledReminderIds();
  for (const id of ids) {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch {
      // ignore (already gone)
    }
  }
  await saveScheduledReminderIds([]);
};

export const getReminderSettings = async () => {
  try {
    const raw = await AsyncStorage.getItem(REMINDER_SETTINGS_KEY);
    if (!raw) {
      return { enabled: true, times: ['10:00'], muteOption: 'none', mutedUntil: null };
    }
    const parsed = JSON.parse(raw);
    return {
      enabled: parsed?.enabled ?? true,
      times: Array.isArray(parsed?.times) ? parsed.times : ['10:00'],
      muteOption: parsed?.muteOption ?? 'none',
      mutedUntil: typeof parsed?.mutedUntil === 'number' ? parsed.mutedUntil : null,
    };
  } catch {
    return { enabled: true, times: ['10:00'], muteOption: 'none', mutedUntil: null };
  }
};

export const saveReminderSettings = async (settings) => {
  await AsyncStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(settings));
};

const ensureLocalNotificationReady = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('Notification permissions not granted');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return true;
};

const getTodayTip = () => {
  const tipIndex = new Date().getDay() % DAILY_TIPS.length;
  return DAILY_TIPS[tipIndex];
};

const scheduleAtDate = async (date, tip) => {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: tip.title,
      body: tip.body,
      ...(Platform.OS === 'android' ? { channelId: 'default' } : null),
    },
    trigger: date,
  });
};

export const applyReminderSettings = async (settings) => {
  if (!settings?.enabled) {
    await cancelScheduledReminderIds();
    return;
  }

  const ok = await ensureLocalNotificationReady();
  if (!ok) return;

  const tip = getTodayTip();
  await cancelScheduledReminderIds();

  const times = Array.isArray(settings?.times) && settings.times.length ? settings.times : ['10:00'];
  const now = Date.now();
  const mutedUntil = typeof settings?.mutedUntil === 'number' ? settings.mutedUntil : null;
  const horizonDays = 7;

  const nextIds = [];

  for (let d = 0; d < horizonDays; d += 1) {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    base.setDate(base.getDate() + d);

    for (const time of times) {
      const m = /^(\d{2}):(\d{2})$/.exec(time);
      if (!m) continue;
      const hour = Number(m[1]);
      const minute = Number(m[2]);
      if (Number.isNaN(hour) || Number.isNaN(minute)) continue;

      const fireDate = new Date(base);
      fireDate.setHours(hour, minute, 0, 0);

      const ts = fireDate.getTime();
      if (ts <= now) continue;
      if (mutedUntil && ts < mutedUntil) continue;

      const id = await scheduleAtDate(fireDate, tip);
      nextIds.push(id);
    }
  }

  await saveScheduledReminderIds(nextIds);
};

export const scheduleDailyReminder = async (remindersEnabled = true) => {
  if (!remindersEnabled) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return;
  }
  const settings = await getReminderSettings();
  await applyReminderSettings(settings);
};

export const cancelAllReminders = async () => {
  await cancelScheduledReminderIds();
};

export const scheduleTestNotificationInSeconds = async (seconds = 5, contentOverride) => {
  const ok = await ensureLocalNotificationReady();
  if (!ok) return;

  const title = contentOverride?.title ?? 'Test Notification';
  const body =
    contentOverride?.body ?? `Fires in ${seconds} seconds — background the app to see it.`;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      ...(Platform.OS === 'android' ? { channelId: 'default' } : null),
    },
    trigger: { seconds, repeats: false },
  });
};

export const sendLocalNotification = async (title, body) => {
  const ok = await ensureLocalNotificationReady();
  if (!ok) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      ...(Platform.OS === 'android' ? { channelId: 'default' } : null),
    },
    trigger: null,
  });
};
