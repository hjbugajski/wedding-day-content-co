import { type ComponentProps, createElement } from 'react';

type Props = ComponentProps<'a'> & { href?: string; children?: React.ReactNode };

export default function NextLinkStub({ href, children, ...rest }: Props) {
  return createElement('a', { href, ...rest }, children);
}
