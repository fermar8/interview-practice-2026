import type { Route } from "./+types/practice";
import Practice from "../components/practice/practice";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Practice route" },
    { name: "description", content: "Welcome to Practice route!" },
  ];
}

export default function PracticeRoute() {
  return <Practice />;
}