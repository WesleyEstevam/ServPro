import styled from 'styled-components/native';
import { colors, fonts } from '../../styles';

export const MarkerStyle = styled.View`
  width: 100px;
`;

export const MapCard = styled.View`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  margin: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  elevation: 2;
`;

export const MapCardHeader = styled.View`
  padding-left: 5px;
  flex-direction: row;
  align-items: center;
`;

export const MapCardHeaderText = styled.Text`
  font-size: 20px;
  flex: 1;
`;

export const MapCardHeaderButton = styled.TouchableOpacity`
  padding: 5px;
  border-radius: 5px;
  background-color: #eee;
`;

export const MapCardContent = styled.View`
  padding: 15px 0;
`;

export const MapCardInfo = styled.View`
  flex-direction: row;
  margin-right: 15px;
`;

export const MapCardInfoText = styled.Text`
  font-size: ${fonts.big}px;
  flex: 1;
`;

export const MapCardFooter = styled.View`
  /* margin: 0 -10px; */
`;

export const MapCardButton = styled.TouchableOpacity`
  height: 50px;
  width: 100%;
  background-color: ${colors.primary};
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  padding: 10px;
`;

export const MapCardButtonText = styled.Text`
  color: ${colors.white};
  font-size: ${fonts.bigger}px;
`;

export const FetchOsTooltip = styled.View`
  position: absolute;
  top: 0;
  margin: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 50px;
  elevation: 2;
  flex-direction: row;
  align-self: center;
`;

export const FetchOsTooltipText = styled.Text`
  margin-right: 10px;
`;
