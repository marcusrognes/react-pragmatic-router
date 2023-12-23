import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
import { useRouter } from './Router';

export function Link({
	                     children,
	                     ...props
                     }: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) {
	const {location, setLocation} = useRouter();

	return <a {...props} onClick={(e) => {
		props.onClick?.(e);

		if (e.defaultPrevented) {
			return;
		}

		e.preventDefault();

		if (props.href?.startsWith('/')) {
			setLocation(props.href);
		} else {
			setLocation(location + '/' + props.href);
		}
	}}>
		{children}
	</a>;
}

