import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Input } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import MonthPicker from 'react-native-month-year-picker';
import {Controller} from 'react-hook-form';
import format from 'date-fns/format';
import { colors } from '../../styles';


function ControlledDateTimePicker({
  control,
  name,
  label,
  mode,
}) {

  const [dateInput, setDateInput] = useState();
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  
  function showDatePicker() {
    setDatePickerVisible(true);
  }
  
  function onDatePickerChange(onChange) {
    return function(event, selectedDate) {
      setDatePickerVisible(false);
  
      if(!selectedDate) return;

      setDateInput(format(new Date(selectedDate), 'dd/MM/yyyy'));
      onChange(selectedDate);
    }
  }

  function onMonthPickerChange(onChange) {
    return function(event, selectedDate) {
      setDatePickerVisible(false);
  
      if(!selectedDate) return;

      setDateInput(format(new Date(selectedDate), 'MM/yyyy'));
      onChange(selectedDate);
    }
  }
  
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={showDatePicker}
      >
        <Input
          label={label}
          labelStyle={{color: colors.darker}}
          value={dateInput}
          editable={false}
        />
      </TouchableOpacity>

      {
        mode === 'month'? (
          <Controller
            control={control}
            name={name}
            render={({field: {value, onChange}}) =>
            datePickerVisible && (
                <MonthPicker
                  testID="MonthPicker"
                  value={value || new Date()}
                  onChange={onMonthPickerChange(onChange)}
                  okButton="Ok"
                  cancelButton="Cancelar"
                />
              )
            }
          />
        ) : (
          <Controller
            control={control}
            name={name}
            render={({field: {value, onChange}}) =>
            datePickerVisible && (
                <DateTimePicker
                  date={new Date()}
                  testID="DatePicker"
                  value={value || new Date()}
                  mode={'date'}
                  display="spinner"
                  // minimumDate={new Date()}
                  onChange={onDatePickerChange(onChange)}
                />
              )
            }
          />
        )
      }

      
    </>
  );
}

export default ControlledDateTimePicker;
