import React from 'react';
import {Controller} from 'react-hook-form';
import {Input} from 'react-native-elements';
import { colors } from '../../styles';

function ControlledInput({
  control,
  name,
  rules,
  label,
  editable = true,
  type,
  errorMessage,
  textarea,
  ...rest
}) {

  function getTextareaStyle(isTextarea) {
    if (isTextarea) {
      return {
        inputStyle: {textAlignVertical: 'top', height: 120},
        numberOfLines: 7,
        multiline: true,
      }
    }
    return;
  }
  
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {value, onChange, onBlur}}) => (
        <Input
        id={value}
          labelStyle={{color: colors.darker}}
          label={label}
          value={value}
          onBlur={onBlur}
          onChangeText={onChange}
          editable={editable}
          keyboardType={type}
          errorMessage={errorMessage}
          {...getTextareaStyle(textarea)}
          {...rest}
        />
      )}
    />
  );
}

export default ControlledInput;
