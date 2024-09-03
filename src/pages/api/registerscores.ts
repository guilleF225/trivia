import type { APIRoute } from "astro";
import supabase from "@/utils/supabase";

const checkUser = async (email: string) => {
  const { data, error } = await supabase
    .from("userscores")
    .select("*")
    .eq("email", email);
  if (error) {
    console.log(error);
    return false;
  }
  if (data.length === 0) {
    return false;
  }
  return true;
};

const sumUserScore = async (email: string, score: number) => {
  const { data, error } = await supabase
    .from("userscores")
    .select("score")
    .eq("email", email);
  if (error) {
    console.log(error);
    return;
  }
  const newScore = data[0].score + score;
  return newScore;
};

export const POST: APIRoute = async ({ request }) => {
  const { email, score, username } = await request.json();
  const userExists = await checkUser(email);
  if (!userExists && !username) {
    return new Response(JSON.stringify({ response: "Usuario no registrado" }));
  }
  if (!userExists && username) {
    const { data, error } = await supabase.from("userscores").insert([
      {
        email: email,
        score: score,
        username: username,
        last_played: new Date(),
      },
    ]);
    if (error) {
      console.log(error);
      return new Response(
        JSON.stringify({ response: "Error al registrar el usuario" })
      );
    }
    return new Response(
      JSON.stringify({ response: "Usuario registrado exitosamente" })
    );
  }

  const { data, error } = await supabase
    .from("userscores")
    .update({
      score: await sumUserScore(email, score),
      last_played: new Date(),
    })
    .eq("email", email);
  if (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ response: "Error al registrar el usuario" })
    );
  }
  return new Response(
    JSON.stringify({ response: "Usuario registrado exitosamente" })
  );
};
