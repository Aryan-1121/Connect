import { authMiddleware } from "@clerk/nextjs";


// const protectedRoute = createRouteMatcher([
//     '/',
//     '/upcoming',
//     '/meeting(.*)',
//     '/previous',
//     '/recordings',
//     '/personal-room',
//   ]);

  
// by default every route is protected by clerk 
export default authMiddleware({
  // Allow signed out users to access the specified routes:
  // publicRoutes: ['/anyone-can-visit-this-route'],
//   publicRoutes: ['/sign-in', 'sign-up'],                 // sign-in and sign-up will be taken from .env file 
});
 
export const config = {
  matcher: [
    // Exclude files with a "." followed by an extension, which are typically static files.
    // Exclude files in the _next directory, which are Next.js internals.
    "/((?!.+\\.[\\w]+$|_next).*)",
    // Re-include any files in the api or trpc folders that might have an extension
    "/(api|trpc)(.*)"
  ]
};