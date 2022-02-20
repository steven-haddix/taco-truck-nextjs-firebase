import React from 'react';
import styled from 'styled-components';

export const barColors = [
    '#f05b6f',
    '#f3616e',
    '#f5676d',
    '#f76c6c',
    '#f9726c',
    '#fb7969',
    '#fd7f67',
    '#ff8665',
    '#ff8f61',
    '#ff985e',
    '#fea25b',
    '#fcab5a'
];

const barCount = barColors.length;

export const calculateBarIndex = (currentIndex) => {
    if (!currentIndex) {
        return 0;
    }

    const indexMod = currentIndex % barCount;
    const dividedIndex = currentIndex / barCount

    if (dividedIndex % 2 > 1) {
        return barCount - indexMod - 1
    }

    return indexMod
}

const Bar = styled.div`
    align-items: center;
    background-color: ${props => barColors[calculateBarIndex(props.colorIndex)]};
    height: 100%;
    width: ${({ percent }) => percent ? percent : '0'}%;
`

export default ({ percent, colorIndex, children }) => (
    <Bar percent={percent} colorIndex={colorIndex}>{children}</Bar>
)