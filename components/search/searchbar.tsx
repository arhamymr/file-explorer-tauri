// search bar using chakra ui
'use client';

import {
  Spacer,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';

  const [search, setSearch] = useState<string>('');

  return (
    <Flex mb={4}>
      <Spacer />
      <InputGroup maxW={'300px'}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
          defaultValue={keyword}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              router.push(`/search?keyword=${search}`);
            }
          }}
        />
      </InputGroup>
    </Flex>
  );
}
