import { useMemo, useState } from "react"
import { CheckSquare2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

function parseTasks(tasks: string | string[]) {
  if (Array.isArray(tasks)) return tasks.filter(Boolean)

  return tasks
    .split("\n")
    .map((line) => line.replace(/^[-*\d.\s]+/, "").trim())
    .filter((line) => line.length > 2)
}

export function TasksPanel({ tasks }: { tasks: string | string[] }) {
  const parsedTasks = useMemo(() => parseTasks(tasks), [tasks])
  const [selected, setSelected] = useState<string[]>([])

  function toggle(task: string) {
    setSelected((current) => (current.includes(task) ? current.filter((item) => item !== task) : [...current, task]))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <Badge>{selected.length} selected</Badge>
      </div>

      <div className="space-y-3">
        {parsedTasks.length ? (
          parsedTasks.map((task) => {
            const active = selected.includes(task)

            return (
              <button
                key={task}
                type="button"
                onClick={() => toggle(task)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border p-4 text-left text-sm leading-6 transition hover:border-primary/30 hover:bg-white/[0.06]",
                  active ? "border-primary/40 bg-primary/10" : "border-white/10 bg-white/[0.035]"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-5 shrink-0 place-items-center rounded border",
                    active ? "border-primary bg-primary text-primary-foreground" : "border-white/20"
                  )}
                >
                  {active ? <CheckSquare2 className="size-3.5" /> : null}
                </span>
                <span>{task}</span>
              </button>
            )
          })
        ) : (
          <p className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-muted-foreground">
            No tasks were extracted for this meeting.
          </p>
        )}
      </div>
    </div>
  )
}
