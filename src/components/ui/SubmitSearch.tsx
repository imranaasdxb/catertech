"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { MAX_SEARCH_LENGTH, MIN_SEARCH_LENGTH, normalizeSearch } from "@/lib/search";

type Props = {
  value: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  id?: string;
  label?: string;
  className?: string;
  inputClassName?: string;
  loading?: boolean;
};

export default function SubmitSearch({
  value, onSearch, placeholder, id, label = "Search", className = "",
  inputClassName = "w-full rounded-lg border border-admin-border bg-white py-2.5 text-sm text-admin-ink outline-none focus:ring-2 focus:ring-admin-accent/15",
  loading = false,
}: Props) {
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
    inputRef.current?.setCustomValidity("");
  }, [value]);

  return (
    <form
      role="search"
      aria-label={label}
      className={`relative min-w-0 ${className}`}
      onSubmit={(event) => {
        event.preventDefault();
        const query = normalizeSearch(draft);
        if (query && query.length < MIN_SEARCH_LENGTH) {
          inputRef.current?.setCustomValidity(`Enter at least ${MIN_SEARCH_LENGTH} characters.`);
          inputRef.current?.reportValidity();
          return;
        }
        setDraft(query);
        onSearch(query);
      }}
    >
      <input
        ref={inputRef}
        id={id}
        type="search"
        aria-label={label}
        value={draft}
        maxLength={MAX_SEARCH_LENGTH}
        enterKeyHint="search"
        autoComplete="off"
        placeholder={placeholder}
        className={`${inputClassName} [&::-webkit-search-cancel-button]:appearance-none`}
        style={{ paddingLeft: "2.75rem", paddingRight: "2.5rem" }}
        onChange={(event) => {
          event.currentTarget.setCustomValidity("");
          setDraft(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && event.nativeEvent.isComposing) event.preventDefault();
        }}
      />
      <button
        type="submit"
        aria-label={label}
        title={label}
        disabled={loading && normalizeSearch(draft) === value}
        className="absolute left-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-current opacity-60 hover:opacity-100 focus-visible:outline-2 disabled:cursor-wait"
      >
        {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Search className="size-4" aria-hidden />}
      </button>
      {draft || value ? (
        <button
          type="button"
          aria-label="Clear search"
          title="Clear search"
          className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-current opacity-60 hover:opacity-100 focus-visible:outline-2"
          onClick={() => {
            setDraft("");
            inputRef.current?.setCustomValidity("");
            if (value) onSearch("");
            inputRef.current?.focus();
          }}
        >
          <X className="size-4" aria-hidden />
        </button>
      ) : null}
    </form>
  );
}
