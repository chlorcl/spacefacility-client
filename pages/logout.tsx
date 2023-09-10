import {useCookies} from "react-cookie";

export default function Logout() {
    const [cookie, setCookie, removeCookie] = useCookies(['token', 'privilegeType']);
    removeCookie('token', {path: '/'});
    removeCookie('privilegeType', {path: '/'});
    return null;
}