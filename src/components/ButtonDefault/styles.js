import styled from 'styled-components/native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {fonts, colors} from '../../styles';

export const Button = styled.TouchableOpacity`
  height: 50px;
  width: 350px;
  background-color: ${colors.primary};
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  padding: 10px;
  margin: 0 10px;
  
  ${({fullWidth}) => fullWidth&&`
    width: auto;
    flex: 1;
  `}
`;

export const TextButton = styled.Text`
  color: ${colors.white};
  font-size: ${fonts.bigger}px;
`;
