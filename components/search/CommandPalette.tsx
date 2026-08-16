"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchResult {
  type: string;
  title: string;
  slug: string;
  content: string;
}

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    fetch("/api/search")
      .then((res) => res.json())
      .then((data) => setResults(data));
  }, [open]);

  const filteredResults = React.useMemo(() => {
    if (!query) return results;
    const lowerQuery = query.toLowerCase();
    
    return results.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(lowerQuery);
      const matchBody = item.content.toLowerCase().includes(lowerQuery);
      return matchTitle || matchBody;
    }).sort((a, b) => {
      // Rank exact title matches higher
      const aTitleMatch = a.title.toLowerCase().includes(lowerQuery);
      const bTitleMatch = b.title.toLowerCase().includes(lowerQuery);
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      return 0;
    });
  }, [query, results]);

  const groups = React.useMemo(() => {
    const grouped: Record<string, SearchResult[]> = {};
    for (const item of filteredResults) {
      if (!grouped[item.type]) grouped[item.type] = [];
      grouped[item.type].push(item);
    }
    return grouped;
  }, [filteredResults]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 hover:bg-muted px-3 py-1.5 rounded-md transition-colors"
      >
        <Search className="w-4 h-4" />
        <span>Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 bg-background border px-1.5 rounded text-[10px] font-medium font-mono text-muted-foreground ml-4">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="fixed left-[50%] top-[20%] z-50 w-full max-w-lg translate-x-[-50%] bg-background border rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <Command className="flex flex-col w-full h-full" label="Command Menu" shouldFilter={false}>
              <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
                <Search className="w-5 h-5 text-muted-foreground mr-2 shrink-0" />
                <Command.Input 
                  autoFocus 
                  placeholder="Type a command or search..." 
                  className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  value={query}
                  onValueChange={setQuery}
                />
              </div>
              <Command.List className="max-h-[300px] overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                  No results found.
                </Command.Empty>
                
                {Object.entries(groups).map(([type, items]) => (
                  <Command.Group key={type} heading={type} className="px-2 py-1.5 text-xs font-medium text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground">
                    {items.map((item) => (
                      <Command.Item
                        key={item.slug}
                        onSelect={() => {
                          setOpen(false);
                          router.push(item.slug);
                        }}
                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
                      >
                        {item.title}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}
