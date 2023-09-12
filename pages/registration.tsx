import {useCookies} from "react-cookie";
import {cn} from "@/lib/utils";
import {className} from "postcss-selector-parser";
import {Input} from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import {useForm} from "react-hook-form";
import React, {useEffect} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";

export default function Registration() {
    const {register, handleSubmit, formState: {errors}} = useForm<UserAuthFormProps>();

    const {push} = useRouter();

    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string | null>(null)
    const [cookie, setCookie, removeCookie] = useCookies(['token', 'privilegeType']);

    useEffect(() => {
        if (cookie.privilegeType !== 'ADMIN') {
            setIsLoading(true);
            push('/');
        }
    }, []);

    interface UserRegistrationFormProps extends React.HTMLAttributes<HTMLDivElement> {
        name: string;
        surname: string;
        email: string;
        phone: string;
        password: string;
        ssn: string;
        country: string;
        city: string;
        adress: string;
    }

    async function onSubmit(data: UserRegistrationFormProps) {
        setIsLoading(true);
        try {
            await axios.post('http://localhost:8080/api/v1/auth/register', {
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                password: data.password,
                ssn: data.ssn,
                country: data.country,
                city: data.city,
                adress: data.adress,
            })
                .then((response) => {
                    console.log(response.data);
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
                            <Label className="sr-only" htmlFor="password">
                                Password
                            </Label>
                            <Input
                                id="password"
                                placeholder="password"
                                type="password"
                                autoComplete="current-password"
                                autoCorrect="off"
                                disabled={isLoading}
                                {...register("password", {required: true})}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="name">
                                Name
                            </Label>
                            <Input
                                id="name"
                                placeholder="name"
                                type="text"
                                autoComplete="name"
                                autoCorrect="off"
                                disabled={isLoading}
                                {...register("name", {required: true})}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="surname">
                                Surname
                            </Label>
                            <Input
                                id="surname"
                                placeholder="surname"
                                type="text"
                                autoComplete="surname"
                                autoCorrect="off"
                                disabled={isLoading}
                                {...register("surname", {required: true})}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="phone">
                                Phone
                            </Label>
                            <Input
                                id="phone"
                                placeholder="phone"
                                type="text"
                                autoComplete="phone"
                                autoCorrect="off"
                                disabled={isLoading}
                                {...register("phone", {required: true})}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="ssn">
                                SSN
                            </Label>
                            <Input
                                id="ssn"
                                placeholder="ssn"
                                type="text"
                                autoComplete="ssn"
                                autoCorrect="off"
                                disabled={isLoading}
                                {...register("ssn", {required: true})}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="country">
                                Country
                            </Label>
                            <Input
                                id="country"
                                placeholder="country"
                                type="text"
                                autoComplete="country"
                                autoCorrect="off"
                                disabled={isLoading}
                                {...register("country", {required: true})}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="city">
                                City
                            </Label>
                            <Input
                                id="city"
                                placeholder="city"
                                type="text"
                                autoComplete="city"
                                autoCorrect="off"
                                disabled={isLoading}
                                {...register("city", {required: true})}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="adress">
                                Adress
                            </Label>
                            <Input
                                id="adress"
                                placeholder="adress"
                                type="text"
                                autoComplete="adress"
                                autoCorrect="off"
                                disabled={isLoading}
                                {...register("adress", {required: true})}
                            />
                        </div>
                        <Button disabled={isLoading} className="py-4">
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            )}
                            Register
                        </Button>
                        {error && (
                            <div className="text-red-500 text-sm flex justify-center">{error}</div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}