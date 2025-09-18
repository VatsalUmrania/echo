/**
 * Layout that centers its children in a full-viewport container for authentication pages.
 *
 * Renders a div that spans at least the full viewport (height and width) and centers its content using flexbox.
 *
 * @param children - Content to be rendered inside the centered auth layout (e.g., sign-in or sign-up forms).
 * @returns A JSX element that wraps `children` in the centered full-viewport container.
 */
export default function AuthLayout ({ children }: { children: React.ReactNode }) {
    return(
        <div className="min-h-screen min-w-screen h-full flex flex-col items-center justify-center">
            {children}
        </div>
    );
}


