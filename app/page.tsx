'use client';

import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import {
  Flex,
  Image,
  VStack,
  Text,
  Progress,
  Stack,
  Box,
  HStack,
} from '@chakra-ui/react';
import Link from 'next/link';
interface Volumes {
  name: string;
  mount_point: string;
  available_space: number;
  total_space: number;
  disk_usage: {
    percentage: number;
    used: number;
  };
}
export default function Home() {
  const [volumes, setVolumes] = useState<Volumes[]>([]);

  const getVolumes = async () => {
    const volumes = await invoke<Volumes[]>('get_volumes');
    setVolumes(volumes);
  };
  useEffect(() => {
    getVolumes().catch((e) => 'Failed to get volumes' + e);
  }, []);

  console.log(volumes);

  return (
    <Flex gap={1}>
      {volumes.map((volume, idx) => (
        <Link href={volume.mount_point} key={idx}>
          <HStack
            px={3}
            py={1}
            rounded={'md'}
            _hover={{
              backgroundColor: 'purple.100',
            }}
          >
            <Image src={'/mac-disk.ico'} alt={volume.name} w={50} />
            <Box>
              <Text fontWeight={500}>{volume.name}</Text>
              <Text fontWeight={500} fontSize={'xs'}>
                Usage {volume.disk_usage.used} / {volume.total_space}{' '}
              </Text>
            </Box>
          </HStack>
        </Link>
      ))}
    </Flex>
  );
}
