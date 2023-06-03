import {NextRequest, NextResponse} from "next/server";
import axios from "axios";
import {cookies} from "next/headers";

export async function middleware(request: NextRequest) {
    if (!request.cookies.has('token')) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    if (request.cookies.has('token')) {

        if (request.cookies.get('token') === undefined) {
            request.cookies.delete('token');
            return NextResponse.redirect(new URL('/login', request.nextUrl));
        }

        await fetch(new URL("http://localhost:8080/api/auth/authenticate", request.nextUrl).toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: request.cookies.get('token')
            })
        }).then(async (res) => {
            console.log(res.status);
            if (res.status === 200) {
                return NextResponse.next();
            } else {
                request.cookies.delete('token');
                return NextResponse.redirect(new URL('/login', request.nextUrl));
            }
        });

    }
}

export const config = {
    middleware: true,
    matcher: ['/items', '/missions']
}