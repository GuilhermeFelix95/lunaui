import type { Preview } from '@storybook/react-native';
import { View } from 'react-native';
import { LunaProvider, createTheme } from 'lunakit';

const preview: Preview = {
  decorators: [
    (Story) => (
      <LunaProvider theme={createTheme()}>
        <View style={{ padding: 16 }}>
          <Story />
        </View>
      </LunaProvider>
    ),
  ],
};

export default preview;
