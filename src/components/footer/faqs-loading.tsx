import { Icons } from '@/icons';

function FaqLoadingRow() {
  return (
    <div className="flex flex-row border-b-2 border-black/75 py-4 last:border-b-0 dark:border-neutral-200/75">
      <div className="h-6 w-full animate-pulse rounded-lg bg-white/5" />
      <div className="flex h-8 items-center justify-center">
        <Icons name="navArrowDown" className="size-6" />
      </div>
    </div>
  );
}

export function FaqsLoading() {
  return (
    <div className="flex flex-col">
      <FaqLoadingRow />
      <FaqLoadingRow />
      <FaqLoadingRow />
    </div>
  );
}
