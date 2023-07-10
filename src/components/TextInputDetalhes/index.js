import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { colors } from '../../styles';

export default function TextInputDetalhes({titulo, valueText, setValueText, editable}){

    return(
        <View style={{marginLeft: 10, marginRight: 20, marginTop: 10}}>
            <Text style={{fontWeight: 'bold', color: colors.primary}}>{titulo}</Text>
            <TextInput 
            style={{
                borderBottomWidth: 1, 
                borderColor: colors.primary, 
                paddingLeft: 10, 
                paddingRight: 10
            }}
            onChangeText={(text) => setValueText(text)}
            value={valueText}
            editable={editable}
            />
        </View>
    )
}