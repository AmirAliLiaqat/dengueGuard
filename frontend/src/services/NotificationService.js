import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

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

export const scheduleDailyReminder = async (remindersEnabled = true) => {
  // If disabled, cancel all and return
  if (!remindersEnabled) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return;
  }

  // Check permissions first
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Notification permissions not granted');
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();
  
  // Get a random tip for today's schedule
  const tipIndex = new Date().getDay() % DAILY_TIPS.length;
  const tip = DAILY_TIPS[tipIndex];

  try {
    // Try standard daily trigger
    await Notifications.scheduleNotificationAsync({
      content: {
        title: tip.title,
        body: tip.body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        hour: 10,
        minute: 0,
        repeats: true,
      },
    });
  } catch (err) {
    console.log('Standard trigger failed, trying with type and channelId:', err);
    // Fallback for versions requiring explicit type or channelId
    await Notifications.scheduleNotificationAsync({
      content: {
        title: tip.title,
        body: tip.body,
      },
      trigger: {
        type: 'daily', // Some versions use 'daily' as a string type
        hour: 10,
        minute: 0,
        channelId: 'default', // Using the channel we registered
      },
    });
  }
};

export const cancelAllReminders = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const sendLocalNotification = async (title, body) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: null,
  });
};
