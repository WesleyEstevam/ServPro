import styled from 'styled-components/native';

import { colors } from '../../../styles';

export const Title = styled.Text`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: ${colors.primary};
  margin: 20px 0;
`;

export const SubTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${colors.dark};
  margin-left: 11px;
  margin-bottom: 10px;
  margin-top: 10px;
`;