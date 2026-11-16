import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerRootComponent } from 'expo';
import { view } from './storybook.requires';

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

// Com a troca de entry point, este arquivo substitui o index.ts do app,
// que é quem normalmente registra o componente "main".
registerRootComponent(StorybookUIRoot);

export default StorybookUIRoot;
