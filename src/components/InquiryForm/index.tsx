'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar as IconCalendar } from 'iconoir-react';
import { useForm } from 'react-hook-form';
import isMobilePhone from 'validator/lib/isMobilePhone';
import * as z from 'zod';

import { Button } from '@/lib/components/Button';
import { Calendar } from '@/lib/components/Calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/lib/components/Form';
import Icons from '@/lib/components/Icons';
import { Input } from '@/lib/components/Input';
import { Popover, PopoverContent, PopoverTrigger } from '@/lib/components/Popover';
import { RadioGroup, RadioGroupItem } from '@/lib/components/RadioGroup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/components/Select';
import { Textarea } from '@/lib/components/TextArea';
import { useToast } from '@/lib/hooks/use-toast';
import { PayloadInquiry } from '@/lib/types/payload';
import { cn } from '@/lib/utils';

const Row = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('flex w-full flex-col gap-6 sm:flex-row', className)}>{children}</div>
);

const formSchema = z.object({
  first: z.string().min(1, {
    message: 'First name is required',
  }),
  last: z.string().min(1, {
    message: 'Last name is required',
  }),
  email: z.string().email({
    message: 'Must be a valid email address',
  }),
  phone: z.string().refine(isMobilePhone, {
    message: 'Must be a valid phone number',
  }),
  dates: z.object({
    from: z.date({
      required_error: 'Date is required',
    }),
    to: z.date().optional(),
  }),
  budget: z.string().min(1, {
    message: 'Budget is required',
  }),
  location: z.string().min(1, {
    message: 'Location is required',
  }),
  information: z.string().min(1, {
    message: 'Information is required',
  }),
  names: z.string().optional(),
  openToOtherCreators: z.enum(['no', 'yes'], {
    required_error: 'Selection is required',
  }),
});

export default function InquiryForm() {
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first: '',
      last: '',
      email: '',
      phone: '',
      dates: {},
      location: '',
      budget: '',
      information: '',
      names: '',
      openToOtherCreators: 'no',
    },
  });
  const { toast } = useToast();

  function formatDateShort(date: Date) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true);

    const inquiry: PayloadInquiry = {
      first: values.first,
      last: values.last,
      email: values.email,
      phone: values.phone,
      startDate: values.dates.from.toISOString(),
      endDate: values.dates.to?.toISOString() ?? null,
      budget: values.budget,
      location: values.location,
      information: values.information,
      photographerNames: values.names,
      openToOtherCreators: values.openToOtherCreators,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_URL}/api/inquiries`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiry),
      });

      const data = await res.json();

      if (!res.ok || data.errors) {
        toast({
          title: 'Oh no!',
          description: data.errors[0].message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Thank you!',
          description: 'Your inquiry has been submitted.',
          variant: 'success',
        });
        form.reset();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Oh no!',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
        <Row>
          <FormField
            control={form.control}
            name="first"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Row>
        <Row>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Row>
        <Row>
          <FormField
            control={form.control}
            name="dates"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Dates</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <button
                        className={cn(
                          'flex h-14 w-full flex-row items-center justify-between rounded-xl border border-black border-opacity-75 bg-white pl-5 pr-4 text-lg text-black transition hover:border-opacity-100 hover:bg-black/5 focus:border-opacity-100 focus:outline-none focus:ring-2 focus:ring-black/75 dark:border-white dark:bg-black dark:text-white dark:hover:bg-white/5 dark:focus:ring-white/75',
                          !field.value && 'text-black/75',
                        )}
                      >
                        {field.value?.from ? (
                          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                            {field.value.to ? (
                              <>
                                {formatDateShort(field.value.from)} &ndash; {formatDateShort(field.value.to)}
                              </>
                            ) : (
                              formatDateShort(field.value.from)
                            )}
                          </span>
                        ) : (
                          <span />
                        )}
                        <IconCalendar className={cn(!field.value && 'text-black', 'justify-end')} />
                      </button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      numberOfMonths={1}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget</FormLabel>
                <Select value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="pr-4">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="$1,000 – $1,500">$1,000 &ndash; $1,500</SelectItem>
                    <SelectItem value="$1,500 – $2,000">$1,500 &ndash; $2,000</SelectItem>
                    <SelectItem value="$2,000 – $2,500">$2,000 &ndash; $2,500</SelectItem>
                    <SelectItem value="$2,500+">$2,500+</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </Row>
        <Row>
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Row>
        <FormField
          control={form.control}
          name="information"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Information</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Tell me more about your venue (name, location, theme, etc.), wedding events that you&apos;d like covered
                (welcome party, rehearsal dinner, etc.), or anything else!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="names"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photographer and videographer names (optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="openToOtherCreators"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Are you comfortable working with another creator on our team if Jesse is unavailable?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  value={field.value ?? 'no'}
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? 'no'}
                  className="flex flex-col justify-start"
                >
                  <FormItem className="flex flex-row gap-3">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="text-lg font-normal text-black">No, I only want to work with Jesse</FormLabel>
                  </FormItem>
                  <FormItem className="flex flex-row gap-3">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="text-lg font-normal text-black">
                      I&apos;m open to working with other team members who are the best of the best
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Row className="col-span-2 mt-6 flex items-end justify-end">
          <Button
            type="submit"
            disabled={pending}
            variant="solid"
            size="lg"
            iconPosition="right"
            className="xs:w-full sm:w-fit"
            data-umami-event="Inquiry form submit"
            data-umami-event-first={form.watch('first')}
            data-umami-event-last={form.watch('last')}
            data-umami-event-email={form.watch('email')}
          >
            Submit
            {pending ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/25 border-t-black/10 dark:border-white/50 dark:border-t-white/25" />
            ) : (
              <Icons name="arrowRight" size="lg" />
            )}
          </Button>
        </Row>
      </form>
    </Form>
  );
}
