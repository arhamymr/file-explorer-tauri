'use client';

import { Heading, Divider } from '@chakra-ui/react';
import Volumes from '../components/volumes';
import Search from '@/components/search/searchbar';

export default function Home() {
  return (
    <>
      <Search />
      <Heading size={'md'}> Storage </Heading>
      <Divider my={2} />
      <Volumes />
    </>
  );
}
