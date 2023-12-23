import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
import { setLocation, useLocation, useNavigate, useRouter } from './Router';


export function Link({
	                     children,
	                     ...props
                     }: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) {
	const location = useLocation();
	const navigate = useNavigate();

	return <a {...props} onClick={(e) => {
		props.onClick?.(e);

		if (e.defaultPrevented) {
			return;
		}

		e.preventDefault();

		if (props.href?.startsWith('/')) {
			navigate(props.href);
		} else {
			navigate(location + '/' + props.href);
		}
	}}>
		{children}
	</a>;
}

