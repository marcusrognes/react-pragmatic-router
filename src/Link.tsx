import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
import { useRouter } from './Router';

export function Link({
	children,
	replace,
	modal,
	...props
}: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> & {
	replace?: boolean,
	modal?: boolean,
}) {
	const { setLocation } = useRouter();

	return <a {...props} onClick={(e) => {
		props.onClick?.(e);

		if (e.defaultPrevented) {
			return;
		}

		e.preventDefault();

		props.href && setLocation(props.href, { replace, modal });
	}}>
		{children}
	</a>;
}
