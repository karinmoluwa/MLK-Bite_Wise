import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
export default function LoginPage(){return <main className="standalone-page"><AuthForm mode="login"/><p><Link href="/forgot-password">Forgot password?</Link> · <Link href="/signup">Create account</Link></p></main>}
