import React, { useState } from 'react';
import { View, Text } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {colors} from '../../styles';
import { Container } from './styles';


export default function CheckBoxDetalhes({toggleCheckBox, setToggleCheckBox, text}){


    return(
    <Container>
        <CheckBox
            lineWidth={2}
            hideBox={false}
            tintColors={{true: colors.primary}}
            onTintColor={{true: colors.primary}}
            animationDuration={0.5}
            disabled={false}
            onAnimationType={'bounce'}
            offAnimationType={'stroke'}
            value={toggleCheckBox}
            onValueChange={(newValue) => setToggleCheckBox(newValue)}
        />
        <Text style={{paddingTop: 5, justifyContent: 'center'}}> {text} </Text>
    </Container>
    )
}
