import '../styles/globals.css'
import type {AppProps} from 'next/app'
import Navigation from "@/components/ui/navigation";
import {useEffect} from "react";

export default function App({Component, pageProps}: AppProps) {
    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
        }
        else {
            document.documentElement.classList.remove('dark')
        }
    }, []);
    return (
        <div className="flex flex-col">
            <Navigation/>
            <Component {...pageProps} />

        </div>
    )
}
