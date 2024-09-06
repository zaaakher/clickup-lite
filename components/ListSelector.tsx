// /components/ListSelector.tsx
import { useEffect, useState } from "react";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
interface List {
  id: string;
  name: string;
}

export default function ListSelector({
  onSelect,
}: {
  onSelect: (listId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

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
  console.log(lists);
  return (
    <div className="p-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? lists.find((list) => list.name === value)?.name
              : "Select a list..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search a list..." />
            <CommandList>
              <CommandEmpty>No lists found.</CommandEmpty>
              <CommandGroup>
                {lists.map((list) => (
                  <CommandItem
                    key={list.name}
                    value={list.name}
                    onSelect={(currentValue) => {
                      console.log("currentValue", currentValue);
                      setValue(currentValue === value ? "" : currentValue);
                      onSelect(list.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === list.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {list.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
