
import SignInFormDemo from "@/components/signin";
import { BoxesCore } from "@/components/ui/background-boxes";

export default function SignUpPage() {
    return (
        <div className="min-h-screen w-full overflow-hidden bg-neutral-950 relative flex items-center justify-center antialiased p-4">
            <div className="absolute inset-0 w-full h-full bg-neutral-950 z-20 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />

            <BoxesCore />

            <div className="relative z-30 w-full max-w-sm sm:max-w-md mx-auto">
                <SignInFormDemo />
            </div>
        </div>
    );
}