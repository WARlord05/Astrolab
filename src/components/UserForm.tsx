import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { UserData, getZodiacSignFromDate } from "@/lib/astrology";
import { toast } from "sonner";
import { Haptics } from "@capacitor/haptics";

// 1. Define Schema - Only collecting birth date, weight, and height
const formSchema = z.object({
  weight: z.coerce.number().min(1, "Weight must be positive").max(500, "Weight seems too high"),
  height: z.coerce.number().min(50, "Height must be at least 50 cm").max(300, "Height seems too high"),
  birthDate: z.date({
    required_error: "A birth date is required.",
  }).max(new Date(), "Birth date cannot be in the future."),
  birthTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM, e.g., 14:30)"),
});

type FormData = z.infer<typeof formSchema>;

interface UserFormProps {
  onSubmitData: (data: UserData) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmitData }) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: 70,
      height: 175,
      birthTime: "12:00",
    },
  });

  const { trigger } = form;

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    // Use Haptics for success feedback on mobile devices
    Haptics.vibrate({ duration: 50 });
    
    // Auto-calculate zodiac sign from birth date
    const zodiacSign = getZodiacSignFromDate(data.birthDate);
    
    const userDataWithZodiac: UserData = {
      ...data,
      zodiacSign,
    };
    
    onSubmitData(userDataWithZodiac);
    setIsLoading(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 w-full max-w-md">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-br from-purple-400 to-pink-400 p-4 rounded-full">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-white text-3xl font-bold mb-2">Get Your Horoscope</h1>
        <p className="text-purple-200">
          Enter your information to receive your personalized daily forecast
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Weight */}
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-sm font-semibold">Weight (kg)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 70" 
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                      {...field} 
                      onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} 
                      value={field.value === undefined ? '' : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Height */}
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-sm font-semibold">Height (cm)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 175" 
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                      {...field} 
                      onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} 
                      value={field.value === undefined ? '' : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Birth Date */}
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-white text-sm font-semibold">Birth Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white",
                          !field.value && "text-white/50"
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

          {/* Birth Time */}
          <FormField
            control={form.control}
            name="birthTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-sm font-semibold">Birth Time (HH:MM, 24h)</FormLabel>
                <FormControl>
                  <Input 
                    type="text" 
                    placeholder="e.g., 14:30" 
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full text-base py-6 font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? "Loading..." : "Generate My Horoscope"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UserForm;