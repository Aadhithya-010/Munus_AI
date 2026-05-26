import { Outlet } from "react-router-dom"
import { BadgeCheck, BrainCircuit, MessageSquareText } from "lucide-react"

export function AuthLayout() {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg border border-primary/30 bg-primary/15 text-primary">
            <BrainCircuit className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">MUNUS AI</p>
            <p className="text-xs text-muted-foreground">Meeting intelligence platform</p>
          </div>
        </div>

        <div className="max-w-xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-primary">AI workspace</p>
          <h1 className="text-5xl font-semibold tracking-normal">
            Meetings become decisions, tasks, and answers.
          </h1>
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            MUNUS AI turns transcripts, audio, and video into a workspace-native memory layer for your team.
          </p>
        </div>

        <div className="grid gap-3 text-sm text-muted-foreground">
          {[
            ["Workspace-aware memory", BadgeCheck],
            ["Semantic meeting chat", MessageSquareText],
            ["Tasks and summaries", BrainCircuit],
          ].map(([label, Icon]) => (
            <div key={label as string} className="flex items-center gap-3">
              <Icon className="size-4 text-primary" />
              {label as string}
            </div>
          ))}
        </div>
      </section>
      <section className="flex min-h-screen items-center justify-center px-4 py-10">
        <Outlet />
      </section>
    </main>
  )
}
