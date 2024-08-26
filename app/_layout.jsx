import { Tabs } from 'expo-router';
import TabBar from '../components/TabBar';

const _layout = () => {
  return (
    <Tabs TabBar={props => <TabBar {...props} />}>
      <Tabs.Screen 
        name='acceuil'
        
        options={{
          title: 'Acceuil',
          headerShown: false
        }} />
      <Tabs.Screen 
        name='parametres'
        options={{
          title: 'Parametres',
          headerShown: false
        }} />
    </Tabs>
  );
}

export default _layout;

