import {useRouter} from "next/router";
import {Form, useForm} from "react-hook-form";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React from "react";
import {Github, Loader2} from "lucide-react";
import {cn} from "@/lib/utils";
import {className} from "postcss-selector-parser";
import axios from "axios";
import {useCookies} from "react-cookie";

export default function Login() {

    const {push} = useRouter();

    interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
        email: string;
        password: string;
    }

    const {register, handleSubmit, formState: {errors}} = useForm<UserAuthFormProps>();

    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string | null>(null)
    const [cookie, setCookie, removeCookie] = useCookies(['token', 'privilegeType']);

    async function onSubmit(data: UserAuthFormProps) {
        setIsLoading(true);
        try {
            await axios.post('http://localhost:8080/api/v1/auth/login', {
                email: data.email,
                password: data.password
            })
                .then((response) => {
                    console.log(response.data);
                    setCookie('token', response.data.token, {path: '/'});
                    setCookie('privilegeType', response.data.privilegeType, {path: '/'});
                    push('/');
                });
        } catch (e) {
            return;
        }
        setIsLoading(false);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <div className={cn("grid gap-4 ", className)}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-2">
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="email">
                                Email
                            </Label>
                            <Input
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading}
                                {...register("email", {required: true})}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="email">
                                Password
                            </Label>
                            <Input
                                id="password"
                                placeholder="Password"
                                type="password"
                                autoCapitalize="none"
                                autoComplete="current-password"
                                autoCorrect="off"
                                disabled={isLoading}
                                {...register("password", {required: true})}
                            />
                        </div>
                        <Button disabled={isLoading} className="py-4">
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            )}
                            Login
                        </Button>
                        {error && (
                            <div className="text-red-500 text-sm flex justify-center">{error}</div>
                        )}
                    </div>
                </form>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"/>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
                    </div>
                </div>
                <Button variant="outline" type="button" disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    ) : (
                        <Github className="mr-2 h-4 w-4"/>
                    )}{" "}
                    Github
                </Button>
            </div>
        </div>
    );

}