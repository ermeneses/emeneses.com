"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./command-palette.module.css";

type CommandItem = {
  id: string;
  section: string;
  title: string;
  hotkey?: string;
  url?: string;
  icon?: string;
  action?: "print";
};

type Props = {
  commands: CommandItem[];
};

function hotkeyLabel(hotkey: string) {
  return hotkey.replace("ctrl", "cmd/ctrl");
}

function matchesHotkey(event: KeyboardEvent, hotkey: string) {
  const [modifier, key] = hotkey.toLowerCase().split("+");
  if (!modifier || !key) return false;

  const modPressed =
    modifier === "ctrl" ? event.ctrlKey || event.metaKey : event.metaKey;

  return modPressed && event.key.toLowerCase() === key;
}

function groupBySection(items: CommandItem[]) {
  const map = new Map<string, CommandItem[]>();
  items.forEach((item) => {
    const current = map.get(item.section) ?? [];
    current.push(item);
    map.set(item.section, current);
  });
  return Array.from(map.entries());
}

export default function CommandPalette({ commands }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return commands;

    return commands.filter((command) => {
      const haystack = `${command.title} ${command.section} ${command.hotkey ?? ""}`;
      return haystack.toLowerCase().includes(normalized);
    });
  }, [commands, query]);

  const grouped = useMemo(() => groupBySection(filtered), [filtered]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  const runCommand = (command?: CommandItem) => {
    if (!command) return;

    if (command.action === "print") {
      window.print();
      setOpen(false);
      return;
    }

    if (command.url) {
      window.open(command.url, "_blank", "noopener,noreferrer");
      setOpen(false);
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      if (!open) {
        const matched = commands.find(
          (command) => command.hotkey && matchesHotkey(event, command.hotkey)
        );

        if (matched) {
          event.preventDefault();
          runCommand(matched);
        }
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prev) =>
          Math.min(prev + 1, Math.max(filtered.length - 1, 0))
        );
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        runCommand(filtered[selectedIndex]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [commands, filtered, open, selectedIndex]);

  return (
    <div className={styles.wrapper}>
      <footer className={styles.footer}>
        Pulsa <kbd className={styles.kbd}>Cmd</kbd> +{" "}
        <kbd className={styles.kbd}>K</kbd> para abrir la paleta de comandos.
      </footer>

      <button
        type="button"
        className={styles.mobileButton}
        aria-label="Abrir paleta de comandos"
        onClick={() => setOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 9a2 2 0 1 1 2 -2v10a2 2 0 1 1 -2 -2h10a2 2 0 1 1 -2 2v-10a2 2 0 1 1 2 2h-10" />
        </svg>
      </button>

      {open ? (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <div className={styles.palette} role="dialog" aria-modal="true">
            <div className={styles.inputWrap}>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelectedIndex(0);
                }}
                className={styles.input}
                placeholder="Buscar comando"
              />
            </div>

            <div className={styles.results}>
              {filtered.length === 0 ? (
                <p className={styles.empty}>Sin resultados.</p>
              ) : (
                grouped.map(([section, sectionCommands]) => (
                  <div key={section} className={styles.section}>
                    <p className={styles.sectionTitle}>{section}</p>
                    {sectionCommands.map((command) => {
                      const absoluteIndex = filtered.findIndex(
                        (item) => item.id === command.id
                      );

                      return (
                        <button
                          key={command.id}
                          type="button"
                          className={`${styles.command} ${
                            absoluteIndex === selectedIndex ? styles.commandActive : ""
                          }`}
                          onMouseEnter={() => setSelectedIndex(absoluteIndex)}
                          onClick={() => runCommand(command)}
                        >
                          <span className={styles.commandLeft}>
                            <span className={styles.icon}>{command.icon ?? "→"}</span>
                            <span className={styles.commandTitle}>{command.title}</span>
                          </span>
                          {command.hotkey ? (
                            <span className={styles.hotkey}>
                              {hotkeyLabel(command.hotkey)}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
