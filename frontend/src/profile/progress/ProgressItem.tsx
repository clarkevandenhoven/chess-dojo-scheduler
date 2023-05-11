import { useState } from 'react';
import { Typography, Stack, Checkbox, Divider, IconButton, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import {
    CustomTask,
    formatTime,
    getCurrentCount,
    getTotalTime,
    isRequirement,
    Requirement,
    RequirementProgress,
    ScoreboardDisplay,
} from '../../database/requirement';
import ScoreboardProgress from '../../scoreboard/ScoreboardProgress';
import ProgressDialog from './ProgressDialog';
import RequirementModal from '../../requirements/RequirementModal';
import CustomTaskProgressItem from './CustomTaskProgressItem';

interface ProgressItemProps {
    progress?: RequirementProgress;
    requirement: Requirement | CustomTask;
    cohort: string;
    isCurrentUser: boolean;
}

const ProgressItem: React.FC<ProgressItemProps> = ({
    progress,
    requirement,
    cohort,
    isCurrentUser,
}) => {
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [showReqModal, setShowReqModal] = useState(false);

    if (!isRequirement(requirement)) {
        return (
            <CustomTaskProgressItem
                progress={progress}
                task={requirement}
                cohort={cohort}
                isCurrentUser={isCurrentUser}
            />
        );
    }

    const totalCount = requirement.counts[cohort] || 0;
    const currentCount = getCurrentCount(cohort, requirement, progress);
    const time = formatTime(getTotalTime(cohort, progress));

    let DescriptionElement = null;
    let UpdateElement = null;

    switch (requirement.scoreboardDisplay) {
        case ScoreboardDisplay.Hidden:
        case ScoreboardDisplay.Checkbox:
            UpdateElement = (
                <Checkbox
                    aria-label={`Checkbox ${requirement.name}`}
                    checked={currentCount >= totalCount}
                    onClick={() => setShowUpdateDialog(true)}
                    disabled={!isCurrentUser}
                />
            );
            break;

        case ScoreboardDisplay.ProgressBar:
        case ScoreboardDisplay.Unspecified:
            DescriptionElement = (
                <ScoreboardProgress
                    value={currentCount}
                    max={totalCount}
                    min={requirement.startCount}
                    suffix={requirement.progressBarSuffix}
                />
            );
            UpdateElement =
                currentCount >= totalCount ? (
                    <Checkbox checked onClick={() => setShowUpdateDialog(true)} />
                ) : !isCurrentUser ? null : (
                    <IconButton
                        aria-label={`Update ${requirement.name}`}
                        onClick={() => setShowUpdateDialog(true)}
                    >
                        <EditIcon />
                    </IconButton>
                );
            break;

        case ScoreboardDisplay.NonDojo:
            UpdateElement = (
                <IconButton
                    aria-label={`Update ${requirement.name}`}
                    onClick={() => setShowUpdateDialog(true)}
                >
                    <EditIcon />
                </IconButton>
            );
            break;
    }

    let requirementName = requirement.name;
    if (requirement.scoreboardDisplay === ScoreboardDisplay.Checkbox && totalCount > 1) {
        requirementName += ` (${totalCount})`;
    }

    return (
        <Stack spacing={2} mt={2}>
            {showUpdateDialog && (
                <ProgressDialog
                    open={showUpdateDialog}
                    onClose={() => setShowUpdateDialog(false)}
                    requirement={requirement}
                    cohort={cohort}
                    progress={progress}
                />
            )}
            <Grid
                container
                columnGap={0.5}
                alignItems='center'
                justifyContent='space-between'
            >
                <Grid
                    item
                    xs={9}
                    xl={
                        requirement.scoreboardDisplay === ScoreboardDisplay.NonDojo
                            ? 9
                            : 10
                    }
                    onClick={() => setShowReqModal(true)}
                    sx={{ cursor: 'pointer', position: 'relative' }}
                >
                    <Typography>{requirementName}</Typography>
                    <Typography
                        color='text.secondary'
                        dangerouslySetInnerHTML={{
                            __html: requirement.description,
                        }}
                        sx={{
                            WebkitLineClamp: 3,
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            whiteSpace: 'pre-wrap',
                        }}
                    />
                    <Typography color='primary' variant='caption'>
                        View More
                    </Typography>
                    {DescriptionElement}
                </Grid>
                <Grid item xs={2} sm='auto'>
                    <Stack
                        direction='row'
                        alignItems='center'
                        justifyContent='end'
                        spacing={1}
                    >
                        <Typography
                            color='text.secondary'
                            sx={{ display: { xs: 'none', sm: 'initial' } }}
                            noWrap
                            textOverflow='unset'
                        >
                            {time}
                        </Typography>
                        {UpdateElement}
                    </Stack>
                </Grid>
            </Grid>
            <Divider />

            {showReqModal && (
                <RequirementModal
                    open={showReqModal}
                    onClose={() => setShowReqModal(false)}
                    requirement={requirement}
                />
            )}
        </Stack>
    );
};

export default ProgressItem;
