'use client';
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Flex, Image, Text, Box, HStack } from '@chakra-ui/react';
import Link from 'next/link';
import ProgressComponent from '@/components/progress';

export interface Volume {
  name: string;
  mount_point: string;
  available_space: number;
  total_space: number;
  disk_usage: {
    percentage: number;
    used: number;
  };
}

export default function Volumes() {
  const [volumes, setVolumes] = useState<Volume[]>([]);

  const getVolumes = async () => {
    const volumes = await invoke<Volume[]>('get_volumes');
    setVolumes(volumes);
  };
  useEffect(() => {
    getVolumes().catch((e) => 'Failed to get volumes' + e);
  }, []);

  return (
    <Flex gap={2} flexWrap={'wrap'}>
      {volumes.map((volume, idx) => (
        <Link href={`/files?path=${volume.mount_point}`} key={idx}>
          <HStack
            px={3}
            py={1}
            rounded={'md'}
            _hover={{
              backgroundColor: 'purple.100',
            }}
            align={'center'}
            justify={'center'}
          >
            <Image src={'/mac-disk.ico'} alt={volume.name} w={'59px'} />
            <Box pb={1}>
              <Text fontWeight={500} width={'200px'}>
                {volume.name}
              </Text>
              <Text fontWeight={500} fontSize={'xs'} mb={1}>
                Usage {volume.disk_usage.used} / {volume.total_space}{' '}
              </Text>
              <ProgressComponent percentage={volume.disk_usage.percentage} />
            </Box>
          </HStack>
        </Link>
      ))}
    </Flex>
  );
}
