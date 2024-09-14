import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Platform } from 'react-native';

const _layout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Reminder') {  // Match case with the name
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size || 24} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="Reminder" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: 'white',
    borderRadius: 20,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export default _layout;
