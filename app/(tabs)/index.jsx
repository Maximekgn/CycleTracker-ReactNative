import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const CYCLE_PHASES = [
  { name: 'Règles', emoji: '🩸', colors: ['#FF9AA2', '#FFB7B2'], advice: 'Faites du yoga, prenez du soleil et de la vitamine D.', maxDay: 5 },
  { name: 'Phase folliculaire', emoji: '🔥', colors: ['#FFDAC1', '#E2F0CB'], advice: 'Faites du sport pour stimuler vos follicules.', maxDay: 7 },
  { name: 'Moyenne Phase folliculaire', emoji: '🔥', colors: ['#E2F0CB', '#B5EAD7'], advice: 'Faites de la danse pour augmenter votre température corporelle.', maxDay: 11 },
  { name: 'Phase pré-ovulatoire', emoji: '🔥🔥', colors: ['#B5EAD7', '#C7CEEA'], advice: 'Prenez des bains chauds pour réduire l\'inflammation.', maxDay: 14 },
  { name: 'Moyenne Phase pré-ovulatoire', emoji: '🔥🔥', colors: ['#C7CEEA', '#E0AAFF'], advice: 'Faites de la lecture pour développer votre cerveau.', maxDay: 19 },
  { name: 'Ovulation', emoji: '🥜', colors: ['#E0AAFF', '#FFC6FF'], advice: 'Faites de l\'exercice physique intense.', maxDay: 21 },
  { name: 'Phase lutéale', emoji: '⚪️', colors: ['#FFC6FF', '#BDB2FF'], advice: 'Faites du repos.', maxDay: 28 },
  { name: 'Retard de règles', emoji: '😐', colors: ['#BDB2FF', '#A0C4FF'], advice: 'Faites de l\'exercice physique régulièrement.', maxDay: Infinity },
];

