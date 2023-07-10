import styled from 'styled-components/native';
import { Icon, Text } from 'react-native-elements';

import { colors, fonts } from '../../styles';

export const Label = styled(Text)`
  font-weight: bold;
  font-size: ${fonts.big}px;
  margin-bottom: 5px;
  color: ${colors.darker}
`;

export const RadioContainer = styled.View`
  margin: 10px;
`;

export const RadioContent = styled.View`
  padding: 10px 0;
  flex-direction: row;
`;

export const RadioButtonContainer = styled.TouchableOpacity`
  background-color: #fafafa;
  flex: 1;
  flex-direction: row;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 10px;
  margin-right: 15px;

  ${({selected}) => selected && `border-color: ${colors.primary};`};
  ${({lastChild}) => lastChild && `margin-right: 0;`}
`;

export const RadioIcon = styled(Icon)`
  margin-right: 10px;
`;

export const RadioText = styled.Text`
  font-size: ${fonts.regular}px;
  font-weight: bold;
  color: ${colors.dark};
`;
