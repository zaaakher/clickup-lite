// /components/TaskList.tsx
import { useEffect, useState } from "react";

interface Task {
  id: string;
  name: string;
  custom_id: string;
  status: { status: string };
}
interface Status {
  status: string;
  color: string;
}

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "./ui/checkbox";

export default function TaskList({ listId }: { listId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(`/api/getTasks?listId=${listId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data: Task[] = await response.json();
        setTasks(data);

        // Fetch allowed statuses
        const statusesResponse = await fetch(
          `/api/listStatuses?listId=${listId}`
        );
        if (!statusesResponse.ok) {
          throw new Error("Failed to fetch statuses");
        }
        const statusesData = await statusesResponse.json();
        setStatuses(statusesData.statuses);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [listId]);

  const handleCheckboxChange = async (taskId: string, isChecked: boolean) => {
    try {
      const response = await fetch(`/api/updateTaskStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId,
          status: isChecked ? "complete" : "Open",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }

      // Update task status in local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: { status: "closed" } } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <Table>
        <TableCaption>A list of your tasks.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[200px]">ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <Checkbox
                  checked={task.status.status === "closed"}
                  onCheckedChange={(e) =>
                    handleCheckboxChange(task.id, e as boolean)
                  }
                />
              </TableCell>
              <TableCell>{task.name}</TableCell>
              <TableCell className="font-medium">
                {task.custom_id || task.id}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
