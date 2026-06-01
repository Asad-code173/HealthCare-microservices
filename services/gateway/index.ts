import express, { type Request, type Response } from "express";
import cors from "cors";
const app = express();

const PORT = Number(process.env.PORT || 8080);


const serviceUrls = {
  auth:
    process.env.AUTH_SERVICE_URL ||
    "http://auth-service:8001",

  doctors:
    process.env.DOCTOR_SERVICE_URL ||
    "http://doctor-service:8002",

  patients:
    process.env.PATIENT_SERVICE_URL ||
    "http://patient-service:8003",

  appointments:
    process.env.APPOINTMENT_SERVICE_URL ||
    "http://appointment-service:8004",
};

app.use(cors());
app.use(express.json());


interface CustomError extends Error {
  statusCode?: number;
  payload?: unknown;
}

async function forwardRequest(
  method: string,
  targetUrl: string,
  body?: unknown,
  headers?: HeadersInit
) {
  const init: RequestInit = {
    method,
    headers: {
      "content-type": "application/json",
      ...(headers || {}),
    },
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const response = await fetch(targetUrl, init);
  const data = await response.json().catch(() => ({}));

  return {
    status: response.status,
    data,
    setCookie: response.headers.get("set-cookie"),
  };
}
function sendError(response: Response, error: CustomError) {
  response.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    details: error.payload || null,
  });
}


app.get("/health", (_req: Request, res: Response) => {
  res.json({
    service: "gateway-service",
    status: "ok",
    services: serviceUrls,
  });
});


// signup
// signup
app.post("/api/v1/auth/signup", async (req: Request, res: Response) => {
  try {
    const result = await forwardRequest(
      "POST",
      `${serviceUrls.auth}/api/v1/users/register`,
      req.body
    );


    if (result.setCookie) {
      res.setHeader("set-cookie", result.setCookie);
    }

    res.status(201).json(result.data);
  } catch (error) {
    sendError(res, error as CustomError);
  }
});

// login
app.post("/api/v1/auth/login", async (req, res) => {
  try {
    const result = await forwardRequest(
      "POST",
      `${serviceUrls.auth}/api/v1/users/login`,
      req.body
    );

    if (result.setCookie) {
      res.setHeader("set-cookie", result.setCookie);
    }

    res.status(result.status).json(result.data);
  } catch (error) {
    sendError(res, error as CustomError);
  }
});

// logout
app.post("/api/v1/auth/logout", async (req: Request, res: Response) => {
  try {
    const result = await forwardRequest(
      "POST",
      `${serviceUrls.auth}/api/v1/users/logout`,
      req.body,
      {
        authorization: req.headers.authorization || "",
        cookie: req.headers.cookie || "",
      }
    );

    if (result.setCookie) {
      res.setHeader("set-cookie", result.setCookie);
    }

    res.status(result.status).json(result.data);
  } catch (error) {
    sendError(res, error as CustomError);
  }
});
// refresh token
app.post(
  "/api/v1/auth/refresh-token",
  async (req: Request, res: Response) => {
    try {
      const payload = await forwardRequest(
        "POST",
        `${serviceUrls.auth}/api/v1/users/refresh-token`,
        req.body
      );

      res.json(payload);
    } catch (error) {
      sendError(res, error as CustomError);
    }
  }
);

// change password
app.post(
  "/api/v1/auth/change-password",
  async (req: Request, res: Response) => {
    try {
      const payload = await forwardRequest(
        "POST",
        `${serviceUrls.auth}/api/v1/users/change-password`,
        req.body,
        {
          authorization: req.headers.authorization || "",
        }
      );

      res.json(payload);
    } catch (error) {
      sendError(res, error as CustomError);
    }
  }
);

app.get("/api/v1/auth/me", async (req: Request, res: Response) => {
  try {
    const response = await forwardRequest(
      "GET",
      `${serviceUrls.auth}/api/v1/users/me`,
      undefined,
      {
        authorization: req.headers.authorization || "",
        cookie: req.headers.cookie || "",
      }
    );
   
    res.json(response);
  } catch (error) {
    sendError(res, error as CustomError);
  }
});


// upload-url
app.post("/api/v1/doctors/upload-url", async (req: Request, res: Response) => {
  try {
    const payload = await forwardRequest(
      "POST",
      `${serviceUrls.doctors}/api/v1/doctors/upload-url`,
      req.body,
      {
        authorization: req.headers.authorization || "",
        cookie: req.headers.cookie || "",
      }
    );
    res.json(payload);
  } catch (error) {
    sendError(res, error as CustomError);
  }
});

// create doctor
app.post("/api/v1/doctors", async (req: Request, res: Response) => {
  try {
    const payload = await forwardRequest(
      "POST",
      `${serviceUrls.doctors}/api/v1/doctors/create-doctors`,
      req.body,
      {
        authorization: req.headers.authorization || "",
        cookie: req.headers.cookie || "",
      }
    );
    res.status(201).json(payload);
  } catch (error) {
    sendError(res, error as CustomError);
  }
});

