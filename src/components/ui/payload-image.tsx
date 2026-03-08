import Image from 'next/image';
import Link from 'next/link';

import { Icons } from '@/icons';
import type { PayloadImagesCollection } from '@/payload/payload-types';
import { cn } from '@/utils/cn';
import { linkProps } from '@/utils/link';

export type PayloadImageProps = PayloadImagesCollection & {
  className?: string;
};

const PayloadImage = ({
  alt,
  className,
  createdAt: _createdAt,
  dataUrl,
  displayOriginal,
  filename,
  filesize: _filesize,
  focalX: _focalX,
  focalY: _focalY,
  hasLink,
  height: propsHeight,
  link,
  mimeType: _mimeType,
  sizes,
  thumbnailURL: _thumbnailURL,
  title,
  updatedAt: _updatedAt,
  url,
  width: propsWidth,
  ...props
}: PayloadImageProps) => {
  const src = displayOriginal ? url : sizes?.preview?.url;
  const width = displayOriginal ? propsWidth : sizes?.preview?.width;
  const height = displayOriginal ? propsHeight : sizes?.preview?.height;

  if (!src || !width || !height) {
    return null;
  }

  if (!hasLink || !link) {
    return (
      <Image
        src={src}
        width={width}
        height={height}
        placeholder="blur"
        blurDataURL={dataUrl ?? undefined}
        alt={alt || title || filename || ''}
        className={className}
        {...props}
      />
    );
  }

  return (
    <Link
      {...linkProps(link)}
      className={cn('group relative isolate block overflow-clip', className)}
    >
      <Image
        src={src}
        width={width}
        height={height}
        placeholder="blur"
        blurDataURL={dataUrl ?? undefined}
        alt={alt || title || filename || ''}
        className="z-10 transition duration-300 group-hover:scale-[1.02]"
        {...props}
      />
      <div className="absolute right-2 bottom-2 z-30 flex size-10 shrink-0 flex-row items-center justify-center rounded-sm bg-neutral-50/75 text-black backdrop-blur-lg transition duration-300 group-hover:bg-neutral-50/90">
        <Icons name={link.type === 'internal' ? 'arrowRight' : 'arrowUpRight'} />
      </div>
    </Link>
  );
};

export { PayloadImage };
