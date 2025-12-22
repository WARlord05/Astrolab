import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CalendarIcon, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { ZODIAC_SIGNS, UserData } from "@/lib/astrology";
import { toast } from "sonner";

// 1. Define Schema
const formSchema = z.object({
  weight: z.coerce.number().min(1, "Weight must be positive").max(500, "Weight seems too high"),
  height: z.coerce.number().min(50, "Height must be at least 50 cm").max(300, "Height seems too high"),
  birthDate: z.date({
    required_error: "A birth date is required.",
  }).max(new Date(), "Birth date cannot be in the future."),
  birthTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM, e.g., 14:30)"),
  zodiacSign: z.enum(ZODIAC_SIGNS, {
    required_error: "Please select your Zodiac Sign.",
  }),
  mood: z.enum(['Happy', 'Neutral', 'Stressed'], {
    required_error: "Please select your current mood.",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface UserFormProps {
  onSubmitData: (data: UserData) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmitData }) => {
  const [step, setStep] = useState(1);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: 70,
      height: 175,
      birthTime: "12:00",
      zodiacSign: undefined,
      mood: undefined,
    },
  });

  const { trigger, getValues } = form;

  const handleNext = async () => {
    let isValid = false;
    
    if (step === 1) {
      isValid = await trigger(["weight", "height", "birthDate", "birthTime"]);
    } else if (step === 2) {
      isValid = await trigger(["zodiacSign", "mood"]);
    }

    if (isValid) {
      setStep(step + 1);
    } else {
      toast.error("Please correct the errors before proceeding.");
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (data: FormData) => {
    onSubmitData(data as UserData);
  };

  const Step1 = () => (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="weight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Weight (kg)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="e.g., 75" 
                {...field} 
                onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} 
                value={field.value === undefined ? '' : field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="height"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Height (cm)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="e.g., 175" 
                {...field} 
                onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} 
                value={field.value === undefined ? '' : field.value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="birthDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="mt-2">Birth Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  captionLayout="dropdown"
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="birthTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Birth Time (HH:MM, 24h)</FormLabel>
            <FormControl>
              <Input type="text" placeholder="e.g., 14:30" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const Step2 = () => (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="zodiacSign"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Zodiac Sign</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your zodiac sign" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {ZODIAC_SIGNS.map((sign) => (
                  <SelectItem key={sign} value={sign}>
                    {sign}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="mood"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How are you feeling today?</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your current mood" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Happy">Happy</SelectItem>
                <SelectItem value="Neutral">Neutral</SelectItem>
                <SelectItem value="Stressed">Stressed</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const Step3 = () => {
    const data = getValues();
    return (
      <div className="space-y-6 p-4 border rounded-lg bg-muted/50">
        <h3 className="text-xl font-bold text-center text-primary">Review & Confirm</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ReviewItem label="Weight" value={`${data.weight} kg`} />
            <ReviewItem label="Height" value={`${data.height} cm`} />
            <ReviewItem label="Birth Date" value={data.birthDate ? format(data.birthDate, "PPP") : 'N/A'} />
            <ReviewItem label="Birth Time" value={data.birthTime} />
            <ReviewItem label="Zodiac Sign" value={data.zodiacSign} />
            <ReviewItem label="Current Mood" value={data.mood} />
        </div>
        <p className="text-sm text-muted-foreground pt-2 text-center flex items-center justify-center">
          <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
          All information looks correct. Click "Get Horoscope" below.
        </p>
      </div>
    );
  };

  const ReviewItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-center p-2 bg-background rounded-md border">
      <span className="text-sm font-medium text-muted-foreground">{label}:</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      default:
        return null;
    }
  };

  const stepTitles = [
    "1. Personal Metrics",
    "2. Astrological Details",
    "3. Confirmation",
  ];
  
  const progressValue = (step / 3) * 100;

  return (
    <Card className="w-full max-w-lg mx-auto shadow-2xl border-t-4 border-primary">
      <CardHeader className="pb-4">
        <CardTitle className="text-3xl font-extrabold text-center text-primary">Astrolab</CardTitle>
        <CardDescription className="text-center text-lg">
          {stepTitles[step - 1]}
        </CardDescription>
        <Progress value={progressValue} className="w-full mt-4 h-2" />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {renderStep()}
            
            <div className="flex justify-between pt-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" onClick={handleNext} className={cn({ "ml-auto": step === 1 })}>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Get Horoscope
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserForm;