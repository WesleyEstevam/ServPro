import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  Text,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from 'react-native';

import {
  Background,
  Container,
  ContainerImage,
  ContainerForm,
  InputLabel,
  SignInButton,
  SignInButtonText,
} from './styles';

import {colors, fonts} from '../../styles';

import {AuthContext} from '../../context/AuthContext';
import {login} from '../../data/services/AuthServices';

export default function Acesso({navigation}) {
  const [codigo, setCodigo] = useState('');
  const {setUserData} = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    console.log('acesso', login);
  }, [login]);
  const realizarAcesso = async () => {};

  const atualizarCodigo = text => {
    setCodigo(text);
  };

  async function doLogin() {
    console.log('do login');
    try {
      setLoading(true);
      const tecnicoData = await login(codigo);

      setLoading(false);
      setUserData(tecnicoData);
    } catch (error) {
      setLoading(false);

      const parsedResponse = JSON.parse(error.message);
      
      console.log('login:acesso:erro: ', JSON.parse(error.message));
      Alert.alert(parsedResponse.message);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'heigth'}
      style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Background>
          <Container>
            <ContainerImage>
              <Image
                source={require('../../assets/img/servmobi_1.png')}
                style={{
                  width: 200,
                  height: 200,
                  marginTop: 10,

                }}
              />
            </ContainerImage>
            <ContainerForm>
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: 'bold',
                  fontSize: fonts.big,
                }}>
                Código de acesso
              </Text>
              <InputLabel
                label="Código de acesso"
                value={codigo}
                onChangeText={atualizarCodigo}
              />

              <SignInButton
                disabled={isLoading}
                onPress={doLogin}
              >
                <SignInButtonText>Acessar</SignInButtonText>
              </SignInButton>
            </ContainerForm>

            {isLoading && <ActivityIndicator size="large" color={colors.grey}/>}
            
          </Container>
        </Background>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
