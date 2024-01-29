'use client';
import { Box, Button, Text, Image, HStack, Stack } from '@chakra-ui/react';
import { invoke } from '@tauri-apps/api/tauri';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DirItem {
  name: string;
  path: string;
  is_dir: boolean;
  size: number;
  last_modified: string;
}

export default function Files() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const path = searchParams.get('path') || '/';

  const [dir, setDir] = useState<DirItem[]>([]);

  useEffect(() => {
    const getDirectory = async () => {
      try {
        const directory: DirItem[] = await invoke('read_directory', { path });
        setDir(directory);
      } catch (error) {
        console.log(error);
      }
    };

    getDirectory();
  }, [path]);

  console.log(dir, 'dir');
  return (
    <>
      <Button onClick={() => router.back()}> Back </Button>
      {dir.map((file, idx) => (
        <Link href={`/files?path=${file.path}`} key={idx}>
          <HStack
            key={idx}
            px={3}
            py={1}
            rounded={'md'}
            cursor={'pointer'}
            _hover={{
              backgroundColor: 'purple.100',
            }}
          >
            <Image src={'/mac-disk.ico'} alt={file.name} w={'30px'} />
            <Box>
              <Text fontSize={'sm'}>{file.name}</Text>
            </Box>
            <Text>{file.size}</Text>
          </HStack>
        </Link>
      ))}
    </>
  );
}
