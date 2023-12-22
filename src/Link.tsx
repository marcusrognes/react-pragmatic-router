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
	const router = useRouter();
	const navigate = useNavigate();

	return <a {...props} onClick={(e) => {
		props.onClick?.(e);

		if (e.defaultPrevented) {
			return;
		}

		e.preventDefault();

		if(props.href?.startsWith("/")){
			navigate(props.href);
		}else{
			navigate(router.path + "/" + props.href);
		}

	}}>
		{children}
	</a>
}

