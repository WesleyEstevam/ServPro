import React, {useState} from 'react';
import { colors } from '../../styles';

import {
  Label,
  RadioContainer,
  RadioContent,
  RadioButtonContainer,
  RadioText,
  RadioIcon,
} from './styles';

function RadioButton({label, options, onChange}) {
  const [selected, setSelected] = useState(null);

  function handleOnPress(optionSelected) {
    return function() {
      if(optionSelected === selected) return;

      setSelected(optionSelected);
      onChange(optionSelected);
    }

  }
  
  return (
    <RadioContainer>
      <Label>{label}</Label>
      <RadioContent>
        {options.map(({name, value}, index) => (
          <RadioButtonContainer
            key={`${value}-${index}`}
            selected={value === selected}
            lastChild={index === options.length - 1}
            onPress={handleOnPress(value)}
          >
            <RadioIcon
              name={value === selected? 'radio-button-checked' : 'radio-button-unchecked'}
              color={value === selected? colors.primary : '#bbb'}
              size={24}
            />
            <RadioText>{name}</RadioText>
          </RadioButtonContainer>
        ))}
      </RadioContent>
    </RadioContainer>
  );
}

export default RadioButton;
