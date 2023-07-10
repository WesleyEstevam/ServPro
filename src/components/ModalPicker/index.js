import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Dimensions, 
    ScrollView, 
    Modal
} from 'react-native';
import { colors } from "../../styles";
import { ModalOverlay } from "./styles";

const WIDHT = Dimensions.get('window').width;
const HEIGT = Dimensions.get('window').height;

const ModalPicker = ({
    options = OPTIONS,
    onChange = () => {},
    label = 'Selecione...'
}) => {

    const [isModalVisible, setIsModalVisible] = useState(false)
    const [chooseData, setChooseData] = useState(label)

    const onPressItem = (option) => {
        setChooseData(option)
        onChange(option)
        setIsModalVisible(false)
    }

    const optionsRendered = options.map((item, index) => {
        return (
            <TouchableOpacity
                style={styles.option}
                key={index}
                onPress={() => onPressItem(item)}
            >
                <Text style={styles.text}>
                    {item}
                </Text>
            </TouchableOpacity>
        )
    });

    const changeModalVisibility = (value) => {
        setIsModalVisible(value)
    }

    return (
        <>
        <TouchableOpacity 
            onPress={() => changeModalVisibility(true)}
            style={styles.touchableOpacity}
        >
            <Text style={styles.text}>{chooseData}</Text>
        </TouchableOpacity>
        
        <Modal
            transparent={true}
            animationType='fade'
            visible={isModalVisible}
            onRequestClose={() => changeModalVisibility(false)}
        >
            <ModalOverlay>
                <ScrollView style={[styles.modal, {width: WIDHT - 20, maxHeight: '26%'}]}>
                    {optionsRendered}
                </ScrollView>
            </ModalOverlay>
        </Modal>
        </>
    )
}

function ControlledModalPicker({
    control,
    name,
    label,
    options
}) {

    return (
        <Controller 
            control={control}
            name={name}
            render={({field: {onChange}}) => (
                <ModalPicker
                    label={label}
                    options={options}
                    onChange={onChange}
                />
            )}
        />
    )
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'white',
        borderRadius: 5,
    },
    option: {
        alignItems: 'center',
        padding: 15,
        borderBottomColor: '#aaa',
        borderBottomWidth: 1
    },
    touchableOpacity: {
        alignSelf: 'center',
        paddingHorizontal: 20,
        height: 50,
        marginBottom: 10,
        borderRadius: 4,
        borderColor: colors.white,
        borderWidth: 1,
        width: '95%',
        alignItems: 'stretch',
        justifyContent: 'space-around',
        backgroundColor: colors.white,

    },
    text: {
        color: colors.primary,
        fontSize: 16,
    }
});

export default ControlledModalPicker;