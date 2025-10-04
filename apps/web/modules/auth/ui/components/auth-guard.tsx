// "use client"

// import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";
// import AuthLayout from "../layouts/auth-layout";
// import SignInView from "../views/sign-in-view";

// export const AuthGuard = ({ children} : {children : React.ReactNode}) => {
//     return (
//         <>
//             <AuthLoading>
//                 <AuthLayout>
//                     <p>Loading...</p>
//                 </AuthLayout>
//             </AuthLoading>
//             <Authenticated>
//                 <AuthLayout>
//                     {children}
//                 </AuthLayout>
//             </Authenticated>
//             <Unauthenticated>
//                 <AuthLayout>
//                     <SignInView />
//                 </AuthLayout>
//             </Unauthenticated>
//         </>
//     );
// }

"use client"

import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";
import AuthLayout from "../layouts/auth-layout";
import SignInView from "../views/sign-in-view";
import { Loader2 } from "lucide-react";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AuthLoading>
        <AuthLayout>
            <div className="flex flex-col justify-center items-center h-48 space-y-2">
                <Loader2 className="animate-spin text-primary" size={48} />
                <span className="text-primary text-lg font-medium">Loading</span>
            </div>
        </AuthLayout>
      </AuthLoading>
      <Authenticated>
        <AuthLayout>{children}</AuthLayout>
      </Authenticated>
      <Unauthenticated>
        <AuthLayout>
          <SignInView />
        </AuthLayout>
      </Unauthenticated>
    </>
  );
};
