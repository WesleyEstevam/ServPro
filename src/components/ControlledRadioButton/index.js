import React from 'react';
import { Controller } from 'react-hook-form';

import RadioButton from '../RadioButton';

function ControlledRadioButton({
  control,
  name,
  label,
  options,
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({field: {value, onChange}}) => (
        <RadioButton
          options={options}
          onChange={onChange}
          label={label}

        />
      )}
    />
  );
}

export default ControlledRadioButton;
