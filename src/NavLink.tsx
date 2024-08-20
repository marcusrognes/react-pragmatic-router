import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
import { useRouter } from './Router';
import { patternMatcher } from './utils';

export function NavLink({
	children,
	activeClass,
	className,
	exact,
	replace,
	...props
}: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> & {
	activeClass?: string,
	exact?: boolean,
	replace?: boolean
}) {
	const { location, setLocation } = useRouter();
	let classNames = '';
	if (className) classNames += ' ' + className;

	const matches = patternMatcher(props.href || '', location, exact);

	if (!!matches) {
		classNames += ' ' + (activeClass || 'active');
	}

	return <a {...props} className={classNames} onClick={(e) => {
		props.onClick?.(e);

		if (e.defaultPrevented) {
			return;
		}

		e.preventDefault();

		props.href && setLocation(props.href, { replace });
	}}>
		{children}
	</a>;
}

