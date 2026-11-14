import { ArrowRight, Bot, LoaderCircle, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  sendTravelAssistantMessage,
  type AssistantMessage,
  type TravelAssistantContext,
} from "../lib/assistantApi";

const quickPrompts = [
  "Plan a peaceful 3-day trip under ₹20,000",
  "What should I know before visiting Puri?",
  "Help me choose a family-friendly destination",
];

export default function TravelAssistantChat({
  compact = false,
  context,
}: {
  compact?: boolean;
  context?: TravelAssistantContext;
}) {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      role: "assistant",
      content: "Hi! I’m your WayNexa travel guide. Tell me where you’re thinking of going, your dates, budget, or the kind of trip you’d enjoy, and we’ll plan it together.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  const send = async (messageText: string) => {
    const content = messageText.trim();
    if (!content || isSending) return;

    const userMessage: AssistantMessage = { role: "user", content };
    const nextMessages = [...messages, userMessage].slice(-12);
    setMessages(nextMessages);
    setDraft("");
    setError("");
    setIsSending(true);

    try {
      const answer = await sendTravelAssistantMessage(nextMessages, context);
      const assistantMessage: AssistantMessage = { role: "assistant", content: answer };
      setMessages([...nextMessages, assistantMessage].slice(-12));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The assistant could not answer. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void send(draft);
  };

  return (
    <section className="flex flex-col rounded-[1.8rem] bg-[#183927] p-5 text-white shadow-xl sm:p-7">
      <header className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#d8fbcc] text-[#183927]">
          <Bot size={21} />
        </span>
        <div>
          <h2 className="font-bold">WayNexa Travel Assistant</h2>
          <p className="text-sm text-white/65">Groq AI · Your trip, planned together</p>
        </div>
        <Sparkles size={18} className="ml-auto text-[#d8fbcc]" />
      </header>

      <div
        ref={transcriptRef}
        aria-live="polite"
        aria-label="Travel assistant conversation"
        className={`mt-5 space-y-3 overflow-y-auto rounded-2xl bg-black/10 p-3 sm:p-4 ${compact ? "h-56" : "h-80"}`}
      >
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[92%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
              message.role === "user"
                ? "ml-auto rounded-tr-sm bg-white/10 text-white"
                : "rounded-tl-sm bg-[#d8fbcc] text-[#183927]"
            }`}
          >
            {message.content}
          </div>
        ))}
        {isSending && (
          <p className="flex items-center gap-2 text-sm text-white/70">
            <LoaderCircle size={15} className="animate-spin" /> WayNexa is thinking…
          </p>
        )}
      </div>

      {messages.length === 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {quickPrompts.slice(0, compact ? 2 : 3).map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => void send(prompt)}
              disabled={isSending}
              className="rounded-full border border-white/15 px-3 py-1.5 text-left text-xs text-white/80 transition hover:bg-white/10 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {error && <p role="alert" className="mt-3 text-sm font-medium text-rose-200">{error}</p>}

      <form onSubmit={submit} className="mt-4 flex items-end gap-2 rounded-xl border border-white/20 bg-white/5 p-2">
        <label className="sr-only" htmlFor={compact ? "home-travel-message" : "travel-message"}>
          Ask the travel assistant
        </label>
        <textarea
          id={compact ? "home-travel-message" : "travel-message"}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void send(draft);
            }
          }}
          maxLength={2000}
          rows={compact ? 1 : 2}
          placeholder="Ask about your next trip…"
          disabled={isSending}
          className="min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/55 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isSending || !draft.trim()}
          aria-label="Send message"
          className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#d8fbcc] text-[#183927] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowRight size={18} />
        </button>
      </form>

      <p className="mt-2 text-[11px] leading-5 text-white/55">
        Room counts, prices and bookings are not live. Verify current details with the provider.
      </p>
    </section>
  );
}
