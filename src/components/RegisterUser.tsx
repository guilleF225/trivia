import { useState } from "react";

export default function RegisterUser({ puntos }: { puntos: number }) {
  const [email, setEmail] = useState("");
  const [score, setScore] = useState(puntos);
  const [username, setUsername] = useState("");
  const [isRegistered, setIsRegistered] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleUser = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const response = fetch("/api/registerscores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        score,
        username,
      }),
    }).then((res) => res.json());
    response.then((data) => {
      setIsLoading(false);
      console.log(data);
      if (data.response === "Usuario no registrado") {
        setIsRegistered(false);
      }
      if (data.response === "Usuario registrado exitosamente") {
        setSuccess(true);
      }
    });
  };
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-white">
      <h1>Bien jugado!</h1>

      {!success && (
        <form className="flex flex-col items-start justify-center gap-4 text-white">
          <p>Te gustaria sumar a tus puntuaciones?</p>
          {!isRegistered && (
            <>
              <label>Nombre de usuario</label>
              <input
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                type="text"
                placeholder="Tu nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </>
          )}
          {isRegistered && (
            <>
              <label>Email</label>
              <input
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                type="text"
                placeholder="Tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </>
          )}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
            onClick={(e) => handleUser(e)}
          >
            Sumar
          </button>
        </form>
      )}
      {success && <p className="text-green-500">Registrado exitosamente</p>}
    </div>
  );
}
