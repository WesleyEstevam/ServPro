import {StyleSheet} from 'react-native';
import {colors} from '../../styles';

export const styles = StyleSheet.create({
  checkBox: (checked) => ({
    borderColor: checked ? colors.primary : '#eee',
    borderRadius: 5,
  }),
});
