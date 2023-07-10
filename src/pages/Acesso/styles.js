import styled from 'styled-components/native';
import {fonts, colors} from '../../styles';

export const Background = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding: 15px 15px;
`;

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  margin-top: 20%;
`;

export const ContainerForm = styled.View`
    /* flex: 1; */
    margin: 50px 0;
`;

export const ContainerImage = styled.View`
    /* flex: 1; */
    justify-content: center;
    align-items: center;
    margin-right: 40px;
    

`;

export const ContainerFooter = styled.View`
    /* flex: 1; */
`;

export const InputLabel = styled.TextInput`
    border-bottom-color: #ddd;
    border-bottom-width: 1px;
    padding: 0 15px;
    font-size: ${fonts.big}px;
    color: ${colors.dark};
    height: 44px;
`;

export const SignInButton = styled.TouchableOpacity`
  height: 50px;
  width: 100%;
  background-color: ${colors.primary};
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  padding: 10px;
  margin-top: 20px;
`;

export const SignInButtonText = styled.Text`
  color: ${colors.white};
  font-size: ${fonts.bigger}px;
`;
