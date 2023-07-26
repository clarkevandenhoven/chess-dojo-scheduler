import { useRef } from 'react';
import { Move } from '@jackstenglein/chess';
import { Card } from '@mui/material';

import Result from './Result';
import Variation from './Variation';
import GameComment from './GameComment';

interface PgnTextProps {
    onClickMove: (m: Move) => void;
}

const PgnText: React.FC<PgnTextProps> = ({ onClickMove }) => {
    const ref = useRef<HTMLDivElement>(null);

    const handleScroll = (child: HTMLButtonElement | null) => {
        const scrollParent = ref.current;
        if (child && scrollParent) {
            const parentRect = scrollParent.getBoundingClientRect();
            const childRect = child.getBoundingClientRect();

            scrollParent.scrollTop =
                childRect.top -
                parentRect.top +
                scrollParent.scrollTop -
                scrollParent.clientHeight / 2;
        }
    };

    return (
        <Card ref={ref} sx={{ overflowY: 'scroll' }}>
            <GameComment />
            <Variation handleScroll={handleScroll} onClickMove={onClickMove} />
            <Result />
        </Card>
    );
};

export default PgnText;
