"use client";

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { getWeatherDataByZip } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TemperatureChart } from '@/components/temperature-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ThermometerSun } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const initialState = {
  data: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="font-semibold">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Get Weather
    </Button>
  );
}

export default function Home() {
  const [state, formAction] = useActionState(getWeatherDataByZip, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
    }
  }, [state, toast]);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24 bg-background font-body">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="z-10 w-full max-w-7xl items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-foreground/90">
          TemperatureChart
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Enter a US zip code to see the 24-hour temperature forecast.
        </p>

        <form action={formAction} className="flex w-full max-w-sm mx-auto items-center space-x-2 mb-12">
          <Input 
            type="text" 
            name="zipcode" 
            placeholder="Enter 5-digit zip code" 
            required 
            pattern="\d{5}"
            maxLength={5}
            className="text-base"
          />
          <SubmitButton />
        </form>

        <div className="w-full">
          {state.data ? (
            <TemperatureChart data={state.data.forecast} location={state.data.location} />
          ) : (
            <Card className="w-full animate-in fade-in-0 duration-500">
                <CardHeader>
                    <CardTitle>Welcome!</CardTitle>
                    <CardDescription>Your 24-hour forecast will appear here.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-96">
                    <ThermometerSun className="w-24 h-24 text-primary mb-4" />
                    <p className="text-muted-foreground">Enter a zip code above to get started.</p>
                </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
