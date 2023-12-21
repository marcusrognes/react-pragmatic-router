import {AnchorHTMLAttributes, DetailedHTMLProps} from "react";
import {useRouter} from "./Router";


export function useNavigate(){
	const router = useRouter();
	return (path: string) => {
		router.setPath(path);
	};
}

export function Link({
	                     children,
	                     ...props
                     }: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) {
	const navigate = useNavigate();

	return <a {...props} onClick={(e) => {
		props.onClick?.(e);

		if (e.defaultPrevented) {
			return;
		}

		e.preventDefault();
		navigate(props.href || "/");
	}}>
		{children}
	</a>
}

