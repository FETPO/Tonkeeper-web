import React, { FC } from "react";
import styled from "styled-components"

const Block = styled.div`
    background: gray;
`;

export interface AssetProps {
    symbol: string;
}
export const Asset: FC<AssetProps> = ({ symbol }) => {
    return <Block>{symbol}</Block>;
}