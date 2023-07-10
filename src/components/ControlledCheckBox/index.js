import React, { useState } from 'react';
import {Controller} from 'react-hook-form';
import {CheckBox} from 'react-native-elements';
import { colors } from '../../styles';
import { styles } from './styles';

function ControlledCheckBox({
  control,
  name,
  label,
  checked = false,
  value: userValue
}) {
  const [isChecked, setIsChecked] = useState(checked)

  if (checked == true){
    console.log(checked);
    
  }
  function handleOnPress(onChange) {
    return function () {
      setIsChecked(!isChecked)
      if (isChecked) {
        onChange(userValue)
        return
      }
      onChange(undefined)  
    }
  }
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={isChecked}
      render={({field: {onChange}}) => (
        <CheckBox
          title={label}
          containerStyle={styles.checkBox(isChecked)}
          checkedColor={colors.primary}
          checked={isChecked}
          onPress={handleOnPress(onChange)}
        />
      )}
    />
  );
}

export default ControlledCheckBox;