// get all doctors
app.get("/api/v1/doctors/admin", async (req: Request, res: Response) => {
  try {
    const payload = await forwardRequest(
      "GET",
      `${serviceUrls.doctors}/api/v1/doctors/getdoctors`,
      undefined,
      {
        authorization: req.headers.authorization || "",
        cookie: req.headers.cookie || "",
      }
    );
    res.json(payload);
  } catch (error) {
    sendError(res, error as CustomError);
  }
});


app.get("/api/v1/doctors", async (req: Request, res: Response) => {
  try {
    const payload = await forwardRequest(
      "GET",
      `${serviceUrls.doctors}/api/v1/doctors/get-doctors`,
    );
    res.json(payload);
  } catch (error) {
    sendError(res, error as CustomError);
  }
});
// get single doctor
app.get(
  "/api/v1/doctors/:doctorId",
  async (req: Request, res: Response) => {
    try {
      const payload = await forwardRequest(
        "GET",
        `${serviceUrls.doctors}/api/v1/doctors/${req.params.doctorId}`
      );

      res.json(payload);
    } catch (error) {
      sendError(res, error as CustomError);
    }
  }
);


app.put("/api/v1/doctors/:doctorId", async (req: Request, res: Response) => {
  try {
    const payload = await forwardRequest(
      "PUT",
      `${serviceUrls.doctors}/api/v1/doctors/update-doctor/${req.params.doctorId}`,
      req.body,
      { authorization: req.headers.authorization || "" }
    );
    res.json(payload);
  } catch (error) {
    sendError(res, error as CustomError);
  }
});
// delete doctors
app.delete(
  "/api/v1/doctors/:doctorId",
  async (req: Request, res: Response) => {
    try {
      const payload = await forwardRequest(
        "DELETE",
        `${serviceUrls.doctors}/api/v1/doctors/${req.params.doctorId}`,
        undefined,
        {
          authorization: req.headers.authorization || "",
        }
      );

      res.json(payload);
    } catch (error) {
      sendError(res, error as CustomError);
    }
  }
);

// register patient
app.post("/api/v1/patients", async (req: Request, res: Response) => {
  try {
    const payload = await forwardRequest(
      "POST",
      `${serviceUrls.patients}/api/v1/patients/register-patient`,
      req.body,
      {
        authorization: req.headers.authorization || "",
        cookie: req.headers.cookie || "",
      }
    );

    res.status(201).json(payload);
  } catch (error) {
    sendError(res, error as CustomError);
  }
});

// get all patients
app.get("/api/v1/patients", async (req: Request, res: Response) => {
  try {
    const payload = await forwardRequest(
      "GET",
      `${serviceUrls.patients}/api/v1/patients/get-patients`,
      undefined,
      {
        authorization: req.headers.authorization || "",
        cookie: req.headers.cookie || "",
      }
    );


    res.status(payload.status).json(payload.data);
  } catch (error) {
    sendError(res, error as CustomError);
  }
});

// create appointment
app.post("/api/v1/appointments", async (req: Request, res: Response) => {
  console.log("Gateway route hit");
  console.log("Body inside gateway is ", req.body)
  try {
    const payload = await forwardRequest(
      "POST",
      `${serviceUrls.appointments}/api/v1/appointments/create-booking`,

      req.body,
      {
        authorization: req.headers.authorization || "",
        cookie: req.headers.cookie || "",
      }
    );
    console.log("Payload:", payload);
    res.status(201).json(payload);
  } catch (error) {
    sendError(res, error as CustomError);
  }
}
);

//  get-appointments
app.get("/api/v1/appointments", async (req: Request, res: Response) => {
  try {
    const response = await forwardRequest(
      "GET",
      `${serviceUrls.appointments}/api/v1/appointments/get-booking`,
      undefined,
      {
        authorization: req.headers.authorization || "",
        cookie: req.headers.cookie || "",
      }
    );

    const appointments = response?.data?.data || [];

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    sendError(res, error as CustomError);
  }
});

// confirm booking 

app.patch("/api/v1/appointments/:id/confirm", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await forwardRequest(
      "PATCH",
      `${serviceUrls.appointments}/api/v1/appointments/confirm-booking/${id}`,
      undefined,
      {
        authorization: req.headers.authorization || "",
        cookie: req.headers.cookie || "",
      }
    );
    res.json(response?.data);
  } catch (error) {
    sendError(res, error as CustomError);
  }
});

// cancel booking

app.patch("/api/v1/appointments/:id/cancel", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await forwardRequest(
      "PATCH",
      `${serviceUrls.appointments}/api/v1/appointments/cancel-booking/${id}`,
      req.body,
      {
        authorization: req.headers.authorization || "",
        cookie: req.headers.cookie || "",
      }
    );
    res.json(response?.data);
  } catch (error) {
    sendError(res, error as CustomError);
  }
});




app.listen(PORT, "0.0.0.0", () => {
  console.log(`Gateway service running on port ${PORT}`);
});