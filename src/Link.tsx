import {AnchorHTMLAttributes, DetailedHTMLProps} from "react";
import {useRouter} from "./Router";

export function Link({
	                     children,
	                     ...props
                     }: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) {
	const router = useRouter();

	return <a {...props} onClick={(e) => {
		props.onClick?.(e);

		if (e.defaultPrevented) {
			return;
		}

		e.preventDefault();
		router.setPath(props.href || "/");
	}}>
		{children}
	</a>
}

