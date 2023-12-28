import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
import { useRouter } from './Router';
import { patternMatcher } from './utils';

export function NavLink({
	                        children,
	                        activeClass,
	                        className,
	                        exact,
	                        ...props
                        }: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> & {
	activeClass?: string,
	exact?: boolean
}) {
	const { location, setLocation } = useRouter();
	let classNames = '';
	if (className) classNames += " " + className;


	const matches = patternMatcher(props.href || '', location, exact);

	if (!!matches) {
		classNames += " " + (activeClass || 'active');
	}


	return <a {...props} className={classNames} onClick={(e) => {
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

