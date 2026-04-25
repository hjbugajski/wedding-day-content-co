import { type ComponentProps, createElement } from 'react';

type Props = ComponentProps<'img'> & {
  blurDataURL?: string;
  placeholder?: string;
  priority?: boolean;
  fill?: boolean;
  quality?: number | string;
  loader?: unknown;
  unoptimized?: boolean;
};

export default function NextImageStub({
  blurDataURL: _blurDataURL,
  placeholder: _placeholder,
  priority: _priority,
  fill: _fill,
  quality: _quality,
  loader: _loader,
  unoptimized: _unoptimized,
  ...rest
}: Props) {
  return createElement('img', rest);
}
