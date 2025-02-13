import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(){
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({token, req}) => {
                const {pathname} = req.nextUrl;

                // allow auth related routes
                if(
                    pathname.startsWith("/api/auth") || 
                    pathname === "/login" || 
                    pathname === "/register"
                    ){
                    return true;
                }

                // public path
                if(pathname === "/" || pathname.startsWith("/api/videos")){
                    return false;
                }

                return !!token
            }
        }
    }
)

// where we need to run middleware config contains that path
export const config = {
    mathcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"]
};
