// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

// export default clerkMiddleware(async (auth, req) => {
//   if (isProtectedRoute(req)) await auth.protect()
// })

// export const config = {
//   matcher: [

//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

//     '/(api|trpc)(.*)',
//   ],
// }
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']); // This line is replaced/renamed

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isApiRoute = createRouteMatcher(["/api/(.*)"]); // Matches any route starting with /api/

export default clerkMiddleware(async (auth, req) => {
  // If it's a dashboard route, protect it
  if (isDashboardRoute(req)) {
    console.log("MIDDLEWARE: Protecting dashboard route:", req.url); // Optional: for debugging
    await auth.protect();
  }
  // If it's an API route, also protect it
  else if (isApiRoute(req)) {
    console.log("MIDDLEWARE: Protecting API route:", req.url); // Optional: for debugging
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
