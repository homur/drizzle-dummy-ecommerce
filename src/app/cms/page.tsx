import { redirect } from "next/navigation";

export default function CMSRoot() {
  redirect("/cms/dashboard");
}
