import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { styled } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface Todo {
  id: number;
  text: string;
}

const Reminder = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    loadTodos(); // Charger les tâches au démarrage
  }, []);

  // Fonction pour charger les todos depuis AsyncStorage
  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem('@todos');
      if (storedTodos !== null) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (e) {
      console.error('Erreur lors du chargement des tâches', e);
    }
  };

  // Fonction pour sauvegarder les todos dans AsyncStorage
  const saveTodos = async (newTodos: Todo[]) => {
    try {
      await AsyncStorage.setItem('@todos', JSON.stringify(newTodos));
    } catch (e) {
      console.error('Erreur lors de la sauvegarde des tâches', e);
    }
  };

  const addTodo = () => {
    if (inputText.trim() !== '') {
      const newTodos = [...todos, { id: Date.now(), text: inputText.trim() }];
      setTodos(newTodos);
      saveTodos(newTodos); // Sauvegarde après ajout
      setInputText('');
    } else {
      Alert.alert('Veuillez entrer une tâche');
    }
  };

  const removeTodo = (id: number) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
    saveTodos(newTodos); // Sauvegarde après suppression
  };

  return (
    <StyledView className="flex-1 p-6 bg-gray-50">
      <StyledText className="text-3xl font-bold mb-6 mt-12 text-center text-blue-600">Todo Reminder</StyledText>
      <StyledView className="flex-row gap-3 mb-6">
        <StyledTextInput
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2 bg-white shadow-sm"
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ajouter une tâche"
        />
        <StyledTouchableOpacity
          className="bg-blue-500 rounded-full px-4 py-2 justify-center shadow-lg active:bg-blue-700"
          onPress={addTodo}
        >
          <StyledText className="text-white font-bold text-lg">+</StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <StyledView className="flex-row justify-between items-center p-3 mb-2 border-b border-gray-300 bg-white rounded-lg shadow-sm">
            <StyledText className="text-lg text-gray-800">{item.text}</StyledText>
            <StyledTouchableOpacity
              className="bg-red-500 rounded-full px-4 py-1 shadow-md active:bg-red-700"
              onPress={() => removeTodo(item.id)}
            >
              <StyledText className="text-white">Supprimer</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        )}
      />
    </StyledView>
  );
};

export default Reminder;
