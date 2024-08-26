import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Accueil = () => {
  const [name, setName] = useState('');
  const [cycleLength, setCycleLength] = useState('');
  const [lastPeriodDate, setLastPeriodDate] = useState(null);
  const [cyclePhase, setCyclePhase] = useState('');
  const [daysUntilNextPeriod, setDaysUntilNextPeriod] = useState(0);
  const [emoji, setEmoji] = useState('');
  const [conseil, setConseil] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('@user_name');
        const storedCycleLength = await AsyncStorage.getItem('@cycle_length');
        const storedLastPeriodDate = await AsyncStorage.getItem('@last_period_date');

        if (storedName !== null) setName(storedName);
        if (storedCycleLength !== null) setCycleLength(storedCycleLength);
        if (storedLastPeriodDate !== null) setLastPeriodDate(new Date(storedLastPeriodDate));
      } catch (e) {
        console.error("Failed to load data", e);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (lastPeriodDate && cycleLength) {
      const today = new Date();
      const daysSinceLastPeriod = Math.floor((today - lastPeriodDate) / (1000 * 60 * 60 * 24));
      const cycleDay = daysSinceLastPeriod % parseInt(cycleLength, 10) + 1;

      setDaysUntilNextPeriod(parseInt(cycleLength, 10) - cycleDay + 1);

      if (cycleDay <= 5) {
        setCyclePhase('Règles');
        setEmoji('🩸');
        setConseil('Faites du yoga, prenez du soleil et de la vitamine D.');
      } else if (cycleDay <= 7) {
        setCyclePhase('Phase folliculaire');
        setEmoji('🔥');
        setConseil('Faites du sport pour stimuler vos follicules.');
      } else if (cycleDay <= 11) {
        setCyclePhase('Moyenne Phase folliculaire');
        setEmoji('🔥');
        setConseil('Faites de la danse pour augmenter votre température corporelle.');
      } else if (cycleDay <= 14) {
        setCyclePhase('Phase pré-ovulatoire');
        setEmoji('🔥🔥');
        setConseil('Prenez des bains chauds pour réduire l\'inflammation.');
      } else if (cycleDay <= 19) {
        setCyclePhase('Moyenne Phase pré-ovulatoire');
        setEmoji('🔥🔥');
        setConseil('Faites de la lecture pour développer votre cerveau.');
      } else if (cycleDay <= 21) {
        setCyclePhase('Ovulation');
        setEmoji('🥜');
        setConseil('Faites de l\'exercice physique intense.');
      } else if (cycleDay <= 28) {
        setCyclePhase('Phase lutéale');
        setEmoji('⚪️');
        setConseil('Faites du repos.');
      } else {
        setCyclePhase('Retard de règles');
        setEmoji('😐');
        setConseil('Faites de l\'exercice physique régulièrement.');
      }
    }
  }, [lastPeriodDate, cycleLength]);

  const today = new Date();
  const nextPeriodDate = new Date(today);
  nextPeriodDate.setDate(today.getDate() + daysUntilNextPeriod);

  return (
    <SafeAreaView className="flex-1 bg-rose-50 pt-10">
      <ScrollView className="p-5">
        <Text className="text-3xl font-bold text-center text-rose-600 mb-6">
          Bonjour {name} 👋
        </Text>

        <View className="bg-white rounded-2xl p-5 shadow-md mb-6">
          <Text className="text-xl font-semibold mb-3">Votre cycle</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Phase actuelle</Text>
            <Text className="font-medium">{cyclePhase}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Jours avant les règles</Text>
            <Text className="font-medium">{daysUntilNextPeriod}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Prochaine période</Text>
            <Text className="font-medium">{nextPeriodDate.toLocaleDateString()}</Text>
          </View>
        </View>

        <View className="bg-rose-400 rounded-2xl p-5 items-center mb-6">
          <Text className="text-6xl mb-3">{emoji}</Text>
          <Text className="text-white text-center">{conseil}</Text>
        </View>

        <View className="bg-white rounded-2xl p-5 shadow-md">
          <Text className="text-xl font-semibold mb-3">Détails du cycle</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Durée du cycle</Text>
            <Text className="font-medium">{cycleLength} jours</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Dernière période</Text>
            <Text className="font-medium">{lastPeriodDate?.toLocaleDateString()}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Accueil;