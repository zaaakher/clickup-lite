// components/SpacesList.tsx
import { useEffect, useState } from "react";

interface Space {
  id: string;
  name: string;
}

export default function SpacesList() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpaces() {
      try {
        const response = await fetch("/api/getSpaces");
        if (!response.ok) {
          throw new Error("Failed to fetch spaces");
        }
        const data: Space[] = await response.json();
        setSpaces(data);
      } catch (error) {
        setError((error as Error).message);
      }
    }

    fetchSpaces();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Your Spaces</h1>
      <ul>
        {spaces.map((space) => (
          <li key={space.id}>{space.name}</li>
        ))}
      </ul>
    </div>
  );
}