const Accueil = () => {
  const [userData, setUserData] = useState({
    name: '',
    cycleLength: '',
    lastPeriodDate: null,
  });
  const [cycleInfo, setCycleInfo] = useState({
    phase: '',
    daysUntilNextPeriod: 0,
    emoji: '',
    advice: '',
    colors: ['#FFB7B2', '#FFDAC1'],
  });
  const [isModalVisible, setModalVisible] = useState(false);
  const [symptoms, setSymptoms] = useState([]);

  const loadData = useCallback(async () => {
    try {
      const [storedName, storedCycleLength, storedLastPeriodDate, storedSymptoms] = await Promise.all([
        AsyncStorage.getItem('@user_name'),
        AsyncStorage.getItem('@cycle_length'),
        AsyncStorage.getItem('@last_period_date'),
        AsyncStorage.getItem('@symptoms'),
      ]);

      setUserData({
        name: storedName || '',
        cycleLength: storedCycleLength || '',
        lastPeriodDate: storedLastPeriodDate ? new Date(storedLastPeriodDate) : null,
      });

      if (storedSymptoms) {
        setSymptoms(JSON.parse(storedSymptoms));
      }
    } catch (e) {
      console.error("Erreur lors du chargement des données", e);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const { lastPeriodDate, cycleLength } = userData;
    if (lastPeriodDate && cycleLength) {
      const today = new Date();
      const daysSinceLastPeriod = Math.floor((today - lastPeriodDate) / (1000 * 60 * 60 * 24));
      const cycleDay = daysSinceLastPeriod % parseInt(cycleLength, 10) + 1;
      const daysUntilNextPeriod = parseInt(cycleLength, 10) - cycleDay + 1;

      const currentPhase = CYCLE_PHASES.find(phase => cycleDay <= phase.maxDay) || CYCLE_PHASES[CYCLE_PHASES.length - 1];

      setCycleInfo({
        phase: currentPhase.name,
        daysUntilNextPeriod,
        emoji: currentPhase.emoji,
        advice: currentPhase.advice,
        colors: currentPhase.colors,
      });
    }
  }, [userData]);

  const saveSymptoms = async (newSymptoms) => {
    try {
      await AsyncStorage.setItem('@symptoms', JSON.stringify(newSymptoms));
    } catch (e) {
      console.error("Erreur lors de la sauvegarde des symptômes", e);
    }
  };

  const toggleSymptom = useCallback((symptom) => {
    setSymptoms(prevSymptoms => {
      const newSymptoms = prevSymptoms.includes(symptom)
        ? prevSymptoms.filter(s => s !== symptom)
        : [...prevSymptoms, symptom];
      saveSymptoms(newSymptoms);
      return newSymptoms;
    });
  }, []);

  const nextPeriodDate = new Date();
  nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleInfo.daysUntilNextPeriod);

  return (
    <LinearGradient colors={cycleInfo.colors} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} className="pt-10">
        <ScrollView className="p-5">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-3xl font-bold text-white">
              Bonjour, {userData.name} 👋
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="add-circle-outline" size={32} color="white" />
            </TouchableOpacity>
          </View>

          <CycleInfoCard
            phase={cycleInfo.phase}
            daysUntilNextPeriod={cycleInfo.daysUntilNextPeriod}
            nextPeriodDate={nextPeriodDate}
          />

          <AdviceCard emoji={cycleInfo.emoji} advice={cycleInfo.advice} />

          <CycleDetailsCard
            cycleLength={userData.cycleLength}
            lastPeriodDate={userData.lastPeriodDate}
          />

          <SymptomsCard symptoms={symptoms} />
        </ScrollView>

        <SymptomModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          toggleSymptom={toggleSymptom}
          symptoms={symptoms}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

// ... (Les composants CycleInfoCard, AdviceCard, CycleDetailsCard, InfoRow restent inchangés)

const SymptomsCard = ({ symptoms }) => (
  <View className="bg-white rounded-3xl p-5 shadow-lg mb-6">
    <Text className="text-2xl font-semibold mb-3 text-purple-600">Symptômes du jour</Text>
    {symptoms.length > 0 ? (
      symptoms.map((symptom, index) => (
        <Text key={index} className="text-gray-700 mb-1">• {symptom}</Text>
      ))
    ) : (
      <Text className="text-gray-500 italic">Aucun symptôme enregistré aujourd'hui</Text>
    )}
  </View>
);

const SymptomModal = ({ isVisible, onClose, toggleSymptom, symptoms }) => {
  const COMMON_SYMPTOMS = ['Crampes', 'Fatigue', 'Maux de tête', 'Ballonnements', 'Sautes d\'humeur', 'Acné'];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <View className="bg-white rounded-t-3xl p-5 shadow-lg">
          <Text className="text-2xl font-semibold mb-4 text-purple-600">Ajouter des symptômes</Text>
          {COMMON_SYMPTOMS.map((symptom, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toggleSymptom(symptom)}
              className={`p-3 mb-2 rounded-full ${symptoms.includes(symptom) ? 'bg-purple-200' : 'bg-gray-200'}`}
            >
              <Text className={`text-center ${symptoms.includes(symptom) ? 'text-purple-700' : 'text-gray-700'}`}>
                {symptom}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={onClose} className="mt-4 bg-purple-600 p-3 rounded-full">
            <Text className="text-white text-center font-semibold">Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Accueil;

const CycleInfoCard = ({ phase, daysUntilNextPeriod, nextPeriodDate }) => (
  <View className="bg-white rounded-3xl p-5 shadow-lg mb-6">
    <Text className="text-2xl font-semibold mb-3 text-purple-600">Votre cycle</Text>
    <InfoRow label="Phase actuelle" value={phase} />
    <InfoRow label="Jours avant les règles" value={daysUntilNextPeriod} />
    <InfoRow label="Prochaine période" value={nextPeriodDate.toLocaleDateString()} />
  </View>
);

const AdviceCard = ({ emoji, advice }) => (
  <View className="bg-white rounded-3xl p-5 shadow-lg mb-6">
    <Text className="text-6xl mb-3 text-center">{emoji}</Text>
    <Text className="text-lg text-center text-gray-700">{advice}</Text>
  </View>
);

const CycleDetailsCard = ({ cycleLength, lastPeriodDate }) => (
  <View className="bg-white rounded-3xl p-5 shadow-lg mb-6">
    <Text className="text-2xl font-semibold mb-3 text-purple-600">Détails du cycle</Text>
    <InfoRow label="Durée du cycle" value={`${cycleLength} jours`} />
    <InfoRow label="Dernière période" value={lastPeriodDate?.toLocaleDateString()} />
  </View>
);



const InfoRow = ({ label, value }) => (
  <View className="flex-row justify-between mb-2">
    <Text className="text-gray-600">{label}</Text>
    <Text className="font-medium text-purple-600">{value}</Text>
  </View>
);


