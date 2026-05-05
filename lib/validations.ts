import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email invalido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(3, "Informe o nome completo."),
    email: z.string().email("Email invalido."),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    confirmPassword: z.string().min(6, "Confirme a senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas nao coincidem.",
    path: ["confirmPassword"],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;

/** Criacao de utilizador caixa pelo admin (nao e autocadastro). */
export const adminCreateCaixaSchema = z.object({
  email: z.string().email("Email invalido."),
  fullName: z.string().min(2, "Informe o nome.").max(120),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export type AdminCreateCaixaSchema = z.infer<typeof adminCreateCaixaSchema>;

export const bookingSchema = z
  .object({
    packageId: z.uuid("Pacote invalido."),
    destinationId: z.uuid("Selecione um destino valido."),
    originCity: z.string().min(2, "Informe o local de partida."),
    destinationCity: z.string().min(2, "Informe o destino."),
    travelType: z.enum(["one-way", "round-trip"]),
    departureDate: z.string().min(1, "Data de partida obrigatoria."),
    returnDate: z.string().optional(),
    numTravelers: z.coerce.number().int().min(1, "Minimo de 1 viajante.").max(30),
    /** Rotulo da modalidade escolhida no formulario (ex.: "4 pessoas · Ida e volta"). */
    packageOptionLabel: z.string().max(200).optional(),
    fullName: z.string().min(3, "Informe o nome completo."),
    biNumber: z
      .string()
      .min(5, "Informe o Nr de BI.")
      .max(30, "Nr de BI muito longo."),
    baggageQty: z.coerce.number().int().min(0, "Bagagem nao pode ser negativa.").max(20).optional(),
    notes: z.string().max(1200).optional(),
  })
  .refine(
    (data) => {
      if (data.travelType === "one-way") return true;
      return !!data.returnDate;
    },
    {
      message: "Data de regresso obrigatoria para ida e volta.",
      path: ["returnDate"],
    },
  );

export type BookingSchema = z.infer<typeof bookingSchema>;
export type BookingFormValues = z.input<typeof bookingSchema>;

export const corporateSchema = z.object({
  fullName: z.string().min(3, "Informe o nome completo."),
  phone: z.string().min(8, "Informe um telefone valido."),
  companyName: z.string().min(2, "Informe a empresa."),
  nuit: z.string().min(4, "Informe o NUIT."),
  contactPerson: z.string().min(3, "Informe a pessoa de contacto."),
  paymentModality: z.enum(["antecipado", "postecipado"]),
  creditLimit: z.coerce.number().min(0),
});

export type CorporateFormValues = z.input<typeof corporateSchema>;
export type CorporateSchema = z.infer<typeof corporateSchema>;

export const vehicleBookingSchema = z
  .object({
    vehicleId: z.uuid("Selecione uma viatura valida."),
    startDate: z.string().min(1, "Data inicial obrigatoria."),
    endDate: z.string().min(1, "Data final obrigatoria."),
    destination: z.string().min(2, "Informe o destino."),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "A data final deve ser igual ou superior a inicial.",
    path: ["endDate"],
  });

export type VehicleBookingSchema = z.infer<typeof vehicleBookingSchema>;

/** Reserva criada pelo caixa em nome do cliente (persistida em `bookings`). */
export const staffReservationSchema = z
  .object({
    clientName: z.string().min(2, "Informe o nome do cliente."),
    clientContact: z.string().min(5, "Informe um contacto valido."),
    clientEmail: z.string().email("Email do cliente invalido."),
    reservationType: z.enum(["viagem", "pacote", "aluguer"]),
    destination: z.string().max(500).optional(),
    departureDate: z.string().min(1, "Data de ida obrigatoria."),
    returnDate: z.string().optional(),
    vehicleType: z.string().max(200).optional(),
    numTravelers: z.coerce.number().int().min(1, "Minimo 1 pessoa.").max(99),
    observations: z.string().max(2000).optional(),
    totalPrice: z.coerce.number().positive("Valor total deve ser positivo."),
    status: z.enum(["pendente", "confirmada", "cancelada", "concluida"]),
  })
  .superRefine((data, ctx) => {
    if (data.reservationType === "aluguer") {
      if (!data.vehicleType?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Indique o tipo de viatura para aluguer.",
          path: ["vehicleType"],
        });
      }
    } else if (!data.destination?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Indique o destino para viagem ou pacote.",
        path: ["destination"],
      });
    }
    if (data.returnDate?.trim() && data.departureDate) {
      if (new Date(data.returnDate) < new Date(data.departureDate)) {
        ctx.addIssue({
          code: "custom",
          message: "A data de volta nao pode ser anterior a ida.",
          path: ["returnDate"],
        });
      }
    }
  });

export type StaffReservationSchema = z.infer<typeof staffReservationSchema>;
