"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSetter } from "@/hooks/setter";
import styles from "./login.module.css";
const LOGIN_STORAGE_KEY = "teachly-ai-is-logged-in";
const LOGIN_TOKEN_KEY = "teachly-ai-token";
const LOGIN_USER_KEY = "teachly-ai-user";
const LOGIN_COOKIE = "teachly_ai_logged_in";




export default function LoginPage() {
  const router = useRouter();
  const { callSetter, loading, error } = useSetter();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const message =
      new URLSearchParams(window.location.search).get("error")?.trim() ?? "";

    if (!message) return;

    setToast(message);
    router.replace("/login");
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const loginResponse = await callSetter({url:"auth/login",
      bodyData: { email, password },
    });

    if (!loginResponse) return;

    try {
      window.localStorage.setItem(LOGIN_STORAGE_KEY, "true");
      window.localStorage.setItem(LOGIN_TOKEN_KEY, loginResponse.token);
      window.localStorage.setItem(
        LOGIN_USER_KEY,
        JSON.stringify(
          loginResponse.user ?? {
            email,
            name: email.split("@")[0],
          },
        ),
      );
    } catch {
      // Continue even if local storage is unavailable.
    }

    document.cookie = `${LOGIN_COOKIE}=true; path=/; max-age=2592000; SameSite=Lax`;
    router.replace("/");
  }

  return (
    <main className={styles.page} aria-labelledby="login-title">
      {toast && (
        <div className={styles.toast} role="alert">
          {toast}
        </div>
      )}

      <section className={styles.hero} aria-label="Teachly AI sign in">
        <div className={styles.copy}>
          <Link href="/" className={styles.brand} aria-label="Go to home">
            <span className={styles.brandMark}>
              <Sparkles size={20} aria-hidden="true" />
            </span>
            <span>Teachly AI</span>
          </Link>

          <div className={styles.message}>
            <p className={styles.kicker}>AI Visualization Labs</p>
            <h1 id="login-title">Learn AI with playful labs.</h1>
            <p>
              Sign in to continue your lessons, unlock hands-on activities,
              and keep your progress moving.
            </p>
          </div>

          <div className={styles.visualCard} aria-hidden="true">
            <Image
              src="/ai.png"
              alt=""
              width={520}
              height={360}
              priority
            />
          </div>

          <div className={styles.stats} aria-label="Learning highlights">
            <span>
              <CheckCircle2 size={16} aria-hidden="true" />
              4 guided levels
            </span>
            <span>
              <CheckCircle2 size={16} aria-hidden="true" />
              Hands-on labs
            </span>
            <span>
              <CheckCircle2 size={16} aria-hidden="true" />
              Saved progress
            </span>
          </div>
        </div>

        <form
          className={styles.panel}
          onSubmit={handleSubmit}
          aria-label="Login form"
        >
          <div className={styles.panelHeader}>
            <p className={styles.kicker}>Student Login</p>
            <h2>Welcome back</h2>
            <span>Use your class account to enter the lab.</span>
          </div>

          <label className={styles.field}>
            <span>Email address</span>
            <span className={styles.inputWrap}>
              <Mail size={18} aria-hidden="true" />
              <input
                type="email"
                name="email"
                placeholder="student@example.com"
                autoComplete="email"
                required
              />
            </span>
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <span className={styles.inputWrap}>
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </span>
          </label>

          <div className={styles.row}>
            <label className={styles.check}>
              <input type="checkbox" name="remember" />
              <span>Remember me</span>
            </label>
            <a href="#forgot-password">Forgot password?</a>
          </div>

          <button className={styles.submit} type="submit" disabled={loading}>
            <span>{loading ? "Signing in..." : "Enter labs"}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>

          {error && <p className={styles.error}>{error}</p>}

          <p className={styles.note}>
            New here? Ask your teacher for a class invite code.
          </p>
        </form>
      </section>
    </main>
  );
}
