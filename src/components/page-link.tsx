
"use client";

import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { usePageLoader } from './providers/page-loader-provider';
import React, { HTMLProps } from 'react';

type PageLinkProps = LinkProps & HTMLProps<HTMLAnchorElement>;

export function PageLink({ href, children, ...props }: PageLinkProps) {
  const router = useRouter();
  const { showLoader } = usePageLoader();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    showLoader();
    router.push(href.toString());
  };

  return (
    <a href={href.toString()} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
