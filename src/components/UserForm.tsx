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
import { differenceInYears } from "date-fns";

// 1. Define Schema - Only collecting birth date, weight, height, and language preference
const formSchema = z.object({
  weight: z.coerce.number().min(1, "Weight must be positive").max(500, "Weight seems too high"),
  height: z.coerce.number().min(50, "Height must be at least 50 cm").max(300, "Height seems too high"),
  birthDate: z.date({
    required_error: "A birth date is required.",
  }).max(new Date(), "Birth date cannot be in the future."),
  birthTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM, e.g., 14:30)"),
  preferredLanguage: z.string().default('en'),
});

type FormData = z.infer<typeof formSchema>;

interface UserFormProps {
  onSubmitData: (data: UserData) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmitData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: 70,
      height: 175,
      birthTime: "12:00",
      preferredLanguage: "en",
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
      zodiacSign,
      weight: data.weight,
      height: data.height,
      birthDate: data.birthDate,
      birthTime: data.birthTime,
      preferredLanguage: data.preferredLanguage,
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
                      value={field.value || ''}
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
                      value={field.value || ''}
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
            render={({ field }) => {
              const age = field.value ? differenceInYears(new Date(), field.value) : null;
              const zodiac = field.value ? getZodiacSignFromDate(field.value) : null;
              
              const setToday = () => {
                field.onChange(new Date());
                setIsDatePickerOpen(false);
              };

              const handleDateSelect = (date: Date | undefined) => {
                field.onChange(date);
                setIsDatePickerOpen(false);
              };
              
              return (
              <FormItem className="flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <FormLabel className="text-white text-sm font-semibold">Birth Date</FormLabel>
                  {age !== null && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold">Age: {age}</span>
                      {zodiac && <span className="text-xs text-purple-200">♈ {zodiac}</span>}
                    </div>
                  )}
                </div>
                
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white/20 border border-white/30 text-white hover:bg-white/30 hover:text-white transition-all rounded-lg",
                          !field.value && "text-white/50"
                        )}
                      >
                        <CalendarIcon className="mr-3 h-4 w-4" />
                        <span className="text-sm">{field.value ? format(field.value, "MMM d, yyyy") : "Select a date"}</span>
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-80 p-0 shadow-xl rounded-xl overflow-hidden fixed z-50" 
                    align="center"
                    style={{
                      left: '50%',
                      top: '35%',
                      transform: 'translate(-50%, -50%)',
                      maxHeight: '85vh',
                      overflowY: 'auto'
                    }}
                  >
                    <div className="bg-slate-900 p-6 border border-slate-700">
                      {/* Header with month/year */}
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-white">
                          {field.value ? format(field.value, "MMMM yyyy") : "Select date"}
                        </h3>
                      </div>

                      {/* Calendar */}
                      <div className="mb-4">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={handleDateSelect}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          captionLayout="dropdown"
                          fromYear={1900}
                          toYear={new Date().getFullYear()}
                          className="rounded-lg"
                          classNames={{
                            months: "flex flex-col",
                            month: "space-y-4",
                            caption: "flex gap-2 justify-between items-center px-2 mb-4",
                            caption_label: "text-sm font-medium text-slate-200",
                            nav: "flex gap-1",
                            nav_button: "h-8 w-8 p-0 hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200 transition-colors",
                            nav_button_previous: "absolute left-1 w-8 h-8",
                            nav_button_next: "absolute right-1 w-8 h-8",
                            table: "w-full border-collapse",
                            head_row: "flex mb-2 gap-2",
                            head_cell: "w-full text-center text-xs font-semibold text-slate-400 rounded-md",
                            row: "flex gap-2 w-full",
                            cell: "h-8 w-full text-center text-sm relative p-0 focus-within:relative focus-within:z-20",
                            day: "h-8 w-full rounded font-medium text-slate-300 hover:bg-slate-700 transition-colors",
                            day_range_end: "day-range-end",
                            day_selected: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-md",
                            day_today: "bg-slate-700 text-purple-300 font-semibold",
                            day_outside: "text-slate-600",
                            day_disabled: "text-slate-600 cursor-not-allowed",
                            day_hidden: "invisible",
                            ...{},
                          }}
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-3 justify-end border-t border-slate-700 pt-4">
                        <button
                          type="button"
                          onClick={setToday}
                          className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          Today
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            field.onChange(null);
                            setIsDatePickerOpen(false);
                          }}
                          className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
              );
            }}
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

          {/* Preferred Language */}
          <FormField
            control={form.control}
            name="preferredLanguage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-sm font-semibold">🌍 Preferred Language</FormLabel>
                <FormControl>
                  <select 
                    {...field}
                    className="w-full bg-white/20 border border-white/30 text-white rounded-lg px-3 py-2 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="en" className="bg-purple-900 text-white">English</option>
                    <option value="es" className="bg-purple-900 text-white">🇪🇸 Spanish</option>
                    <option value="fr" className="bg-purple-900 text-white">🇫🇷 French</option>
                    <option value="de" className="bg-purple-900 text-white">🇩🇪 German</option>
                    <option value="it" className="bg-purple-900 text-white">🇮🇹 Italian</option>
                    <option value="pt" className="bg-purple-900 text-white">🇵🇹 Portuguese</option>
                    <option value="ja" className="bg-purple-900 text-white">🇯🇵 Japanese</option>
                    <option value="zh-CN" className="bg-purple-900 text-white">🇨🇳 Chinese</option>
                    <option value="ko" className="bg-purple-900 text-white">🇰🇷 Korean</option>
                    <option value="hi" className="bg-purple-900 text-white">🇮🇳 Hindi</option>
                    <option value="mr" className="bg-purple-900 text-white">🇮🇳 Marathi</option>
                  </select>
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