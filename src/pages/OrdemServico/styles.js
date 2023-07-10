import styled from "styled-components/native";
import { colors } from "../../styles";



export const Container = styled.View`
    flex: 1;
    background-color: ${colors.white};
`;

export const ModalHeader = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
`;

export const CloseModalButton = styled.TouchableOpacity`
    padding: 5px;
    background-color: #eee;
    border-radius: 5px;
`;
