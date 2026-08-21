import { redirect } from "next/navigation";

// Submit idea portal has been removed. Redirect to home.
export default function SubmitIdeaPage() {
  redirect("/");
}
