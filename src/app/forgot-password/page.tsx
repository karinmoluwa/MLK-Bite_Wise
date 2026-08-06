import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
export default function ForgotPage(){return <main className="standalone-page"><AuthForm mode="reset"/><p><Link href="/login">Return to login</Link></p></main>}
