import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
import { useRouter } from './Router';

export function Link({
						 children,
						 replace,
						 ...props
					 }: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> & {
	replace?: boolean
}) {
	const { location, setLocation } = useRouter();

	return <a {...props} onClick={(e) => {
		props.onClick?.(e);

		if (e.defaultPrevented) {
			return;
		}

		e.preventDefault();

		if (props.href?.startsWith('/')) {
			setLocation(props.href, { replace });
		} else {
			setLocation(location + '/' + props.href, { replace });
		}
	}}>
		{children}
	</a>;
}

