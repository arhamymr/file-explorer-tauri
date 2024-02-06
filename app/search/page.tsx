import Search from '@/components/search';
import SearchBar from '@/components/search/searchbar';
import { Text } from '@chakra-ui/react';
import Link from 'next/link';

export default function ExploreFiles() {
  return (
    <>
      <Link href="/">
        <Text mb={4}> Back </Text>
      </Link>
      <SearchBar />
      <Search />
    </>
  );
}
