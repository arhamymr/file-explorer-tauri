"use client";
import {
  Box,
  Button,
  Text,
  Image,
  HStack,
  Stack,
  Divider,
  Spacer,
} from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api/tauri";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface DirItem {
  name: string;
  path: string;
  is_dir: boolean;
  size: number;
  last_modified: string;
  metadata: {
    is_file: boolean;
    is_dir: boolean;
    modified: string;
    accessed: string;
    created: string;
  };
}

export default function Files() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const path = searchParams.get("path") || "/";

  const [dir, setDir] = useState<DirItem[]>([]);

  useEffect(() => {
    const getDirectory = async () => {
      try {
        const directory: DirItem[] = await invoke("read_directory", { path });
        setDir(directory);
      } catch (error) {
        console.log(error);
      }
    };

    getDirectory();
  }, [path]);

  const handleNewFolder = async () => {
    const getDirectory = async () => {
      try {
        const directory: DirItem[] = await invoke("read_directory", { path });
        setDir(directory);
      } catch (error) {
        console.log(error);
      }
    };

    try {
      await invoke("create_directory", {
        path,
        folderName: "New Folder",
      });
      getDirectory();
    } catch (error) {
      console.log(error);
    }
  };

  console.log(dir);
  return (
    <>
      <Button onClick={() => router.back()}> Back </Button>
      <button onClick={handleNewFolder}>Create new folder</button>
      <Text>{path}</Text>

      <HStack px={3} py={1} rounded={"md"} cursor={"pointer"}>
        <Box>
          <Text fontSize={"sm"}>Name</Text>
        </Box>
        <Spacer />
        <Text w={160} textAlign={"left"}>
          Modified date
        </Text>
        <Text w={50} textAlign={"center"}>
          Size
        </Text>
      </HStack>
      <Divider />

      {dir.map((file, idx) => (
        <Link href={`/files?path=${file.path}`} key={idx}>
          <HStack
            key={idx}
            px={3}
            py={1}
            rounded={"md"}
            cursor={"pointer"}
            _hover={{
              backgroundColor: "purple.100",
            }}
          >
            {file.metadata.is_file && (
              <Image src={"/file.ico"} alt={file.name} w={"25px"} px={"2px"} />
            )}
            {file.metadata.is_dir && (
              <Image src={"/folder.ico"} alt={file.name} w={"25px"} />
            )}
            <Box>
              <Text fontSize={"sm"}>{file.name}</Text>
            </Box>
            <Spacer />
            <Text minW={160} fontSize={"sm"} textAlign={"left"}>
              {file.metadata.modified}
            </Text>
            {file.metadata.is_file ? (
              <Text minW={50} textAlign={"center"}>
                {file.size}
              </Text>
            ) : (
              <Text minW={50} textAlign={"center"}>
                --
              </Text>
            )}
          </HStack>
          <Divider />
        </Link>
      ))}
    </>
  );
}
