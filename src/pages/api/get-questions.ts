import type { APIRoute } from "astro";
import supabase from "@/utils/supabase";

export const GET: APIRoute = async (req) => {
  const { data, error } = await supabase
    .from("daily_questions")
    .select("questions_data")
    .limit(1);
  if (error) {
    console.log(error);
    return new Response(JSON.stringify({ response: "Error" }));
  }
  console.log(data);
  return new Response(data[0].questions_data);
};
