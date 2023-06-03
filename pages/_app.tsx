import '../styles/globals.css'
import type {AppProps} from 'next/app'
import Navigation from "@/components/ui/navigation";

export default function App({Component, pageProps}: AppProps) {
    return (
        <div className="flex flex-col">
            <Navigation/>
            <Component {...pageProps} />
        </div>
    )
}
