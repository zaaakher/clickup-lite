// /pages/index.tsx
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import SpacesList from "@/components/SpacesList";
import ListSelector from "@/components/ListSelector";
import TaskList from "@/components/TaskList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
      <div className="h-full flex justify-center items-center">
        <Link href="/api/auth/redirect">
          <Button>Connect ClickUp</Button>
        </Link>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="w-full h-full">
      <div className="w-full p-4 ">
        <h2>Selected List ID: {selectedListId}</h2>
        <ListSelector onSelect={handleListSelect} />
        {selectedListId && <TaskList listId={selectedListId} />}
      </div>
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
