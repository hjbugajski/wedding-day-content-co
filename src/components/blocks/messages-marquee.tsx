import { Marquee, MarqueeContent, MarqueeFade } from '@/components/ui/marquee';
import type { PayloadMessagesMarqueeBlock } from '@/payload/payload-types';

export function MessagesMarqueeBlock({ messages }: PayloadMessagesMarqueeBlock) {
  if (!messages?.length) {
    return null;
  }

  const duplicatedMessages = messages.concat(messages).map(({ content }, i) => (
    <div
      key={i}
      className="relative isolate max-w-72 shrink-0 overflow-clip rounded-sm bg-neutral-100/75 p-4 text-center text-base text-balance shadow-lg ring-2 shadow-neutral-500/10 ring-neutral-200 md:max-w-80 md:p-6 md:text-lg dark:bg-neutral-900 dark:shadow-neutral-600/10 dark:ring-neutral-800"
    >
      {content}
      <div className="absolute -z-10 h-32 w-48 rotate-45 rounded-full bg-dusty-rose-300/15 blur-3xl group-odd:top-1/4 group-odd:-right-1/4 group-even:top-1/2 group-even:right-1/4 dark:bg-dusty-rose-800/15" />
    </div>
  ));

  return (
    <Marquee className="overflow-hero overflow-hidden py-6">
      <MarqueeContent className="flex shrink-0 flex-row items-center gap-8 whitespace-normal">
        {duplicatedMessages}
      </MarqueeContent>
      <MarqueeContent
        duplicate
        className="flex shrink-0 flex-row items-center gap-8 whitespace-normal"
      >
        {duplicatedMessages}
      </MarqueeContent>
      <MarqueeFade side="left" />
      <MarqueeFade side="right" />
    </Marquee>
  );
}
