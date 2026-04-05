import type { RichTextComponent } from '@/components/rich-text/types';
import type { PayloadSectionBlock } from '@/payload/payload-types';
import { cn } from '@/utils/cn';
import { slugify } from '@/utils/slugify';

interface SectionBlockProps extends PayloadSectionBlock {
  RichText: RichTextComponent;
}

export function SectionBlock({
  background,
  columns,
  content,
  contentColumnOne,
  contentColumnTwo,
  heading,
  RichText,
}: SectionBlockProps) {
  return (
    <section
      className={cn(
        'relative isolate overflow-section overflow-hidden py-16',
        background === 'dark' && 'dark bg-black text-neutral-200',
      )}
    >
      <h1
        id={slugify(heading)}
        data-background={background}
        className="mb-8 text-4xl shadow-black/10 t-shadow-lg data-[background='dark']:shadow-white/15 xs:text-5xl"
      >
        {heading}
      </h1>
      {columns === '1' && content?.root?.children ? <RichText data={content} /> : null}
      {columns === '2' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12">
          {contentColumnOne?.root?.children ? (
            <div>
              <RichText data={contentColumnOne} />
            </div>
          ) : null}
          {contentColumnTwo?.root?.children ? (
            <div>
              <RichText data={contentColumnTwo} />
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
