export type MpesaSimulationResult = {
  reference: string;
  status: "confirmado" | "falhado";
};

function randomDigits(length: number) {
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

export function generateMpesaReference() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `MPESA-${y}${m}${d}-${randomDigits(6)}`;
}

export function simulateMpesaCharge(): MpesaSimulationResult {
  const success = Math.random() < 0.85;
  return {
    reference: generateMpesaReference(),
    status: success ? "confirmado" : "falhado",
  };
}
