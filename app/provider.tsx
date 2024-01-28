import { ChakraProvider } from '@chakra-ui/react';

export default function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ChakraProvider>{children}</ChakraProvider>;
}
