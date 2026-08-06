import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
export default function SignupPage(){return <main className="standalone-page"><AuthForm mode="signup"/><p><Link href="/login">Already registered? Sign in</Link></p></main>}
