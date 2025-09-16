import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
    "/sign-in(.*)",  // Correct
    "/sign-up(.*)",  // Correct
]);


export default clerkMiddleware(async (auth, req) => {
    // `req` should be the Edge Request object (this might differ from traditional Node.js)
    if (!isPublicRoute(req)) {
        await auth.protect(); // This should work as expected
    }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
