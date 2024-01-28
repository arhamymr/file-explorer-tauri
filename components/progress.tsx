'use client';
// progress

import React from 'react';

import { Box, Progress } from '@chakra-ui/react';

interface ProgressProps {
  percentage: number;
}

function changeColor(percentage: number) {
  if (percentage < 50) {
    return 'green';
  } else if (percentage < 80) {
    return 'yellow';
  } else {
    return 'red';
  }
}

export default function ProgressComponent({ percentage }: ProgressProps) {
  return (
    <Box>
      <Progress
        value={percentage}
        size="xs"
        rounded={'md'}
        colorScheme={changeColor(percentage)}
      />
    </Box>
  );
}
