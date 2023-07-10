import { StatusBar, StyleSheet, Dimensions } from 'react-native';
import styled from 'styled-components/native';

import { colors } from '../../../styles';

const statusBarHeight = StatusBar.currentHeight || 14;

export const Container = styled.ScrollView`
  background-color: ${colors.white};
`;

export const Title = styled.Text`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: ${colors.primary};
  margin: 20px 0;
`;

export const InputsContainer = styled.View`
  margin-top: 20px;
  padding: 0 5px;
`;

const signatureButtonsContainerHeight = 72.6 / 2;
const sigantureModalHeight = (Dimensions.get('window').height * 0.9) - statusBarHeight;
const signatureModalPadding = 10;
const SignatureButtonsContainerPosition = (sigantureModalHeight / 2) - (signatureButtonsContainerHeight - signatureModalPadding);

export const SignatureButtonsContainer = styled.View`
  width: 100%;
  padding: 5px;
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  
  border: ${StyleSheet.hairlineWidth}px solid transparent;
  border-bottom-color: ${colors.dark};
  /* transform: rotateZ(90deg);
  right: -${SignatureButtonsContainerPosition}px;
  top: ${SignatureButtonsContainerPosition}px; */
`;

export const SignatureButton = styled.TouchableOpacity`
  padding: 10px;
  border-radius: 5px;
  background-color: #f3891623;
  border: 1px solid #f38916;

  ${({close}) => close&&`
    background-color: #e9565623;
    border-color: #e95656;
    margin-left: 5px;
  `}
`;

export const SignatureButtonText = styled.Text`
  color: #f38916;
  font-weight: bold;
`;

export const SigantureImageContainer = styled.View`
  background-color: #ddd;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

export const TextAreaContainer = styled.View`
  margin-bottom: 10px;
`;

export const TextAreaSubTitle = styled.Text`
  position: absolute;
  top: 0;
  right: 10px;
  color: ${colors.dark};

  ${({errorStyle}) => errorStyle&&`
    color: red;
  `};
`;

export const TextAreaErrorMessage = styled.Text`
  color: red;
`;

export const SigantureModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0,0,0,0.5);
  justify-content: center;
  align-items: center;
`;

export const SigantureModalContetn = styled.View`
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  height: 90%;
  width: 90%;
`;
