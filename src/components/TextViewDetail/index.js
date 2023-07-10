import React from 'react';
import {TouchableHighlight, View} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';

import {styles} from './styles';

export default function TextViewDetail({title, text, rightButton}) {
  return (
    <ListItem containerStyle={styles.ItemContainer}>
      <ListItem.Content>
        <ListItem.Title>{title}</ListItem.Title>
        <ListItem.Subtitle>{text}</ListItem.Subtitle>
      </ListItem.Content>

      {rightButton}
      
    </ListItem>
  );
}
