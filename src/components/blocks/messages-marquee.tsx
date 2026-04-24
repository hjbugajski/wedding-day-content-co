import { Marquee, MarqueeContent, MarqueeFade } from '@/components/ui/marquee';
import type { PayloadMessagesMarqueeBlock } from '@/payload/payload-types';
import { cn } from '@/utils/cn';

export function MessagesMarqueeBlock({ messages }: PayloadMessagesMarqueeBlock) {
  if (!messages?.length) {
    return null;
  }

  const duplicatedMessages = messages.concat(messages).map(({ content }, i) => (
    <div
      key={i}
      className={cn([
        'relative isolate shrink-0 overflow-clip',
        'max-w-72 p-4 md:max-w-80 md:p-6',
        'rounded-sm bg-neutral-100/75 surface-card dark:bg-neutral-900',
        'text-center text-base text-balance md:text-lg',
      ])}
    >
      {content}
      <div
        className={cn([
          'absolute top-1/4 -right-1/4 -z-10 h-32 w-48',
          'rotate-45 rounded-full blur-3xl',
          'bg-dusty-rose-300/15 dark:bg-dusty-rose-800/15',
        ])}
      />
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
