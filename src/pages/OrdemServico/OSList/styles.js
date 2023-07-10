import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {fonts, colors} from '../../../styles';

export const Container = styled.ScrollView`
  flex: 1;
  background: ${colors.white};
`;

export const ItemTypeIndicator = styled.View`
  width: 25px; 
  height: 100%; 
  /* position: absolute;  */
  right:0;
  /* opacity: 0; */
  border-bottom-right-radius: 15px;
  border-top-right-radius: 15px;

  background-color: ${({color}) => color};
`;

export const ItemContainer = styled.TouchableOpacity`
  background-color: #fff;
  margin: 0 10px;
  margin-top: 10px;
  border-radius: 10px;
  border: ${StyleSheet.hairlineWidth}px solid ${colors.regular};
  flex-direction: row;
`;

export const ItemContent = styled.View`
  padding: 15px;
  /* background-color: blueviolet; */
  flex: 1;
  
`;


export const ItemTitle = styled.Text`
  font-size: ${fonts.big}px;
  margin-bottom: 5px;
  /* font-weight: bold; */
  color: ${colors.darker};
`;

export const ItemSubTitle = styled.Text`
  color: ${colors.grey};
  /* font-size: ${fonts.regular}px; */
`;
