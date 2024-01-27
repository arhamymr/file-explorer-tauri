'use client';

import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

interface Volumes {
  name: string;
  path: string;
}
export default function Home() {
  const [volumes, setVolumes] = useState<Volumes[]>([]);

  const getVolumes = async () => {
    const volumes = await invoke<Volumes[]>('get_volumes');
    setVolumes(volumes);
  };
  useEffect(() => {
    getVolumes().catch((e) => 'Failed to get volumes' + e);
  }, [volumes]);

  console.log(volumes, 'volums');

  return <div>hellow</div>;
}
