// /pages/index.tsx
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import SpacesList from "@/components/SpacesList";
import ListSelector from "@/components/ListSelector";
import TaskList from "@/components/TaskList";

interface HomeProps {
  isAuthenticated: boolean;
}

export default function Home({ isAuthenticated }: HomeProps) {
  const [isClientAuthenticated, setIsClientAuthenticated] =
    useState(isAuthenticated);

  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const handleListSelect = (listId: string) => {
    setSelectedListId(listId);
    // You can store the selected list ID in context, state, or make an API call here
  };

  // This useEffect is not necessary if you're handling authentication fully server-side
  // But it can be useful if you plan to check additional client-side tokens
  useEffect(() => {
    setIsClientAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

  if (!isClientAuthenticated) {
    return (
      <div>
        <h1>ClickUp Lite</h1>
        <a href="/api/auth/redirect">Connect ClickUp</a>
      </div>
    );
  }

  return (
    <div>
      <h1>ClickUp Lite</h1>
      {!selectedListId ? (
        <ListSelector onSelect={handleListSelect} />
      ) : (
        <div>
          <h2>Selected List ID: {selectedListId}</h2>
          <TaskList listId={selectedListId} />
        </div>
      )}
    </div>
  );
}

// Server-side check for authentication
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookies = req.headers.cookie || "";
  const isAuthenticated = cookies.includes("clickup_token=");

  return {
    props: {
      isAuthenticated,
    },
  };
};
