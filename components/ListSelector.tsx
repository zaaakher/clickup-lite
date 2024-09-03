// /components/ListSelector.tsx
import { useEffect, useState } from "react";

interface List {
  id: string;
  name: string;
}

export default function ListSelector({
  onSelect,
}: {
  onSelect: (listId: string) => void;
}) {
  const [lists, setLists] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLists() {
      try {
        const response = await fetch("/api/getLists");
        if (!response.ok) {
          throw new Error("Failed to fetch lists");
        }
        const data: List[] = await response.json();
        setLists(data);
      } catch (error) {
        setError((error as Error).message);
      }
    }

    fetchLists();
  }, []);

  const handleSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const listId = e.target.value;
    setSelectedList(listId);
    onSelect(listId);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Select a List</h2>
      <select onChange={handleSelection} value={selectedList || ""}>
        <option value="" disabled>
          Select a list
        </option>
        {lists.map((list) => (
          <option key={list.id} value={list.id}>
            {list.name}
          </option>
        ))}
      </select>
    </div>
  );
}
