import z from "zod";
export const SignupSchema=z.object({
    email:z.string().email(),
    password:z.string().min(6),
    username:z.string()
});

export const SigninSchema=z.object({
    email:z.string().email(),
    password:z.string().min(6)
});

export const MessageSchema=z.object({message:z.string().min(100)})

// email.z.string().email.name




export type Signup_type=z.infer<typeof SignupSchema>

export type Signin_type=z.infer<typeof SigninSchema>

export type Messsage_type=z.infer<typeof MessageSchema>

