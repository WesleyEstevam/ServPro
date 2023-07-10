import React from 'react';
import {Button, TextButton} from './styles';

export default function ButtonDefault({
  children,
  screenName,
  styleButton,
  ...rest
}) {

  return (
    <Button
      style={styleButton}
      {...rest}>
      <TextButton>{children}</TextButton>
    </Button>
  );
}
