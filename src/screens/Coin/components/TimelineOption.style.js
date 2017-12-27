import { StyleSheet } from 'react-native';
import { THEME } from '../../../config';

export default StyleSheet.create({
  container: {
    marginBottom: THEME.UNIT / 2,
    padding: THEME.UNIT / 2,
  },

  bullet: {
    backgroundColor: THEME.CONTRAST,
    marginRight: THEME.UNIT / 2,
  },

  bulletActive: {
    backgroundColor: THEME.WHITE,
  },

  caption: {
    color: THEME.CONTRAST,
    fontSize: THEME.FONT.SIZE.SMALL,
    backgroundColor: 'transparent',
  },

  captionActive: {
    color: THEME.WHITE,
    fontWeight: THEME.FONT.WEIGHT.BOLD,
  },

  disabled: {
    opacity: 0.5,
  },
});
