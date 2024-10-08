import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';

const settings = () => {
  const [name, setName] = useState('');
  const [cycleLength, setCycleLength] = useState('');
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('@user_name');
        const storedCycleLength = await AsyncStorage.getItem('@cycle_length');
        const storedLastPeriodDate = await AsyncStorage.getItem('@last_period_date');

        if (storedName !== null) setName(storedName);
        if (storedCycleLength !== null) setCycleLength(storedCycleLength);
        if (storedLastPeriodDate !== null) setLastPeriodDate(storedLastPeriodDate);
      } catch (e) {
        console.error('Failed to load data', e);
      }
    };

    loadData();
  }, []);

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('@user_name', name);
      await AsyncStorage.setItem('@cycle_length', cycleLength);
      await AsyncStorage.setItem('@last_period_date', lastPeriodDate);
      setIsEditing(false);
      Alert.alert('Données sauvegardées avec succès !', 'L’application va redémarrer pour appliquer les changements.', [
        { text: 'OK', onPress: reloadApp }
      ]);
    } catch (e) {
      console.error('Failed to save data', e);
    }
  };

  const reloadApp = async () => {
    try {
      await Updates.reloadAsync();  // Cette méthode permet de redémarrer l'application
    } catch (e) {
      console.error('Failed to reload the app', e);
    }
  };

  return (
    <ScrollView className="bg-rose-50 pt-20 px-5">
      <Text className="text-3xl font-bold mb-6 text-center text-rose-600">Paramètres</Text>

      <View className="bg-white rounded-2xl p-5 shadow-md mb-6">
        <ParameterField
          label="Nom"
          value={name}
          onChangeText={setName}
          isEditing={isEditing}
        />
        <ParameterField
          label="Longueur du cycle"
          value={cycleLength}
          onChangeText={setCycleLength}
          isEditing={isEditing}
          keyboardType="numeric"
        />
        <ParameterField
          label="Date des dernières règles"
          value={lastPeriodDate}
          onChangeText={setLastPeriodDate}
          isEditing={isEditing}
          placeholder="YYYY-MM-DD"
        />
      </View>

      <TouchableOpacity
        className={`py-3 px-6 rounded-full ${isEditing ? 'bg-rose-600' : 'bg-rose-500'}`}
        onPress={isEditing ? saveData : () => setIsEditing(true)}
      >
        <Text className="text-white text-center font-bold text-lg">
          {isEditing ? 'Sauvegarder' : 'Modifier'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const ParameterField = ({ label, value, onChangeText, isEditing, keyboardType, placeholder }) => (
  <View className="mb-4">
    <Text className="text-lg font-medium mb-2 text-rose-600">{label} :</Text>
    {isEditing ? (
      <TextInput
        className="h-12 border border-rose-300 rounded-lg px-3 bg-white"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || `Entrez votre ${label.toLowerCase()}`}
        keyboardType={keyboardType || 'default'}
      />
    ) : (
      <Text className="text-base p-3 border border-rose-300 rounded-lg bg-white">{value}</Text>
    )}
  </View>
);

export default settings;
